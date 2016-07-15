(function () {
    'use strict';

    angular.module('reddmeetApp').controller('SrController', ['$log', SrController]);

    /**
     * Display a subreddit's user list.
     */
    function SrController($log) {
        var vm = this;
        vm.title = "subreddit";
        vm.ts = new Date().toISOString();

        $log.debug('SrController called: ' + vm.ts);
        angular.element(".transition-helper").fadeOut();
    };
})();