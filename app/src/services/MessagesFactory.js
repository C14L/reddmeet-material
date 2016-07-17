(function () { 'use strict';

    angular.module('reddmeetApp').factory('MessagesFactory', ['$http', '$log', MessagesFactory]);

    function MessagesFactory($http, $log) {
        // Load auth user data on init.
        var apiUrl = API_BASE + '/api/v1/authuser.json';
        var messages = [
            { time: 1468797013589, text: 'Yo, a text 111', sender: 'CmdrBratwurst', receiver: 'C14L', is_sent: true, is_seen: false },
            { time: 1468797017634, text: 'Text 222', sender: 'CmdrBratwurst', receiver: 'C14L', is_sent: true, is_seen: false },
            { time: 1468797064723, text: 'nother 333', sender: 'CmdrBratwurst', receiver: 'C14L', is_sent: true, is_seen: false },
            { time: 1468797013369, text: 'and so on 444', sender: 'C14L', receiver: 'CmdrBratwurst', is_sent: true, is_seen: false },
            { time: 1468797013096, text: 'sup sups up 555', sender: 'CmdrBratwurst', receiver: 'C14L', is_sent: true, is_seen: false },
        ];

        return {
            post: message => {
                // Post a new message to the factory cahe and to the backend.
                // Then return the new messages list.
                if ( ! message['text']) return messages; // Empty text, nothing is posted.
                if ( ! message['sender']) return messages; // Empty sender, nothing is posted.
                if ( ! message['receiver']) return messages; // Empty receiver, nothing is posted.
                if ( ! message['time']) message['time'] = Date.now(); // Add timestamp.
                message['is_sent'] = false; // Mark when POST return 200.
                message['is_seen'] = false; // Mark when receiver viewed message on sender's profile page.
                messages.push(message);

                $http.post(apiUrl, message).then(() => {
                    // TODO set is_sent=true
                }).catch(err => {
                    $log.debug('Error POSTing message', err);
                });

                return messages;
            },
            fetch: () => {
                // Return the latest 50 messages, either from factory cache or
                // fetch from backend.
                return Promise.resolve().then(() => {
                    // On page load, fetch messages from backend / service worker.
                    return messages;
                });
            }
        };
    };

})();

