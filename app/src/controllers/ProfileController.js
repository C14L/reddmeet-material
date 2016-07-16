(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ProfileController', ['$log', '$http', '$scope', '$timeout', '$routeParams', '$mdSidenav', '$location', ProfileController])
        //.controller('ProfileSidenavController', ['$log', '$scope', '$timeout', '$mdSidenav', ProfileSidenavController])
        ;

    /**
     * Display a user profile page. If its authuser's own page, 
     * add "edit" buttons to different parts, and have popups
     * with forms to change the values.
     */
    function ProfileController($log, $http, $scope, $timeout, $routeParams, $mdSidenav, $location) {
        var vm = this;
        var apiUrl = API_BASE + '/api/v1/u/' + $routeParams.username + '.json';
        var watcherMessageText = false;

        vm.fabOpen = false;
        vm.isShowSendMessage = false;
        vm.messages = [];

        $log.debug('Profile: ', apiUrl);

        $http.get(apiUrl).then(function (response) {
            $log.debug('Received response: ', response);
            vm.data = response.data;

            setTimeout(function () {
                angular.element(".transition-helper").fadeOut();
                $scope.$digest();
            }, 300);

            console.log('Response received for viewUser ' + vm.data.view_user.username);
        }).catch(function (response) {
            console.error(response.status, response.statusText);
            angular.element(".transition-helper").remove();
        });

        vm.doVote = function (vote) {
            if (vote == 'up') {
                vm.data.is_like = true;
                vm.data.is_nope = false;
            } else
            if (vote == 'down') {
                vm.data.is_like = false;
                vm.data.is_nope = true;
            }

            //... TODO send vote to server
        }

        vm.closeMessenger = function () {
            // Switch profile view to message box view
            vm.isShowSendMessage = false;
            vm.isTextboxFocus = false;

            if (watcherMessageText) watcherMessageText();
        }
        vm.openMessenger = function () {
            // Switch profile view to message box view
            vm.isShowSendMessage = true;
            vm.isTextboxFocus = true;

            watcherMessageText = $scope.$watch('vm.messageText', (newVal, oldVal) => {
                if (newVal) vm.messageText = newVal.replace('\n', '');
            });
        }
        vm.doSendMessage = function () {
            // Post a message to the message queue
            vm.messages.push({
                text: vm.messageText,
                time: Date.now(),
                from: 'csx',
            });
            vm.messageText = '';
        }
	    vm.goPrevNext = function (d) {
            let username = d == 'prev' ? vm.data.prev_user.username : vm.data.next_user.username;
            console.log('## username: ' + username);
            $location.path('/u/' + username);
        }

        // - - - Right sidenav - - - - - - - - - - - - - - - - -

        vm.toggleRight = function () {
            $log.debug('Should open .right-side profile sidenav.');

            $mdSidenav('profile-right').toggle().then(function () {
                $log.debug("toggle .profile-right is done");
            });
        };

    };
})();