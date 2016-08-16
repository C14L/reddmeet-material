(function () {
    'use strict';

    angular.module('reddmeetApp')
        .factory('SearchResultsFactory', ['$log', '$http', 'AuthUserFactory', SearchResultsFactory])
        ;

    function SearchResultsFactory($log, $http, AuthUserFactory) {
        var searchApiUrl = API_BASE + '/api/v1/search';
        var apiUrl = API_BASE + '/api/v1/results';

        // Store here the entire last loaded results list and the
        // last page number requested.
        var currentLastPage = 0;
        var currentResults = [];
        var _paramTr = { 'fSexOpts': 'f_sex', 'fDistanceOpts': 'f_distance', 
                         'fOrderOpts': 'order_by', 'srOpts': 'sr-fav' };
        var _searchOpts = {
            'fSexOpts': [
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
            'fDistanceOpts': [
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
            'fOrderOpts': [
                { id: "-sr_count", label: "best matches", selected: true },
                { id: "-accessed", label: "recently active", selected: false },
                { id: "-date_joined", label: "newest members", selected: false },
                { id: "-views_count", label: "most viewed", selected: false },
            ],
        	'srOpts': [],
        };

        return { 
                       
            getSrOpts: function() {
                // The "subreddit options" is a list of dicts with a sr.label (str: subreddit title)
                // and a sr.active (bool: actively use in search or not).
                return Promise.resolve().then(() => {
                    if (_searchOpts['srOpts'].length) return _searchOpts['srOpts'];

                    return AuthUserFactory.getAuthUserSrList().then(li => {
                        li.forEach(x => _searchOpts['srOpts'].push({ label: x, active: true }));
                        return _searchOpts['srOpts'];
                    });
                });
            },

            resetResults: function() {
                currentLastPage = 0;
                currentResults = [];
            },

            getSearchParam: function(paramKey) {
                _searchOpts[paramKey] = getLocalStorageObject(paramKey, _searchOpts[paramKey]);
                return _searchOpts[paramKey];
            },

            setSearchParam: function(paramKey, paramVal) {
                this.resetResults();
                setLocalStorageObject(paramKey, _searchOpts[paramKey]);
                _searchOpts[paramKey] = paramVal;
                return true;
            },

            getSearchParamsString: function() {
                // "&sr-fav=1&f_distance=1000&f_sex=4&order_by=-sr_count"
                let ps = [];
                for (const k in _searchOpts) {
                    for (const i in _searchOpts[k]) {
                        if (_searchOpts[k][i].selected) {
                            ps.push(_paramTr[k] + '=' + encodeURIComponent(_searchOpts[k][i].id));
                        }
                    }
                }
                return ps.join('&');
            },

            /**
             * Fetch a list of users from the backend, using the currently set search params,
             * append the resulting list to the current results list, and return the complete list.
             */
            getUserList: function() {
                currentLastPage += 1;
                let currentApiUrl = apiUrl + '?page=' + currentLastPage + '&' + this.getSearchParamsString();
                $log.debug('SearchResultsFactory.getUserList :: currentApiUrl == ', currentApiUrl);

                return $http.get(currentApiUrl)
                .then(response => (response.status == 200) ? currentResults.concat(response.data.user_list) : currentResults)
                .catch(error => currentResults);
            },
        };
    };

})();
