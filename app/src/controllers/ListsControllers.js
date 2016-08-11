(function () {
    'use strict';

    angular.module('reddmeetApp')
        .controller('ChatsController', ['$scope', '$rootScope', 'ChatFactory', ChatsController])
        .controller('MatchesController', ['$log', '$location', '$http', MatchesController])
        .controller('VisitsController', ['$log', '$http', VisitsController])
        .controller('DownvotesController', ['$log', '$http', DownvotesController])
        ;

    /**
     * Display most recent chat partners of auth user.
     */
    function ChatsController($scope, $rootScope, ChatFactory) {
        let vm = this;
        vm.isLoading = true;
        vm.title = "Recent messages";
        vm.chats = [];
        $scope.$on('chats:received', (event, data) => {
            vm.isLoading = false;
            vm.chats = ChatFactory.chats;
        });
        $rootScope.$broadcast('chat:viewedmsg', null);
        ChatFactory.requestChats();
    }

    /**
     * Display three tabs with "upvotes received", "upvote matches", "upvotes sent".
     */
    function MatchesController($log, $location, $http) {
        var apiUrlTpl = API_BASE + '/api/v1/{}.json';
        var vm = this;
        vm.isLoading = true;
        vm.tabs = { selectedIndex: 1 };
        vm.title = "Upvotes and Matches";
        vm.userLists = { matches: [], upvotes_sent: [], upvotes_recv: [] };

        $location.search().recv && (vm.tabs.selectedIndex = 0);
        $location.search().matches && (vm.tabs.selectedIndex = 1);
        $location.search().sent && (vm.tabs.selectedIndex = 2);

        for (let x in vm.userLists) {
            $http.get(apiUrlTpl.replace('{}', x)).then(response => {
                vm.isLoading = false;
                vm.userLists[x] = response.data.user_list;
            }).catch(error => {
                vm.isLoading = false;
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
        vm.isLoading = true;
        vm.tabs = { selectedIndex: 0 };
        vm.title = "Visits";
        vm.userLists = { visits: [], visitors: [] };

        for (let x in vm.userLists) {
            $http.get(apiUrlTpl.replace('{}', x)).then(response => {
                vm.isLoading = false;
                vm.userLists[x] = response.data.user_list;
            }).catch(error => {
                vm.isLoading = false;
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
        vm.isLoading = true;
        vm.tabs = { selectedIndex: 0 };
        vm.title = "Visits";
        vm.userLists = { downvoted: [] };

        for (let x in vm.userLists) {
            $http.get(apiUrlTpl.replace('{}', x)).then(response => {
                vm.isLoading = false;
                vm.userLists[x] = response.data.user_list;
            }).catch(error => {
                vm.isLoading = false;
                $log.error('Error: ', error);
            });
        };
    }

})();
