(function () {
    'use strict';

    angular.module('reddmeetApp')
        .factory('AuthUserFactory', ['$http', '$log', AuthUserFactory])
        .factory('UserFactory', ['$http', '$log', UserFactory])
        ;

    function AuthUserFactory($http, $log) {
        // Load auth user data on init.
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var authUserData = null;

        var authUserPromise = $http.get(apiUrl).then(response => {
            authUserData = response.data.authuser;
            $log.debug('# Authuser data loaded.', authUserData);
        }).catch(error => {
            $log.debug('Error loading auth user: ' + error.status + ' ' + error.statusText);
        });
        
        return {
            getUsername: () => authUserPromise.then(() => authUserData.username),
            getAuthUser: () => authUserPromise.then(() => authUserData),
            getAuthUserSrList: () => authUserPromise.then(() => authUserData.subs),
        };
    };

    function UserFactory($http, $log) {
        return {
            getViewUser: function (username) {
                var apiUrl = API_BASE + '/api/v1/u/' + username + '.json';

                return new Promise(function (resolve, reject) {
                    $http.get(apiUrl).then(function successCallback(response) {
                        response.data.view_user
                        setLocalStorage(cacheId, response.data.view_user);
                    },
                        function errorCallback(response) {

                        });
                });
            },
        };
    };


})();

