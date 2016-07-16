(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('MatchesController', ['$log', '$location', '$scope', '$http', MatchesController])
        .controller('VisitsController', ['$log', VisitsController])
        .controller('DownvotesController', ['$log', DownvotesController])
        ;

    /**
     * Display three tabs with "upvotes received", "upvote matches", "upvotes sent".
     */
    function MatchesController($log, $location, $scope, $http) {
        var apiUrlTpl = API_BASE + '/api/v1/{}.json';
        var vm = this;
        vm.tabs = { selectedIndex: 1 };
        vm.title = "Upvotes and Matches";
        vm.ts = new Date().toISOString();
        vm.userLists = { matches: [], upvotes_sent: [], upvotes_recv: [] };

        $location.search().recv && (vm.tabs.selectedIndex = 0);
        $location.search().matches && (vm.tabs.selectedIndex = 1);
        $location.search().sent && (vm.tabs.selectedIndex = 2);

        for (let x in vm.userLists) {
            $http.get(apiUrlTpl.replace('{}', x)).then(function(response){
                $log.debug('API response: ', response);
                vm.userLists[x] = response.data.user_list;
            }).catch(function(error){
                $log.error('Error: ', error);
            });
        };
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
