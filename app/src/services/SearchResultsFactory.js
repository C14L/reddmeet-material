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
                         'fOrderOpts': 'order_by', 'srOpts': 'sr-fav', 'fAgeOpts': 'f_age' };
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
                $log.debug('SearchResultsFactory.resetResults() --> RESETTING RESULTS!');
                currentLastPage = 0;
                currentResults = [];
            },

            getSearchParam: function(paramKey) {
                _searchOpts[paramKey] = getLocalStorageObject(paramKey, _searchOpts[paramKey]);
                console.log('getSearchParam() for paramKey=='+paramKey+' --> '+_searchOpts[paramKey]);
                return _searchOpts[paramKey];
            },

            setSearchParam: function(paramKey, paramVal) {
                //if (_searchOpts[paramKey] == paramVal) return; // no change

                this.resetResults();
                _searchOpts[paramKey] = paramVal;
                setLocalStorageObject(paramKey, _searchOpts[paramKey]);
            },

            getSearchParamsString: function() {
                // "&f_distance=1000&f_sex=4&order_by=-sr_count&f_age=20-40"
                let ps = [];
                for (const k in _searchOpts) {
                    if (typeof _searchOpts[k] == 'string') {
                        ps.push(_paramTr[k] + '=' + _searchOpts[k]);
                    } else {
                        for (const i in _searchOpts[k]) {
                            if (_searchOpts[k][i].selected) {
                                ps.push(_paramTr[k] + '=' + encodeURIComponent(_searchOpts[k][i].id));
                            }
                        }
                    }
                }
                return ps.join('&');
            },

            /**
             * Fetch a list of users from the backend, using the currently set search params,
             * append the resulting list to the current results list, and return the complete list.
             */
            getUserList: function(more) {
                if (currentResults.length < 1) {
                    this.resetResults();
                    more = true;
                }

                if (more) {
                    currentLastPage += 1;
                    let currentApiUrl = apiUrl + '?page=' + currentLastPage + '&' + this.getSearchParamsString();

                    return $http.get(currentApiUrl).then(response => {
                        if (response.status == 200)
                            currentResults = currentResults.concat(response.data.user_list);

                        return currentResults;
                    }).catch(error => currentResults);
                } else {
                    // Not requesting more, then return a resolved promise with the cached list.
                    return Promise.resolve().then(() => currentResults);
                }
            },
        };
    };

})();
