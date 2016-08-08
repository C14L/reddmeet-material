(function () { 'use strict';

    angular.module('reddmeetApp').factory('ChatFactory', [
        'WsFactory', 
        '$http', 
        '$log', 
        ChatFactory]);

    function ChatFactory(WsFactory, $http, $log) {
        var apiUrlBase = API_BASE + '/api/v1/pms/';
        var messages = [];  // Ordered chat messages buffer.

        function isMsgAinListB(a, b) {
            // Check if a message is in the list of messages.
            for (let j=0; j<b.length; j++) if (b[j]['id'] === a['id']) return true;
            return false;
        }

        /**
         * Add new messages to existing messages buffer array, avoinding 
         * duplicates.
         */
        function prepareMessages(msg_list) {
            if (msg_list) {
                for (let i=0; i<msg_list.length; i++) {
                    if ( ! isMsgAinListB(msg_list[i], messages))
                        messages.push(msg_list[i]);
                }
            }
            // Sort by latest message (largest ID) first.
            messages.sort((a, b) => b.id - a.id);
            // Limit messages buffer to 100 last messages.
            while (messages.length > 100) messages.pop();
            return messages
        }

        /**
         * Send a chat message from auth user to receiver_id (a user id)
         * via the open WebSocket channel.
         */
        function sendChat(receiver, msg) {
            let payload = {
                'action': 'chat.receive',
                'msg': msg,
                'receiver': receiver,
                'after': '',
                'is_sent': '',
                'is_seen': '',
            };
            $log.debug('### ChatFactory.sendChat with: ', payload);
            WsFactory.send(payload);
        }

        // When messages are received, add them to the messages buffer.
        WsFactory.onMessage(message => prepareMessages(message.data));

        /**
         * Send a chat message from auth user to "receiver" (a username)
         * via a regular HTTP POST request.
         */
        function sendChatHttp(msg, receiver) {
            if ( ! msg) return; // Empty msg text, nothing is posted.
            if ( ! receiver) return; // Empty receiver, nothing is posted.
            const msgApiUrl = apiUrlBase + receiver;
            const after = messages[0] ? messages[0]['id'] : '';
            const data = { 'msg': msg, 'is_sent': false, 'is_seen': false, 'after': after };
            return $http.post(msgApiUrl, data).then(response => prepareMessages(response.data.msg_list));
        }

        /**
         * Fetch recent chat messages between auth user and "username" via
         * a regular HTTP GET request.
         */
        function fetchChatHttp(username) {
            const after = messages[0] ? messages[0]['id'] : '';
            const msgApiUrl = apiUrlBase + username + '?after=' + after;
            return $http.get(msgApiUrl).then(response => prepareMessages(response.data.msg_list));
        }

        return {
            sendChat: sendChat,
            post: sendChatHttp,
            fetch: fetchChatHttp,
        };
    };

})();

