(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ProfileController', ['$log', '$http', '$scope', '$timeout', '$routeParams', '$mdSidenav', '$location', 'AuthUserFactory', 'UserFactory', 'WsFactory', ProfileController])
        ;

    /**
     * Display a user profile page. If its authuser's own page, 
     * add "edit" buttons to different parts, and have popups
     * with forms to change the values.
     */
    function ProfileController($log, $http, $scope, $timeout, $routeParams, $mdSidenav, $location, AuthUserFactory, UserFactory, WsFactory) {
        var vm = this;
        var watcherMessageText = false;
        
        vm.fabOpen = false;
        vm.isShowSendMessage = false;
        vm.messages = [];  // chat messages
        vm.data = null;
        vm.authuser = null;
        vm.isProfileLoading = true;
        vm.isFadeToLeft = false;
        vm.isFadeToRight = false;
        vm.isTextboxFocus = false;

        AuthUserFactory.getAuthUser().then(authuser => vm.authuser = authuser);

        UserFactory.getViewUser($routeParams.username).then(response => {
            vm.data = response;
            vm.isProfileLoading = false;
            setTimeout(() => {
                angular.element(".transition-helper").fadeOut();
                $scope.$digest();
            }, 300);
        }).catch(response => {
            console.error(response.status, response.statusText);
            angular.element(".transition-helper").remove();
        });

        /**
         * Auth user clicks upvote or downvote on view user's profile.
         */
        vm.doVote = vote => {
            UserFactory.createFlag(vote, vm.data.view_user).then(response => {
                if (vote == 'like') {
                    vm.data.is_like = true;
                    vm.data.is_nope = false;
                } else
                if (vote == 'nope') {
                    vm.data.is_like = false;
                    vm.data.is_nope = true;
                }
            });
        };

        /**
         * Auth user clicks next or previous on view user's profile.
         */
	    vm.goPrevNext = d => {
            if (d == 'next') {
                vm.isFadeToLeft = true;
                $timeout(() => {
                    vm.isFadeToLeft = false;
                    $location.path('/u/' + vm.data.next_user.username);
                }, 300);
            };
            if (d == 'prev') {
                vm.isFadeToRight = true;
                $timeout(() => {
                    vm.isFadeToRight = false;
                    $location.path('/u/' + vm.data.prev_user.username);
                }, 300);
            };
        };

        // - - - Chat window - - - - - - - - - - - - - - - - -

        /**
         * Check if a message is in the list of messages.
         */
        function isMsgAinListB(a, b) {
            for (let j=0; j<b.length; j++) {
                if (b[j]['id'] === a['id']) return true;
            }
            return false;
        }

        /**
         * Add new messages to existing messages array, avoiding 
         * duplicates. This works directly on the list that is used
         * for rendering, but that should be okay, because the list 
         * is likely to be modified only occasionally, if at all.
         */
        function addMessages(msg_list) {
            if (msg_list) {
                for (let i=0; i<msg_list.length; i++) {
                    if ( ! isMsgAinListB(msg_list[i], vm.messages))
                        vm.messages.push(msg_list[i]);
                }
            }
            // Sort by latest message (largest ID) first.
            vm.messages.sort((a, b) => b.id - a.id);
            // Limit messages buffer to 100 last messages.
            while (vm.messages.length > 100) vm.messages.pop();

            $log.debug('addMessages() --> vm.messages == ', vm.messages);
        }

        /**
         * Send a chat message from auth user to receiver (username)
         * via the open WebSocket channel.
         */
        vm.doSendMessage = () => {
            let payload = {
                'action': 'chat.receive',
                'msg': vm.messageText,
                'receiver': vm.data.view_user.username,
                'after': '',
                'is_sent': '',
                'is_seen': '',
            };
            $log.debug('### ProfileController.doSendMessage()', payload);
            WsFactory.send(payload);
            vm.messageText = '';
        };

        /**
         * When messages are received, add them to the messages buffer.
         */
        WsFactory.onMessage(response => addMessages(JSON.parse(response.data)));

        /**
         * User activities: close messenger, open messagener.
         */
        vm.closeMessenger = () => {
            // Switch profile view to message box view
            vm.isShowSendMessage = false;
            vm.isTextboxFocus = false;

            if (watcherMessageText) watcherMessageText();
        };

        vm.openMessenger = () => {
            // Switch profile view to message box view
            vm.isShowSendMessage = true;
            vm.isTextboxFocus = true;
            // Watch for and remove any newline characters.
            watcherMessageText = $scope.$watch('vm.messageText', (newVal, oldVal) => {
                if (newVal) vm.messageText = newVal.replace('\n', '');
            });
            // Load initial messages when opening chat view.
            // ChatFactory.fetch($routeParams.username).then(messages => vm.messages = messages);
        };

        // - - - Right sidenav - - - - - - - - - - - - - - - - -

        vm.toggleRight = () => $mdSidenav('profile-right').toggle();
    };
})();