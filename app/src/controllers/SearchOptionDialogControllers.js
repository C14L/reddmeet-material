(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('SearchOptionGenderDialogController', ['$mdDialog', 'SearchResultsFactory', SearchOptionGenderDialogController])
        .controller('SearchOptionDistanceDialogController', ['$mdDialog', 'SearchResultsFactory', SearchOptionDistanceDialogController])
        .controller('SearchOptionOrderDialogController', ['$mdDialog', 'SearchResultsFactory', SearchOptionOrderDialogController])
	    .controller('SearchOptionSubredditsDialogController', ['$mdDialog', 'AuthUserFactory', 'SearchResultsFactory', SearchOptionSubredditsDialogController])
        ;

    function SearchOptionGenderDialogController($mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fSexOpts = SearchResultsFactory.fSexOpts;


        vm.hide = function () {
            console.log('SearchOptionGenderDialogController dialog hide.')
            $mdDialog.hide();
        };
        vm.cancel = function () {
            console.log('SearchOptionGenderDialogController dialog cancel.')
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            console.log('SearchOptionGenderDialogController dialog returned: "' + answer + '".')
            $mdDialog.hide(answer);
        };
    }

    function SearchOptionDistanceDialogController($mdDialog, SearchResultsFactory) {
        var vm = this;

        vm.fDistanceOpts = SearchResultsFactory.fDistanceOpts;

        vm.hide = function () {
            console.log('SearchOptionDistanceDialogController dialog hide.')
            $mdDialog.hide();
        };
        vm.cancel = function () {
            console.log('SearchOptionDistanceDialogController dialog cancel.')
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            console.log('SearchOptionDistanceDialogController dialog returned: "' + answer + '".')
            $mdDialog.hide(answer);
        };
    }

    function SearchOptionSubredditsDialogController($mdDialog, AuthUserFactory, SearchResultsFactory) {

        var vm = this;
        vm.fSrOpts = SearchResultsFactory.fSrOpts;

        vm.fSr = vm.fSrOpts; // default select all

        vm.selectAll = function () {
            vm.fSr = vm.fSrOpts;
        }
        vm.selectNone = function () {
            vm.fSr = [];
        }

        vm.hide = function () {
            console.log('SearchSettingsDialogController dialog hide.')
            $mdDialog.hide();
        };
        vm.cancel = function () {
            console.log('SearchSettingsDialogController dialog cancel.')
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            console.log('SearchSettingsDialogController dialog returned: "' + answer + '".')
            $mdDialog.hide(answer);
        };
    };

    function SearchOptionOrderDialogController($mdDialog, SearchResultsFactory) {
        var vm = this;

        vm.fOrderOpts = SearchResultsFactory.fOrderOpts;

        vm.hide = function () {
            console.log('SearchOptionOrderDialogController dialog hide.')
            $mdDialog.hide();
        };
        vm.cancel = function () {
            console.log('SearchOptionOrderDialogController dialog cancel.')
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            console.log('SearchOptionOrderDialogController dialog returned: "' + answer + '".')
            $mdDialog.hide(answer);
        };
    }

})();