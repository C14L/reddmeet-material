(function () {
    'use strict';

    angular.module('reddmeetApp').controller('StatsController', ['$log', StatsController]);

    /**
     * Display a page with some site statistics.
     */
    function StatsController($log) {
        var vm = this;
        vm.somename = "BLAAAAAH";
        vm.ts = new Date().toISOString();

        $log.debug('StatsController called: ' + vm.ts);
    }

})();