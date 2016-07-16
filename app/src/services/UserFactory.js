(function () {
    'use strict';

    angular.module('reddmeetApp')
        .factory('AuthUserFactory', ['$http', AuthUserFactory])
        .factory('UserFactory', ['$http', UserFactory])
        ;

    function AuthUserFactory($http) {
        // Load auth user data on init.
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var authUserData = null;

        var authUserPromise = $http.get(apiUrl).then(response => {
            authUserData = response.data;
        }).catch(error => {
            console.log('Error loading auth user: ' + error.status + ' ' + error.statusText);
        });
        
        return {
            getAuthUser: function () {
                authUserPromise.then(() => { return authUserData; });
            },
            getAuthUserSrList: function(){
                authUserPromise.then(() => { return authUserData.subs; });
            },
        };
    };

    function UserFactory($http) {
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

