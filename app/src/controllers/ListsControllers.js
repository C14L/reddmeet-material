(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ChatsController', ['$log', '$http', ChatsController])
        .controller('MatchesController', ['$log', '$location', '$http', MatchesController])
        .controller('VisitsController', ['$log', '$http', VisitsController])
        .controller('DownvotesController', ['$log', '$http', DownvotesController])
        ;

    /**
     * Display most recent chat partners of auth user.
     */
    function ChatsController($log, $http) {
        var apiUrl = API_BASE + '/api/v1/chats.json';
        var vm = this;
        vm.title = "Recent chats";
        vm.userLists = { chats: [] };

        $http.get(apiUrl).then(response => {
            $log.debug('API response: ', response);
            vm.userLists['chats'] = response.data.user_list;
        }).catch(err => {
            $log.error('Error: ', err);
        });
    }

    /**
     * Display three tabs with "upvotes received", "upvote matches", "upvotes sent".
     */
    function MatchesController($log, $location, $http) {
        var apiUrlTpl = API_BASE + '/api/v1/{}.json';
        var vm = this;
        vm.tabs = { selectedIndex: 1 };
        vm.title = "Upvotes and Matches";
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
    function VisitsController($log, $http) {
        var apiUrlTpl = API_BASE + '/api/v1/{}.json';
        var vm = this;
        vm.tabs = { selectedIndex: 0 };
        vm.title = "Visits";
        vm.userLists = { visits: [], visitors: [] };

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
     * Display a list of users downvoted by authuser.
     */
    function DownvotesController($log, $http) {
        var apiUrlTpl = API_BASE + '/api/v1/{}.json';
        var vm = this;
        vm.tabs = { selectedIndex: 0 };
        vm.title = "Visits";
        vm.userLists = { downvoted: [] };

        for (let x in vm.userLists) {
            $http.get(apiUrlTpl.replace('{}', x)).then(function(response){
                $log.debug('API response: ', response);
                vm.userLists[x] = response.data.user_list;
            }).catch(function(error){
                $log.error('Error: ', error);
            });
        };
    }

})();
