(function () { 'use strict';

    angular.module('reddmeetApp')
        .factory('AuthUserFactory', ['$http', '$log', AuthUserFactory])
        .factory('UserFactory', ['$http', '$log', UserFactory])
        ;

    /**
     * Load auth user data on init.
     */
    function AuthUserFactory($http, $log) {
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var authUserData = null;
        var authUserGeoloc = null;
        var authUserPromise = $http.get(apiUrl).then(response => {
            $log.debug('## response.data.authuser: ', response.data.authuser);
            if (! response.data.authuser) {
                window.location.href = '/';
            }
            authUserData = response.data.authuser
        });

        /** 
         * Use accurate location ONLY for distance calculation.
         * This is NEVER added to the user's profile data.
         */
        window.navigator.geolocation.getCurrentPosition(pos => authUserGeoloc = pos);

        return {

            getUsername: () => authUserPromise.then(() => authUserData.username),

            getAuthUser: () => authUserPromise.then(() => authUserData),

            getAuthUserSrList: () => authUserPromise.then(() => authUserData.subs),

            getDistance: (lat, lon) => get_distance(authUserGeoloc.coords.latitude, authUserGeoloc.coords.longitude, lat, lon),

            saveProfile: (fieldName) => {
                if (! authUserData) return; // Promise not yet fulfilled?
                let data = { profile: {} };
                if (typeof(fieldName) === 'string') fieldName = [fieldName];
                fieldName.forEach(val => data['profile'][val] = authUserData.profile[val]);
                $log.debug('### SENDING: ', data);
                return $http.put(apiUrl, data);
            },

            setProfile: (key, val) => { authUserData.profile[key] = val },

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
        var apiUrl = API_BASE + '/api/v1/u/' + username + '.json';

        return {
            getViewUser: username => $http.get(apiUrl).then(response => response.data.view_user),
        };
    };

})();
