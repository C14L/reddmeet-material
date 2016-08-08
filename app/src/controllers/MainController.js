(function () {
    'use strict';

    angular.module('reddmeetApp').controller('MainController', ['$timeout', '$mdDialog', '$mdSidenav', '$mdBottomSheet', '$location', '$log', 'AuthUserFactory', 'WsFactory', MainController]);

    /**
     * Control most of the app logic that happens independently of the current view.
     */
    function MainController($timeout, $mdDialog, $mdSidenav, $mdBottomSheet, $location, $log, AuthUserFactory, WsFactory) {
        var vm = this;
        vm.userLogout = userLogout;
        vm.selected = null;
        vm.wsConnected = false;
        vm.users = [];
        vm.selectUser = selectUser;
        vm.makeContact = makeContact;
        vm.toggleSidebar = () => $mdSidenav('left').toggle();
        vm.openMenu = ($mdOpenMenu, ev) => $mdOpenMenu(ev);
        vm.go = url => {
            $timeout(() => $mdSidenav('left').close(), 300);
            $location.path(url);
            $log.debug('### go("' + url + '")');
        };
        vm.overflowItems = [
            { href: '/visitors', title: 'visited you', icon: 'group' },
            { href: '/map', title: 'redditors map', icon: 'map' },
            { href: '/stats', title: 'site statistics', icon: 'assessment' },
        ];
        vm.sidebarItems = [
            { href: '/me/profile', title: 'update profile basics', icon: 'assignment_ind' },
            { href: '/me/pictures', title: 'update pictures', icon: 'add_a_photo' },
            { href: '/me/location', title: 'update your location', icon: 'my_location' },
            { href: '/me/subs', title: 'update your subreddit list', icon: 'playlist_add_check' },
            { href: '/me/account', title: 'account settings', icon: 'settings' },
        ];

        // WebSocket connected.
        WsFactory.onOpen(() => vm.wsConnected = true);
        // WebSocket disconnected.
        WsFactory.onClose(() => vm.wsConnected = false);
        WsFactory.onError(() => vm.wsConnected = false);

        // Add auth user data to scope when promise resolved.
        AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);

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