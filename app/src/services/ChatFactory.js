(function () { 'use strict';

    angular.module('reddmeetApp').service('ChatFactory', [
        '$rootScope',
        '$http', 
        '$log', 
        'AuthUserFactory',
        'WsFactory', 
        ChatFactory]);

    function ChatFactory($rootScope, $http, $log, AuthUserFactory, WsFactory) {
        let self = this;
        let authUsername = '';

        self.newMessages = false; // Set true when new messages arrive, and false once they are read.
        self.newChats = false;
        self.messages = [];  // All chat messages between auth user and all other users.
        self.chats = [];  // A list of past chats with other users.

        // Set auth user's username.
        AuthUserFactory.getAuthUser().then(authuser => authUsername = authuser.username);

        // When messages are received, add them to the messages buffer.
        WsFactory.onMessage(message => receiveMessages(message.data));

        // When messages are received, add them to the messages buffer.
        WsFactory.onMessage(message => receiveChats(message.data));

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        function isAinListBbyC(a, b, c) {
            // Check if object A is in the list B of A-like objects, 
            // by the property C. Return true if A[C] == B[i][C] exists 
            // else return false.
            for (let j=0; j<b.length; j++) if (b[j][c] === a[c]) return true;
            return false;
        }

        /**
         * Add new messages to existing messages buffer array, avoinding 
         * duplicates.
         */
        function receiveMessages(dataText) {
            let data = JSON.parse(dataText);
            let len = 0;

            if (!data.action || !data.action.startsWith('chat.'))
                return;

            if (data.msg_list.length > 0) {
                len = data.msg_list.length;

                for (let i=0; i<len; i++)
                    if ( ! isAinListBbyC(data.msg_list[i], self.messages), 'id')
                        self.messages.push(data.msg_list[i]);

                // Sort by latest message (largest ID) first.
                self.messages.sort((a, b) => b.id - a.id);

                // Limit messages buffer to 100 last messages.
                while (self.messages.length > 100) messages.pop();

                self.newMessages = true;
                $rootScope.$broadcast('chat:newmsg', len);
            }
        }

        /**
         * Add new chats/conversations to the `chats` buffer, avoiding
         * duplicates and sorted by "last message received" first.
         */
        function receiveChats(dataText) {
            let data = JSON.parse(dataText);
            let len = 0;

            if (!data.action || !data.action.startsWith('chats.'))  // <-- TODO: on server!
                return;

            if (data.user_list.length > 0) {
                len = data.user_list.length;

                // Every user can only appear once in the `self.chats` list.
                for (let i=0; i<len; i++)
                    if ( ! isAinListBbyC(data.user_list[i], self.chats, 'username'))
                        self.chats.push(data.user_list[i]);

                // Sort by latest message first.
                self.chats.sort((a, b) => b.latest - a.latest);

                // Limit chats buffer to 100 last chats.
                while (self.chats.length > 100) chats.pop();

                self.newChats = true;
                $rootScope.$broadcast('chats:received', len);
            }
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        /**
         * Request a list of users that authuser had a chat with, ordered by the
         * most recent message sent or received first."""
         */
        self.requestChats = function(after=0) {
            after = after || 0;
            WsFactory.send({ 'action': 'chats.init', 'after': after });
        }

        /**
         * Return chat messages from buffer between auth user and `username`.
         */
        self.getChatWithUser = function(username) {
            if (!self.newMessages) return [];
            self.newMessages = false;
            $log.debug('## ChatFactory.newMessages --> ', self.newMessages);
            return self.messages.filter(a => (a.sender == authUsername && a.receiver == username) || (a.sender == username && a.receiver == authUsername));
        }

        /**
         * Fetches an initial x messages between auth user and `username`. 
         * If `after` is a message id, only messages with a larger id are
         * returned.
         */
        self.getInitialWithUser = function(username, after=0) {
            after = after || 0;
            WsFactory.send({ 'action': 'chat.init', 'after': after, 'view_user': username });
        }

        /**
         * Send a chat message from auth user to receiver_id (a user id)
         * via the open WebSocket channel.
         */
        self.sendChat = function(receiver, msg) {
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

        self.hasNewMessages = function() {
            return self.newMessages;
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        var apiUrlBase = API_BASE + '/api/v1/pms/';

        /**
         * Send a chat message from auth user to "receiver" (a username)
         * via a regular HTTP POST request.
         */
        self.sendChatHttp = function(msg, receiver) {
            if ( ! msg) return; // Empty msg text, nothing is posted.
            if ( ! receiver) return; // Empty receiver, nothing is posted.
            const msgApiUrl = apiUrlBase + receiver;
            const after = self.messages[0] ? self.messages[0]['id'] : '';
            const data = { 'msg': msg, 'is_sent': false, 'is_seen': false, 'after': after };
            return $http.post(msgApiUrl, data).then(response => prepareMessages(response.data.msg_list));
        }

        /**
         * Fetch recent chat messages between auth user and "username" via
         * a regular HTTP GET request.
         */
        self.fetchChatHttp = function(username) {
            const after = self.messages[0] ? self.messages[0]['id'] : '';
            const msgApiUrl = apiUrlBase + username + '?after=' + after;
            return $http.get(msgApiUrl).then(response => prepareMessages(response.data.msg_list));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        /* return {
            hasNewMessages: hasNewMessages,
            getChatsList: getChatsList,
            getChatWithUser: getChatWithUser,
            getInitialWithUser: getInitialWithUser,
            sendChat: sendChat,
            post: sendChatHttp,
            fetch: fetchChatHttp,
        }; */
    };

})();

