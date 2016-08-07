(function () { 'use strict';

    angular.module('reddmeetApp')
        .factory('AuthUserFactory', ['$http', '$log', '$websocket', AuthUserFactory])
        .factory('UserFactory', ['$http', '$log', UserFactory])
        ;

    /**
     * Load auth user data on init.
     */
    function AuthUserFactory($http, $log, $websocket) {
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var pushNotificationApiUrl = API_BASE + '/api/v1/pushnotifications';
        var authUserData = null;
        var authUserGeoloc = null;
        var authUserWebsocket = null;

        var authUserPromise = $http.get(apiUrl).then(response => {
            $log.debug('## LOADING response.data.authuser: ', response.data.authuser);

            // no user loaded, then ask client to authenticate.
            if (! response.data.authuser) window.location.href = '/';

            // Cache response.
            authUserData = response.data.authuser

            // Check if push notifications are enabled on this device.
			navigator.serviceWorker.getRegistration()
			.then(reg => reg.pushManager.getSubscription())
			.then(sub => authUserData.profile.pref_receive_notification = !!sub);

            // Connect authenticated user to a websocket.
            authUserWebsocket = $websocket(WS_BASE);
            authUserWebsocket.onMessage(message => {
                $log.debug('### $websocket ### Message received: ', message);
                wsMessages.push(JSON.parse(message.data))
            });
            authUserWebsocket.onOpen(() => {
                $log.debug('### $websocket ### Websocket opened!');
                authUserData.wsConnected = true;
            });
            authUserWebsocket.onClose(() => {
                $log.debug('### $websocket ### Websocket closed!');
                authUserData.wsConnected = false;
            });
            authUserWebsocket.onError(() => {
                $log.debug('### $websocket ### Websocket ERROR!');
            });

        });

        /** 
         * Use accurate location ONLY for distance calculation.
         * This is NEVER added to the user's profile data.
         */
        window.navigator.geolocation.getCurrentPosition(pos => authUserGeoloc = pos);

        return {
            createPushNotificationEndpoint: sub => {
                // adds the endpoint to the authuser's profile.
                return $http.post(pushNotificationApiUrl, sub);
            },

            destroyPushNotificationEndpoint: sub => {
                // deletes the endpoint from authuser's profile. Use $http() to be
                // able to send body data with the DELETE request, see also
                // http://stackoverflow.com/q/299628/5520354
                return $http({
                    url: pushNotificationApiUrl, 
                    method: 'DELETE', 
                    data: sub,
                    headers: {"Content-Type": "application/json;charset=utf-8"}
                });
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
