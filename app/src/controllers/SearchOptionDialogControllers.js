(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('SearchOptionGenderDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionGenderDialogController])
        .controller('SearchOptionDistanceDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionDistanceDialogController])
        .controller('SearchOptionOrderDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionOrderDialogController])
        .controller('SearchOptionAgeDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionAgeDialogController])
        ;

    function SearchOptionGenderDialogController($log, $mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fSexOpts = SearchResultsFactory.getSearchParam('fSexOpts');

        vm.hide = function () {
            $log.debug('SearchOptionGenderDialogController dialog hide.');
            $mdDialog.hide();
        };
        vm.cancel = function () {
            $log.debug('SearchOptionGenderDialogController dialog cancel.');
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            $log.debug('SearchOptionGenderDialogController dialog returned: ', answer);
            $mdDialog.hide(answer);
        };
    }

    function SearchOptionDistanceDialogController($log, $mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fDistanceOpts = SearchResultsFactory.getSearchParam('fDistanceOpts');

        vm.hide = function () {
            $log.debug('SearchOptionDistanceDialogController dialog hide.');
            $mdDialog.hide();
        };
        vm.cancel = function () {
            $log.debug('SearchOptionDistanceDialogController dialog cancel.');
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            $log.debug('SearchOptionDistanceDialogController dialog returned: ', answer);
            $mdDialog.hide(answer);
        };
    }

    function SearchOptionOrderDialogController($log, $mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fOrderOpts = SearchResultsFactory.getSearchParam('fOrderOpts');

        vm.hide = function () {
            $log.debug('SearchOptionOrderDialogController dialog hide.');
            $mdDialog.hide();
        };
        vm.cancel = function () {
            $log.debug('SearchOptionOrderDialogController dialog cancel.');
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            $log.debug('SearchOptionOrderDialogController dialog returned: ', answer);
            $mdDialog.hide(answer);
        };
    }

    function SearchOptionAgeDialogController($log, $mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fAgeOpts = SearchResultsFactory.getSearchParam('fAgeOpts') || "18-99"; // e.g. "21-35"
        vm.fAgeMin = vm.fAgeOpts.split('-')[0];
        vm.fAgeMax = vm.fAgeOpts.split('-')[1];

        vm.hide = function () {
            $log.debug('SearchOptionAgeDialogController dialog hide.');
            $mdDialog.hide();
        };
        vm.cancel = function () {
            $log.debug('SearchOptionAgeDialogController dialog cancel.');
            $mdDialog.cancel();
        };
        vm.answer = function (min, max) {
            let answer = min + '-' + max;
            $log.debug('SearchOptionAgeDialogController dialog returned: ', answer);
            $mdDialog.hide(answer);
        };
    }

})();