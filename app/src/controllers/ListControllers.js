(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('UpvotesController', ['$log', '$location', '$scope', UpvotesController])
        .controller('VisitsController', ['$log', VisitsController])
        .controller('DownvotesController', ['$log', DownvotesController])
        ;

    /**
     * Display three tabs with "upvotes received", "upvote matches", "upvotes sent".
     */
    function UpvotesController($log, $location, $scope) {
        var vm = this;
        vm.tabs = { selectedIndex: 1 };
        vm.title = "upvotes inbox / matches / upvotes sent";
        vm.ts = new Date().toISOString();

        $log.debug('UpvotesController called: ' + vm.ts);
    }


    /**
     * Display two tabs with "viewed me" and "recently viewed".
     */
    function VisitsController($log) {
        var vm = this;
        vm.title = "viewed me / recently viewed";
        vm.ts = new Date().toISOString();

        $log.debug('VisitsController called: ' + vm.ts);
    }

    /**
     * Display a list of users downvoted by authuser.
     */
    function DownvotesController($log) {
        var vm = this;
        vm.title = "hidden";
        vm.ts = new Date().toISOString();

        $log.debug('DownvotesController called: ' + vm.ts);
    }

})();
