(function () { 'use strict';

    angular.module('reddmeetApp')
        .factory('AuthUserFactory', ['$http', '$log', AuthUserFactory])
        .factory('UserFactory', ['$http', '$log', UserFactory])
        ;

    function AuthUserFactory($http, $log) {
        // Load auth user data on init.
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var authUserData = null;
        var authUserPromise = $http.get(apiUrl).then(response => authUserData = response.data.authuser);

        return {
            getUsername: () => authUserPromise.then(() => authUserData.username),
            getAuthUser: () => authUserPromise.then(() => authUserData),
            getAuthUserSrList: () => authUserPromise.then(() => authUserData.subs),
        };
    };

    function UserFactory($http, $log) {
        var apiUrl = API_BASE + '/api/v1/u/' + username + '.json';

        return {
            getViewUser: username => $http.get(apiUrl).then(response => response.data.view_user),
        };
    };

})();
