(function () {
    'use strict';

    angular.module('reddmeetApp')
        .factory('SearchResultsFactory', ['$log', '$http', 'AuthUserFactory', SearchResultsFactory])
        ;

    function SearchResultsFactory($log, $http, AuthUserFactory) {
        var apiUrl = API_BASE + '/api/v1/results.json';

        // Store here the entire last loaded results list and the
        // last page number requested.
        var currentLastPage = 0;
        var currentResults = [];
        var _srOpts = [];

        return {

            fSexOpts: [
                { id: 0, label: "everybody", selected: true },
                { id: 1, label: "women who like men", selected: false },
                { id: 2, label: "women who like women", selected: false },
                { id: 3, label: "women who like queer", selected: false },
                { id: 4, label: "men who like women", selected: false },
                { id: 5, label: "men who like men", selected: false },
                { id: 6, label: "men who like queer", selected: false },
                { id: 7, label: "queer who like women", selected: false },
                { id: 8, label: "queer who like men", selected: false },
                { id: 9, label: "queer who like queer", selected: false },
            ],

            fDistanceOpts: [
                { id: 0, label: "worldwide", selected: true },
                { id: 5000, label: "5000 km / 3100 miles", selected: false },
                { id: 2000, label: "2000 km / 1250 miles", selected: false },
                { id: 1000, label: "1000 km / 620 miles", selected: false },
                { id: 700, label: "700 km / 435 miles", selected: false },
                { id: 500, label: "500 km / 310 miles", selected: false },
                { id: 300, label: "300 km / 186 miles", selected: false },
                { id: 200, label: "200 km / 125 miles", selected: false },
                { id: 100, label: "100 km / 62 miles", selected: false },
                { id: 50, label: "50 km / 31 miles", selected: false },
                { id: 20, label: "20 km / 12 miles", selected: false },
            ],

            fOrderOpts: [
                { id: "-sr_count", label: "best matches", selected: true },
                { id: "-accessed", label: "recently active", selected: false },
                { id: "-date_joined", label: "newest members", selected: false },
                { id: "-views_count", label: "most viewed", selected: false },
            ],

            getSrOpts: function () {
                // The "subreddit options" is a list of dicts with a sr.label (str: subreddit title)
                // and a sr.active (bool: actively use in search or not).
                return Promise.resolve().then(function () {
                    if (_srOpts.length) return _srOpts;

                    return AuthUserFactory.getAuthUserSrList().then(function (li) {
                        li.forEach(function (x) { _srOpts.push({ label: x, active: true }); });
                        return _srOpts;
                    });
                });
            },

            resetResults: function () {
                currentLastPage = 0;
                currentResults = [];
            },
            setSearchParam: function (param) {
                this.resetResults();
                $log.debug('SearchResultsFactory.setSearchParam: ', param);

                //...TODO
            },
            getUserList: function () {
                currentLastPage += 1;
                let currentApiUrl = apiUrl + '?page=' + currentLastPage;
                return $http.get(currentApiUrl).then(function (response) {
                    if (response.status == 200) {
                        currentResults = currentResults.concat(response.data.user_list);
                        console.dir(currentResults);
                        return currentResults;
                    }
                    console.error(response.status, response.statusText);
                    return [];
                }).catch(function (error) {
                    console.error('Network error');
                    return [];
                });
            },
        };
    };



})();
