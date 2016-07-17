(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ProfileController', ['$log', '$http', '$scope', '$timeout', '$routeParams', '$mdSidenav', '$location', 'AuthUserFactory', 'MessagesFactory', ProfileController])
        ;

    /**
     * Display a user profile page. If its authuser's own page, 
     * add "edit" buttons to different parts, and have popups
     * with forms to change the values.
     */
    function ProfileController($log, $http, $scope, $timeout, $routeParams, $mdSidenav, $location, AuthUserFactory, MessagesFactory) {
        var vm = this;
        var apiUrl = API_BASE + '/api/v1/u/' + $routeParams.username + '.json';
        var watcherMessageText = false;

        vm.fabOpen = false;
        vm.isShowSendMessage = false;
        vm.messages = []; // { time: '', text: '', sender: '', receiver: '' }
        vm.data = null;
        vm.authuser = null;

        AuthUserFactory.getAuthUser().then(authuser => vm.authuser = authuser);

        $http.get(apiUrl).then(response => {
            vm.data = response.data;

            setTimeout(() => {
                angular.element(".transition-helper").fadeOut();
                $scope.$digest();
            }, 300);

            $log.debug('Received response: ', response);
            $log.debug('For viewUser ', vm.data.view_user);
        }).catch(response => {
            console.error(response.status, response.statusText);
            angular.element(".transition-helper").remove();
        });

        vm.doVote = vote => {
            if (vote == 'up') {
                vm.data.is_like = true;
                vm.data.is_nope = false;
            } else
            if (vote == 'down') {
                vm.data.is_like = false;
                vm.data.is_nope = true;
            }

            //... TODO send vote to server
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
            MessagesFactory.fetch().then(messages => vm.messages = messages); 
        };
        vm.doSendMessage = () => {
            // Post a message to the message queue
            vm.messages = MessagesFactory.post({
                text: vm.messageText,
                sender: vm.authuser.username,
                receiver: vm.data.view_user.username,
            });
            vm.messageText = '';
        };
	    vm.goPrevNext = d => {
            let username = d == 'prev' ? vm.data.prev_user.username : vm.data.next_user.username;
            $log.debug('## username: ' + username);
            $location.path('/u/' + username);
        };

        // - - - Right sidenav - - - - - - - - - - - - - - - - -

        vm.toggleRight = () => $mdSidenav('profile-right').toggle();
    };
})();