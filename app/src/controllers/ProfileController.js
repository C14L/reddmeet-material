(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ProfileController', ['$log', '$http', '$scope', '$timeout', '$routeParams', '$mdSidenav', '$location', 'AuthUserFactory', 'UserFactory', 'ChatFactory', '$mdDialog', '$mdMedia', ProfileController]);

    /**
     * Display a user profile page. If its authuser's own page, 
     * add "edit" buttons to different parts, and have popups
     * with forms to change the values.
     */
    function ProfileController($log, $http, $scope, $timeout, $routeParams, $mdSidenav, $location, AuthUserFactory, UserFactory, ChatFactory, $mdDialog, $mdMedia) {
        let vm = this;
        let promiseViewUser = UserFactory.getViewUser($routeParams.username);
        let promiseAuthUser = AuthUserFactory.getAuthUser();

        vm.fabOpen = false;
        vm.isShowSendMessage = false;
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

        vm.openMessenger = event => {
            $mdDialog.show({
                controller: 'ChatDialogController',
                controllerAs: 'chat',
                templateUrl: 'views/chat.html',
                locals: { username: $routeParams.username },
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
                fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
            });
        };

        // - - - Right sidenav - - - - - - - - - - - - - - - - -

        vm.toggleRight = () => $mdSidenav('profile-right').toggle();
    };

})();