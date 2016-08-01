(function () { 'use strict';

    angular.module('reddmeetApp').factory('MessagesFactory', ['$http', '$log', MessagesFactory]);

    function MessagesFactory($http, $log) {
        // Load auth user data on init.
        var apiUrlBase = API_BASE + '/api/v1/pms/';
        var messages = [];

        return {
            post: (msg, receiver) => {
                // Post a new message to the factory cahe and to the backend.
                // Then return the new messages list.
                if ( ! msg) return; // Empty msg text, nothing is posted.
                if ( ! receiver) return; // Empty receiver, nothing is posted.
                const msgApiUrl = apiUrlBase + receiver;
                const data = {
                    'msg': msg, 
                    'is_sent': false, // When POST returns 200.
                    'is_seen': false, // When receiver viewed msg on sender's profile page.
                };
                //messages.push(data);
                return $http.post(msgApiUrl, data).then(response => response.data);
            },
            fetch: username => {
                // Return the latest 50 messages, either from factory cache or
                // fetch from backend.
                const msgApiUrl = apiUrlBase + username;
                return $http.get(msgApiUrl).then(response => response.data);
            }
        };
    };

})();

