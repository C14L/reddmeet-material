(function () {
    'use strict';

    angular.module('reddmeetApp').controller('ResultsController', ['$log', '$mdDialog', '$mdBottomSheet', '$scope', 'SearchResultsFactory', ResultsController]);

    /**
     * Display a list of users found with the current search settings.
     */
    function ResultsController($log, $mdDialog, $mdBottomSheet, $scope, SearchResultsFactory) {
        var vm = this;
        vm.title = "search results";
        vm.results = [];
        vm.isFirstRun = getLocalStorageString('isFirstRun', true);

        /**
         * Reads the current state of the search settings and fetches
         * new search results from the SearchResults service.
         * 
         * Called every time a search setting is updated, to reflect the
         * new setting in real-time.
         */
        vm.refreshResults = function () {
            vm.isLoading = true;
            SearchResultsFactory.getUserList().then(function (user_list) {
                console.log('## user_list item count: ' + user_list.length)
                vm.isLoading = false;
                vm.results = user_list;
            });
        }

        /**
         * Return the current user's distance to the supplied geolocation in kilometers.
         */
        vm.getDistance = function(lat, lng) {
            // TODO: Stub.
            return 500;
        }

        vm.editSearch = function (ev) {
            $log.debug('ResultsController.editSearch() called!!!');
            $mdDialog.show({
                targetEvent: ev,
                controller: SearchSettingsDialogController,
                controllerAs: 'vmForm',
                templateUrl: '/app/views/search-dialog.html'
            }).then(function (answer) {
                console.log('ResultsController got answer: "' + answer + '".');
            }, function () {
                console.log('Event cancled, ResultsController got nada.');
            });
        }

        vm.showSearchOptionGender = function (ev) {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: '/app/views/search-dialog-gender.html',
                controller: 'SearchOptionGenderDialogController',
                controllerAs: 'vmForm'
            }).then(function (clickedItem) {
                console.log('showSearchOptionGender clickedItem: ' + clickedItem);
            });
        };

        vm.showSearchOptionDistance = function (ev) {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: '/app/views/search-dialog-distance.html',
                controller: 'SearchOptionDistanceDialogController',
                controllerAs: 'vmForm'
            }).then(function (clickedItem) {
                console.log('showSearchOptionDistance clickedItem: ' + clickedItem);
            });
        };

        vm.showSearchOptionSubreddits = function (ev) {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: '/app/views/search-dialog-srlist.html',
                controller: 'SearchOptionSubredditsDialogController',
                controllerAs: 'vmForm'
            }).then(function (clickedItem) {
                console.log('showSearchOptionSubreddits clickedItem: ' + clickedItem);
            });
        };

        vm.showSearchOptionOrder = function (ev) {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: '/app/views/search-dialog-order.html',
                controller: 'SearchOptionOrderDialogController',
                controllerAs: 'vmForm'
            }).then(function (clickedItem) {
                console.log('showSearchOptionOrder clickedItem: ' + clickedItem);
            });
        };

        // First call to populate search results page.
        vm.refreshResults();
    };
})();