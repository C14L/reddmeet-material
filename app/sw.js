// Manual service worker setup

const SW_VERSION = 'v0.1.6';
const SW_LOG_PREFIX = '## SW '+SW_VERSION+' ## ';
console.log(SW_LOG_PREFIX + 'Running Service Worker...');

self.addEventListener('fetch', event => {
    //const defaultArgs = { headers: { 'Content-Type': 'text/html;charset=UTF-8' } };
    //const defaultResponse = new Response('<p>Reddmeet app</p>', args);

    event.respondWith(
        fetch(event.request).then(response => {
            if (response.status !== 200) {
                console.log(SW_LOG_PREFIX+' response.status: '+response.status);
                if (event.request.url.toLowerCase().indexOf('.jpg') >= 0) {
                    console.log(SW_LOG_PREFIX+' file ext is JPG.');
                    return fetch('/static/nopic.jpg');
                }
            }

            return response;
        })
        .catch(err => new Response("No network :("))
    );
});

self.addEventListener('install', event => {
    self.skipWaiting();
    console.log(SW_LOG_PREFIX+'Installed', event);
});

self.addEventListener('activate', event => {
    console.log(SW_LOG_PREFIX+'Activated', event);
});

self.addEventListener('push', event => {
    console.log(SW_LOG_PREFIX+'Push message received', event);
    if (event.data && event.data.type === 'upvote') {
        var title = event.data.username + ' just upvoted your Reddmeet profile.';
    } 
    else if (event.data && event.data.type === 'message') {
        var title = 'Message from ' + event.data.username + ': ' + event.data.messageText;
    }
    else {
        var title = 'Something happened, check your Reddmeet profile.';
    }
    event.waitUntil(self.registration.showNotification(title, {
        body: 'The Message',
        icon: '/static/icon64.png',
        tag: 'my-tag'
    }));
});

self.addEventListener('notificationclick', function(event) {
    console.log(SW_LOG_PREFIX+'Notification click: tag ', event.notification.tag);
    event.notification.close(); // Close explicitly, required by Android
    var url = 'http://localhost:8000/app/index.html#';
    
    event.waitUntil( clients.matchAll({type: 'window'}).then( windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus' in client) {
                // If so, just focus it.
                return client.focus();
            }
        }
        if (clients.openWindow) {
            // If not, then open the target URL in a new window/tab.
            return clients.openWindow(url);
        }
    }));
});
