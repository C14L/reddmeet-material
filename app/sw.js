// Manual service worker setup
const BASE_URL = 'http://localhost:8000/app/index.html#';

const SW_VERSION = 'v0.1.37';

const SW_LOG_PREFIX = '## SW '+SW_VERSION+' ## ';
const SW_APP_CACHE = 'app-cache-'+SW_VERSION;
const SW_IMG_CACHE = 'img-cache-'+SW_VERSION;
const SW_ACTIVE = true; // Turn ServiceWorker on or off.
const SW_SCRIPT_CACHE = false; // During dev do not cache scripts during install.

const SW_CACHE_URLS = [
    '/node_modules/angular-material/angular-material.css',
    '/node_modules/jquery/dist/jquery.min.js',
    '/node_modules/moment/min/moment.min.js',
    '/node_modules/angular/angular.min.js',
    '/node_modules/angular-animate/angular-animate.min.js',
    '/node_modules/angular-aria/angular-aria.min.js',
    '/node_modules/angular-moment/angular-moment.min.js',
    '/node_modules/angular-route/angular-route.min.js',
    '/node_modules/angular-messages/angular-messages.min.js',
    '/node_modules/angular-material/angular-material.min.js',
    '/node_modules/angular-websocket/dist/angular-websocket.min.js',

    '/app/assets/app.css',
    '/app/assets/profile.css',
    '/app/assets/user-card-list.css',
    
    '/app/src/controllers/ListsControllers.js',
    '/app/src/controllers/MainController.js',
    '/app/src/controllers/MapController.js',
    '/app/src/controllers/ProfileController.js',
    '/app/src/controllers/ResultsController.js',
    '/app/src/controllers/SearchOptionDialogControllers.js',
    '/app/src/controllers/SettingsControllers.js',
    '/app/src/controllers/SrController.js',
    '/app/src/controllers/StatsController.js',

    '/app/src/directives/FocusMe.js',
    '/app/src/directives/NgPicUpload.js',
    '/app/src/directives/SrChipComponent.js',
    '/app/src/directives/UserListCardComponent.js',
    
    '/app/src/services/WsFactory.js',
    '/app/src/services/ChatFactory.js',
    '/app/src/services/SearchResultsFactory.js',
    '/app/src/services/UserFactory.js',

    '/app/src/app.js',
    '/app/src/filter.js',
    '/app/src/utils.js',

    '/app/index.html',
    '/app/views/chats.html',
    '/app/views/component-user-list-card.html',
    '/app/views/map.html',
    '/app/views/matches.html',
    '/app/views/profile.html',
    '/app/views/results.html',
    '/app/views/search-dialog.html',
    '/app/views/search-dialog-distance.html',
    '/app/views/search-dialog-gender.html',
    '/app/views/search-dialog-order.html',
    '/app/views/search-dialog-srlist.html',
    '/app/views/settings-account.html',
    '/app/views/settings-location.html',
    '/app/views/settings-pictures.html',
    '/app/views/settings-profile.html',
    '/app/views/settings-subreddits.html',
    '/app/views/sr.html',
    '/app/views/stats.html',
    '/app/views/visits.html',

    '/app/manifest.json',
    '/static/icon256.png',
];

if (SW_ACTIVE) {
    console.log(SW_LOG_PREFIX + 'Active service worker.');

    // Try to load ".jpg" images from cache, but 
    // then always refresh cache from network.
    function serveImages(request) {
        return caches.open(SW_IMG_CACHE).then(cache => {
            return cache.match(request.url).then(cacheResponse => {
                let networkPromise = fetch(request).then(networkResponse => {
                    if (networkResponse.status == 200) {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    } else {
                        return fetch('/static/nopic.jpg');
                    }

                });
                return cacheResponse || networkPromise;
            })
        });
    }

    self.addEventListener('fetch', event => {
        let url = new URL(event.request.url);
        if (SW_CACHE_URLS.includes(url.pathname)) {
            if (SW_SCRIPT_CACHE) {
                // App files, cache only, don't revalidate from network.
                console.log(SW_LOG_PREFIX+' from app cache: '+event.request.url);
                event.respondWith(caches.open(SW_APP_CACHE).then(
                    cache => cache.match(event.request)));
            } else {
                console.log(SW_LOG_PREFIX+' app cache disabled (SW_SCRIPT_CACHE == false), serving static files from network.');
            }
        } else
        if (event.request.url.toLowerCase().indexOf('.jpg') >= 0) {
            // Images files, from cache, then revalidate cache from network.
            console.log(SW_LOG_PREFIX+' JPEG image: '+event.request.url);
            event.respondWith(serveImages(event.request));
        } else {
            // Other files, always fetch from network.
            console.log(SW_LOG_PREFIX+' other file from network: '+event.request.url);
            event.respondWith(fetch(event.request));
        }
    });

    self.addEventListener('install', event => {
        if (SW_SCRIPT_CACHE)
            event.waitUntil(caches.open(SW_APP_CACHE).then(
                cache => cache.addAll(SW_CACHE_URLS)));

        self.skipWaiting();
        console.log(SW_LOG_PREFIX+'Installed version', SW_VERSION, event);
    });

    self.addEventListener('activate', event => {
        console.log(SW_LOG_PREFIX+'Activated version', SW_VERSION, event);

        // TODO: Apparently, installing a new version of SW, also changes the 
        // ID for Push Notifications! Needs here to delete the old ID and set
        // the new ID on the server to continue to receive Push Notifications
    });

    self.addEventListener('push', event => {
        console.log(SW_LOG_PREFIX+'Push message received: ', event);
        let data = event.data.json();
        let title = '', args = {};
        
        if (data.notiftype == 'upvote') {
            title = 'Upvote from u/' + data.username;
            args = { 'body': 'Your profile on Reddmeet.com was upvoted!',
                     'icon': '/static/icon64.png',
                     'tag': 'reddmeet-upvote' };
        } else
        if (data.notiftype == 'match') {
            title = 'Match with @' + data.username;
            args = { 'body': 'You upvoted each other on Reddmeet.com',
                     'icon': '/static/icon64.png',
                     'tag': 'reddmeet-match' };
        } else
        if (data.notiftype == 'message') {
            title = 'Message from u/' + data.username;
            args = { 'body': data.teaser,
                     'icon': '/static/icon64.png',
                     'tag': 'reddmeet-message' };
        }
        
        event.waitUntil(self.registration.showNotification(title, args));
    });

    self.addEventListener('notificationclick', function(event) {
        console.log(SW_LOG_PREFIX+'event.notification: ', event.notification);
        let url, tag = event.notification.tag;
        switch(tag) {
            case 'reddmeet-upvote': url = BASE_URL + '/upvotes?recv'; break;
            case 'reddmeet-match': url = BASE_URL + '/upvotes?matches'; break;
            case 'reddmeet-message': url = BASE_URL + '/chats'; break;
        };
        console.log(SW_LOG_PREFIX+'notification click URL: ', url);
        event.notification.close(); // Close explicitly, required by Android
        event.waitUntil( clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) return client.focus();
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) return clients.openWindow(url);
        }));
    });

} else {
    console.log('No service worker.');
}
