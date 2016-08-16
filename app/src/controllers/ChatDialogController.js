(function () { 'use strict';

    angular.module('reddmeetApp')
    .controller('ChatDialogController', ['$scope', '$mdDialog', 'ChatFactory', '$routeParams', 'username', ChatDialogController]);

    function ChatDialogController($scope, $mdDialog, ChatFactory, $routeParams, username) {

        let vm = this;
        let watcherMessageText = false;
        let onEventNewMessage = false;

        console.log('X X X X  This is ChatController  X X X X');
        console.log('X X X X  username ... ', username);

        vm.isShowSendMessage = true;
        vm.isTextboxFocus = true;
        vm.messages = [];  // chat messages
        vm.messageText = '';
        vm.username = username;

        // When opening the chat, get an initial list.
        let after = vm.messages[0] ? vm.messages[0]['id'] : 0;
        ChatFactory.getInitialWithUser(vm.username, after);

        // Watch for and remove any newline characters.
        watcherMessageText = $scope.$watch('vm.messageText', (newVal, oldVal) => {
            if (newVal) vm.messageText = newVal.replace('\n', '');
            console.log('## ## ## ## ## ## vm.messageText ==> ', newVal, oldVal);
        });

        onEventNewMessage = $scope.$on('chat:newmsg', (event, data) => {
            console.log('## ## ## ## ## ## ChatController: event "chat:newmsg" received.');
            vm.messages = ChatFactory.getChatWithUser(vm.username);
        });

        vm.closeMessenger = event => $mdDialog.hide();

        /**
         * Send a chat message from auth user to receiver (username)
         * via the open WebSocket channel.
         */
        vm.doSendMessage = () => {
            ChatFactory.sendChat(vm.username, vm.messageText);
            vm.messageText = '';
        };
    };

})();
