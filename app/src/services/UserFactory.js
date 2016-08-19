(function () { 'use strict';

    angular.module('reddmeetApp')
        .factory('AuthUserFactory', ['$rootScope', '$http', '$log', AuthUserFactory])
        .factory('UserFactory', ['$http', '$log', UserFactory])
        ;

    /**
     * Load auth user data on init.
     */
    function AuthUserFactory($rootScope, $http, $log, $websocket) {
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var subsApiUrl = API_BASE + '/api/v1/authuser_subs.json';
        var pushNotificationApiUrl = API_BASE + '/api/v1/pushnotifications';
        var authUserData = null;  // Buffer all of auth user's data here.
        var authUserGeoloc = null;

        var authUserPromise = $http.get(apiUrl).then(response => {
            $log.debug('# # # # LOADING Authuser --> response.data: ', response.data);

            // no user loaded, then ask client to authenticate.
            if (! response.data.authuser) window.location.href = '/';

            // Cache response.
            authUserData = response.data.authuser;

            // Check if push notifications for this user are enabled on this device.
			return navigator.serviceWorker.getRegistration();
        })
        .then(reg => reg.pushManager.getSubscription())
        .then(sub => {
            authUserData.profile.pref_receive_notification = !!sub;
            $log.debug('# # # # AuthUserFactory Push notification status:', authUserData.profile.pref_receive_notification);
            $log.debug('# # # # AuthUserFactory Push notification sub Object', sub);

            return authUserData;
        });

        /** 
         * Use accurate location ONLY for distance calculation.
         * This is NEVER added to the user's profile data.
         */
        window.navigator.geolocation.getCurrentPosition(pos => {
            authUserGeoloc = pos;
            console.log('@@@ authUserGeoloc set to -> ', authUserGeoloc);
        });

        return {
            createPushNotificationEndpoint: sub => {
                // adds the endpoint to the authuser's profile.
                return $http.post(pushNotificationApiUrl, sub);
            },

            /**
             * Delete the endpoint from authuser's profile. Use $http() to be
             * able to send body data with the DELETE request, see also
             * http://stackoverflow.com/q/299628/5520354
             */
            destroyPushNotificationEndpoint: sub => {
                return $http({
                    url: pushNotificationApiUrl, 
                    method: 'DELETE', 
                    data: sub,
                    headers: {"Content-Type": "application/json;charset=utf-8"}
                });
            },

            /**
             * Ask the server to update the user's subreddit list from their reddit
             * account, save it to the user's profile, and send it back here. Then
             * update the global authuser object and broadcast a change event.
             */
            subsUpdateFromReddit: () => {
                console.log('## ## ## AuthUserFactory.subsUpdateFromReddit() called! -- -- -- -- -- --- --');
                return $http.put(subsApiUrl).then(response => {
                    console.log('== == == == == response.data.subs --> ', response.data.subs);
                    authUserData.subs = response.data.subs;
                    $rootScope.$broadcast('authuser:profile_change', null);
                });
            },

            subsSaveFavorites: subs => {                
                console.log('-- -- -- -- subs --> ', subs);

                return Promise.resolve();
            },

            getUsername: () => authUserPromise.then(() => authUserData.username),

            getAuthUser: () => authUserPromise.then(() => authUserData),

            getAuthUserSrList: () => authUserPromise.then(() => authUserData.subs),

            getDistance: (lat, lon) => get_distance(authUserGeoloc.coords.latitude, authUserGeoloc.coords.longitude, lat, lon),

            saveProfile: (fieldName) => {
                $log.debug('### PREPARE FOR fieldName:', fieldName);
                if (! authUserData) return; // Promise not yet fulfilled?
                let data = { profile: {} };
                if (typeof(fieldName) === 'string') fieldName = [fieldName];
                fieldName.forEach(val => data['profile'][val] = authUserData.profile[val]);
                $log.debug('### SENDING authUserData parts: ', data);
                return $http.put(apiUrl, data);
            },

            setProfile: (key, val) => { authUserData['profile'][key] = val },

            getProfile: (key) => { return authUserData['profile'][key] },

            setFuzzyGeoloc: () => {
                // Update fuzzy geo location values.
                return await_fuzzy_geoloc(authUserData.profile['fuzzy']).then(coords => {
                    authUserData.profile.lat = coords.lat;
                    authUserData.profile.lng = coords.lng;
                });
            }

        };
    };

    /**
     * Factory for regular user profiles.
     */
    function UserFactory($http, $log) {
        var viewUserData = null;
        var voteApiUrlBase = API_BASE + '/api/v1/flag/';

        return {
            createFlag: (vote, user) => {
                return $http.post(voteApiUrlBase + vote + '/' + user.username);
            },
            
            destroyFlag: (vote, user) => {
                return $http.delete(voteApiUrlBase + vote + '/' + user.username);
            },

            getViewUser: username => {
                let promise = Promise.resolve();
                if (viewUserData && viewUserData.view_user.username == username) {
                    return promise.then(() => viewUserData);
                }
                $log.debug('## LOADING view user: ', username);
                let url = API_BASE + '/api/v1/u/' + username + '.json';
                return $http.get(url).then(response => {
                    viewUserData = response.data;
                    return viewUserData;
                });
            },
        };
    };

})();
