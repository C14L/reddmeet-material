(function () {
    'use strict';

    angular.module('reddmeetApp').controller('MainController', ['$mdDialog', '$mdSidenav', '$mdBottomSheet', '$location', '$log', 'AuthUserFactory', MainController]);

    /**
     * Control most of the app logic that happens independently of the current view.
     */
    function MainController($mdDialog, $mdSidenav, $mdBottomSheet, $location, $log, AuthUserFactory) {
        var vm = this;
        vm.userLogout = userLogout;
        vm.toggleSidebar = toggleSidebar;
        vm.openMenu = openMenu;

        vm.selected = null;
        vm.users = [];
        vm.selectUser = selectUser;
        vm.makeContact = makeContact;

        vm.srList = AuthUserFactory.getAuthUserSrList();

        vm.go = function (url) {
            $log.debug(url);
            $location.path(url);
        };

        function toggleSidebar() {
            $mdSidenav('left').toggle();
        };

        vm.overflowItems = [
            {
                href: '#/map',
                title: 'redditors map',
                icon: 'map'
            },
            {
                href: '#/upvotes_sent',
                title: 'upvoted by you',
                icon: 'arrow_upward'
            },
            {
                href: '#/hidden',
                title: 'downvoted by you',
                icon: 'arrow_downward'
            },
            {
                href: '#/',
                title: 'your reddit inbox',
                icon: 'email'
            },
            {
                href: '#/stats',
                title: 'site statistics',
                icon: 'assessment'
            }];
        vm.sidebarItems = [
            {
                href: '#/me/profile',
                title: 'update profile basics',
                icon: 'assignment_ind'
            },
            {
                href: '#/me/pictures',
                title: 'update pictures',
                icon: 'add_a_photo'
            },
            {
                href: '#/me/location',
                title: 'update your location',
                icon: 'my_location'
            },
            {
                href: '#/me/subs',
                title: 'update your subreddit list',
                icon: 'playlist_add_check'
            },
            {
                href: '#/me/account',
                title: 'account settings',
                icon: 'settings'
            }];

        function openMenu($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        function userLogout() {
            $log.debug('Would now logout user.');
        }

        function selectUser(user) {
            vm.selected = angular.isNumber(user) ? $scope.users[user] : user;
        }

        function makeContact(selectedUser) {
            $mdBottomSheet.show({
                controllerAs: "cp",
                templateUrl: './src/users/view/contactSheet.html',
                controller: ['$mdBottomSheet', ContactSheetController],
                parent: angular.element(document.getElementById('content'))
            }).then(function (clickedItem) {
                $log.debug(clickedItem.name + ' clicked!');
            });

            /**
             * User ContactSheet controller
             */
            function ContactSheetController($mdBottomSheet) {
                this.user = selectedUser;
                this.actions = [
                    { name: 'Phone', icon: 'phone', icon_url: 'assets/svg/phone.svg' },
                    { name: 'Twitter', icon: 'twitter', icon_url: 'assets/svg/twitter.svg' },
                    { name: 'Google+', icon: 'google_plus', icon_url: 'assets/svg/google_plus.svg' },
                    { name: 'Hangout', icon: 'hangouts', icon_url: 'assets/svg/hangouts.svg' }
                ];
                this.contactUser = function (action) {
                    // The actually contact process has not been implemented...
                    // so just hide the bottomSheet

                    $mdBottomSheet.hide(action);
                };
            }
        }

    };

})();