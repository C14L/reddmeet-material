(function () {
    'use strict';

    angular.module('reddmeetApp')
    .factory('SearchResultsFactory', ['$log', '$http', 'AuthUserFactory', 'fProfileOpts', SearchResultsFactory]);

    function SearchResultsFactory($log, $http, AuthUserFactory, fProfileOpts) {
        var searchApiUrl = API_BASE + '/api/v1/search';
        var apiUrl = API_BASE + '/api/v1/results';

        // Store here the entire last loaded results list and the
        // last page number requested.
        var currentLastPage = 0;
        var currentResults = [];
        var _paramTr = { 'fSexOpts': 'f_sex', 'fDistanceOpts': 'f_distance', 
                         'fOrderOpts': 'order_by', 'srOpts': 'sr-fav' };
        var _searchOpts = fProfileOpts;

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
