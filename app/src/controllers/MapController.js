(function () {
    'use strict';

    angular.module('reddmeetApp').controller('MapController', ['$log', MapController]);

    /**
     * Display a page with users on a map.
     */
    function MapController($log) {
        var vm = this;
        vm.title = "user map";
        vm.ts = new Date().toISOString();

        $log.debug('MapController called: ' + vm.ts);
    }

})();