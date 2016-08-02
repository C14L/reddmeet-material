(function () { 'use strict';

    angular.module('reddmeetApp').factory('MessagesFactory', ['$http', '$log', MessagesFactory]);

    function MessagesFactory($http, $log) {
        var apiUrlBase = API_BASE + '/api/v1/pms/';
        var messages = [];

        function isMsgAinListB(a, b) {
            // Check if a message is in the list of messages.
            for (let j=0; j<b.length; j++) if (b[j]['id'] === a['id']) return true;
            return false;
        }

        function prepareMessages(response) {
            // Add new messages to existing array, avoinding dupes.
            if (response.data && response.data.msg_list) {
                for (let i=0; i<response.data.msg_list.length; i++) {
                    if ( ! isMsgAinListB(response.data.msg_list[i], messages))
                        messages.push(response.data.msg_list[i]);
                }
            }
            // Sort by latest message (largest ID) first.
            messages.sort((a, b) => b.id - a.id);
            // Limit messages buffer to 100 last messages.
            while (messages.length > 100) messages.pop();
            return messages
        }

        return {
            post: (msg, receiver) => {
                if ( ! msg) return; // Empty msg text, nothing is posted.
                if ( ! receiver) return; // Empty receiver, nothing is posted.
                const msgApiUrl = apiUrlBase + receiver;
                const after = messages[0] ? messages[0]['id'] : '';
                const data = { 'msg': msg, 'is_sent': false, 'is_seen': false, 'after': after };
                return $http.post(msgApiUrl, data).then(response => prepareMessages(response));
            },
            fetch: username => {
                const after = messages[0] ? messages[0]['id'] : '';
                const msgApiUrl = apiUrlBase + username + '?after=' + after;
                return $http.get(msgApiUrl).then(response => prepareMessages(response));
            }
        };
    };

})();

