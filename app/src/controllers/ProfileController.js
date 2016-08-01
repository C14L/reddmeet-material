(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ProfileController', ['$log', '$http', '$scope', '$timeout', '$routeParams', '$mdSidenav', '$location', 'AuthUserFactory', 'UserFactory', 'MessagesFactory', ProfileController])
        ;

    /**
     * Display a user profile page. If its authuser's own page, 
     * add "edit" buttons to different parts, and have popups
     * with forms to change the values.
     */
    function ProfileController($log, $http, $scope, $timeout, $routeParams, $mdSidenav, $location, AuthUserFactory, UserFactory, MessagesFactory) {
        var vm = this;
        //var apiUrl = API_BASE + '/api/v1/u/' + $routeParams.username + '.json';
        var watcherMessageText = false;

        vm.fabOpen = false;
        vm.isShowSendMessage = false;
        vm.messages = []; // { created: '', msg: '', sender: '', receiver: '' }
        vm.data = null;
        vm.authuser = null;
        vm.isProfileLoading = true;  // to hide main profile view while loading
        vm.isFadeToLeft = false;
        vm.isFadeToRight = false;

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

            watcherMessageText = $scope.$watch('vm.messageText', (newVal, oldVal) => {
                if (newVal) vm.messageText = newVal.replace('\n', '');
            });

            // Load initial messages when opening chat view.
            MessagesFactory.fetch($routeParams.username).then(data => vm.messages = data.msg_list);
        };

        vm.doSendMessage = () => {
            // Post a message to the message queue
            vm.messages = MessagesFactory.post(vm.messageText, vm.data.view_user.username)
            .then(data => {
                console.log('### doSendMessage response data: ', data);
                vm.messages.push(data.msg_list)
            });
            vm.messageText = '';
        };
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

        // - - - Right sidenav - - - - - - - - - - - - - - - - -

        vm.toggleRight = () => $mdSidenav('profile-right').toggle();
    };
})();