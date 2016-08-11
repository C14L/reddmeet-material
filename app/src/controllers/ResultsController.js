(function () {
    'use strict';

    angular.module('reddmeetApp').controller('ResultsController', ['$log', '$mdDialog', '$mdBottomSheet', '$scope', 'SearchResultsFactory', 'AuthUserFactory', ResultsController]);

    /**
     * Display a list of users found with the current search settings.
     */
    function ResultsController($log, $mdDialog, $mdBottomSheet, $scope, SearchResultsFactory, AuthUserFactory) {
        var vm = this;
        vm.title = "search results";
        vm.results = [];
        vm.isFirstRun = getLocalStorageString('isFirstRun', true);
        vm.srSubscribedCount = 0;
        vm.srSelectedCount = 0;
        vm.srSelectedDisplay = 'all';
        vm.distanceSelectedDisplay = 'worldwide';
        vm.genderSelectedDisplay = 'everybody';
        vm.orderSelectedDisplay = 'by best match';

        /**
         * Return the number of search-selected subreddits.
         */
        vm.setSrSelectedCount = () => {
            SearchResultsFactory.getSrOpts().then(li => {
                vm.srSubscribedCount = li.length;
                vm.srSelectedCount = li.filter(n => n.active).length;
                vm.srSelectedDisplay = (vm.srSubscribedCount > vm.srSelectedCount) ? vm.srSelectedCount : 'all';
            });
        }
        vm.setGenderSelectedDisplay = () => {
            let x = SearchResultsFactory.getSearchParam('fSexOpts');
            vm.genderSelectedDisplay = x.filter(n => n.selected)[0].label || 'everybody';
        }
        vm.setDistanceSelectedDisplay = () => {
            let x = SearchResultsFactory.getSearchParam('fDistanceOpts');
            vm.distanceSelectedDisplay = x.filter(n => n.selected)[0].label || 'worldwide';
        }
        vm.setOrderSelectedDisplay = () => {
            let x = SearchResultsFactory.getSearchParam('fOrderOpts');
            vm.orderSelectedDisplay = x.filter(n => n.selected)[0].label || 'by best match';
        }
        vm.setSrSelectedCount();
        vm.setGenderSelectedDisplay();
        vm.setDistanceSelectedDisplay();
        vm.setOrderSelectedDisplay();

        /**
         * Return the current user's distance to the supplied geolocation in kilometers.
         */
        vm.getDistance = (lat, lon) => {
            if (lat && lon) {
                return Math.floor(AuthUserFactory.getDistance(lat, lon)) + ' km';
            }
        }

        /**
         * Reads the current state of the search settings and fetches
         * new search results from the SearchResults service.
         * 
         * Called every time a search setting is updated, to reflect the
         * new setting in real-time.
         */
        vm.refreshResults = reset => {
            vm.isLoading = true;

            if (reset) SearchResultsFactory.resetResults();
            
            SearchResultsFactory.getUserList().then(function (user_list) {
                console.log('## user_list reset? ', reset);
                console.log('## user_list item count: ', user_list ? user_list.length : 0);
                vm.isLoading = false;
                vm.results = user_list;

                // Add distance between auth user and view_user to results list
                for (let i=0, len=vm.results.length; i<len; i++) {
                    vm.results[i].distance = vm.getDistance(vm.results[i].profile.lat, vm.results[i].profile.lng);
                }
            });
        }

        /*
        vm.editSearch = ev => {
            $log.debug('ResultsController.editSearch() called!!!');
            $mdDialog.show({
                targetEvent: ev,
                controller: SearchSettingsDialogController,
                controllerAs: 'vmForm',
                templateUrl: '/app/views/search-dialog.html'
            }).then(answer => {
                console.log('ResultsController got answer: ', answer);
            }).catch(() => {
                console.log('Event cancled, ResultsController got nada.');
            });
        }
        */

        vm.showSearchOptionGender = ev => {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: 'views/search-dialog-gender.html',
                controller: 'SearchOptionGenderDialogController',
                controllerAs: 'vmForm'
            }).then(li => {
                console.log('showSearchOptionGender selected: ', li);
                SearchResultsFactory.setSearchParam('fSexOpts', li);
                vm.refreshResults(true); // Reload the results after params changed
                vm.setGenderSelectedDisplay();
            });
        };

        vm.showSearchOptionDistance = ev => {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: 'views/search-dialog-distance.html',
                controller: 'SearchOptionDistanceDialogController',
                controllerAs: 'vmForm'
            }).then(li => {
                console.log('showSearchOptionDistance selected: ', li);
                SearchResultsFactory.setSearchParam('fDistanceOpts', li);
                vm.refreshResults(true); // Reload the results after params changed
                vm.setDistanceSelectedDisplay();
            });
        };

        vm.showSearchOptionSubreddits = ev => {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: 'views/search-dialog-srlist.html',
                controller: 'SearchOptionSubredditsDialogController',
                controllerAs: 'vmForm'
            }).then(li => {
                console.log('showSearchOptionSubreddits selected: ', li);
                SearchResultsFactory.setSearchParam('fSrOpts', li);
                vm.refreshResults(true); // Reload the results after params changed
                vm.setSrSelectedCount();
            });
        };

        vm.showSearchOptionOrder = ev => {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: 'views/search-dialog-order.html',
                controller: 'SearchOptionOrderDialogController',
                controllerAs: 'vmForm'
            }).then(li => {
                console.log('showSearchOptionOrder seelcted: ', li);
                SearchResultsFactory.setSearchParam('fOrderOpts', li);
                vm.refreshResults(true); // Reload the results after params changed
                vm.setOrderSelectedDisplay();
            });
        };

        // First call to populate search results page.
        vm.refreshResults();
    };
})();