(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ProfileController', ['$log', '$http', '$scope', '$timeout', '$routeParams', '$mdSidenav', '$location', 'AuthUserFactory', 'UserFactory', 'ChatFactory', ProfileController])
        ;

    /**
     * Display a user profile page. If its authuser's own page, 
     * add "edit" buttons to different parts, and have popups
     * with forms to change the values.
     */
    function ProfileController($log, $http, $scope, $timeout, $routeParams, $mdSidenav, $location, AuthUserFactory, UserFactory, ChatFactory) {
        let vm = this;
        let watcherMessageText = false;
        let onEventNewMessage = false;
        let promiseViewUser = UserFactory.getViewUser($routeParams.username);
        let promiseAuthUser = AuthUserFactory.getAuthUser();

        vm.fabOpen = false;
        vm.isShowSendMessage = false;
        vm.messages = [];  // chat messages
        vm.data = null;
        vm.authuser = null;
        vm.isProfileLoading = true;
        vm.isFadeToLeft = false;
        vm.isFadeToRight = false;
        vm.isTextboxFocus = false;

        promiseAuthUser.then(authuser => vm.authuser = authuser);
        
        promiseViewUser.then(response => {
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
         * Send a chat message from auth user to receiver (username)
         * via the open WebSocket channel.
         */
        vm.doSendMessage = () => {
            ChatFactory.sendChat(vm.data.view_user.username, vm.messageText);
            vm.messageText = '';
        };

        /**
         * User activities: close messenger, open messagener.
         */
        vm.closeMessenger = () => {
            // Switch profile view to message box view
            vm.isShowSendMessage = false;
            vm.isTextboxFocus = false;

            if (onEventNewMessage) onEventNewMessage();
            if (watcherMessageText) watcherMessageText();
        };

        vm.openMessenger = () => {
            // Switch profile view to message box view
            vm.isShowSendMessage = true;
            vm.isTextboxFocus = true;

            promiseViewUser.then(() => {
                // When opening the chat, get an initial list.
                let after = vm.messages[0] ? vm.messages[0]['id'] : 0;
                ChatFactory.getInitialWithUser(vm.data.view_user.username, after);
            });

            // Watch for and remove any newline characters.
            watcherMessageText = $scope.$watch('vm.messageText', (newVal, oldVal) => {
                if (newVal) vm.messageText = newVal.replace('\n', '');
            });

            onEventNewMessage = $scope.$on('chat:newmsg', (event, data) => {
                console.log('ProfileController: event "chat:newmsg" received.');
                vm.messages = ChatFactory.getChatWithUser(vm.data.view_user.username);
            });
        };

        // - - - Right sidenav - - - - - - - - - - - - - - - - -

        vm.toggleRight = () => $mdSidenav('profile-right').toggle();
    };
})();