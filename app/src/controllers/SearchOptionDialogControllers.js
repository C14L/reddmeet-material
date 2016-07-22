(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('SearchOptionGenderDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionGenderDialogController])
        .controller('SearchOptionDistanceDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionDistanceDialogController])
        .controller('SearchOptionOrderDialogController', ['$log', '$mdDialog', 'SearchResultsFactory', SearchOptionOrderDialogController])
	    .controller('SearchOptionSubredditsDialogController', ['$log', '$mdDialog', 'AuthUserFactory', 'SearchResultsFactory', SearchOptionSubredditsDialogController])
        ;

    function SearchOptionGenderDialogController($log, $mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fSexOpts = SearchResultsFactory.fSexOpts;

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
        vm.fDistanceOpts = SearchResultsFactory.fDistanceOpts;

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

    function SearchOptionSubredditsDialogController($log, $mdDialog, AuthUserFactory, SearchResultsFactory) {
        var vm = this;

        SearchResultsFactory.getSrOpts().then(function(li){
            vm.fSrOpts = li;
        });
        vm.selectAll = function () {
            vm.fSrOpts.forEach(item => item.active = true);
        }
        vm.selectNone = function () {
            vm.fSrOpts.forEach(item => item.active = false);
        }
        vm.hide = function () {
            $log.debug('SearchSettingsDialogController dialog hide.');
            $mdDialog.hide();
        };
        vm.cancel = function () {
            $log.debug('SearchSettingsDialogController dialog cancel.');
            $mdDialog.cancel();
        };
        vm.answer = function (answer) {
            $log.debug('SearchSettingsDialogController dialog returned: ', answer);
            $log.debug('Labels vm.fSrOpts', vm.fSrOpts.filter(x => x.active).map(x => x.label).join(', '));
            $mdDialog.hide(answer);
        };
    };

    function SearchOptionOrderDialogController($log, $mdDialog, SearchResultsFactory) {
        var vm = this;
        vm.fOrderOpts = SearchResultsFactory.fOrderOpts;

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

})();