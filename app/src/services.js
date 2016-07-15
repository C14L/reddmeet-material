(function () {
    'use strict';

    var app = angular.module('reddmeetApp');

    app.factory('AuthUserFactory', ['$http', function AuthUserFactory($http) {
        return {
            getAuthUser: function () {
                var apiUrl = API_BASE + '/api/v1/authuser.json';

                return new Promise(function (resolve, reject) {
                    $http.get(apiUrl).then(function successCallback(response) {
                        resolve(response.data);
                    }, function errorCallback(response) {
                        reject(response.status);
                    });
                });
            },
        };
    }]);

    app.factory('UserFactory', ['$http', function UserFactory($http) {
        return {
            getViewUser: function (username) {
                var apiUrl = API_BASE + '/api/v1/u/' + username + '.json';

                return new Promise(function (resolve, reject) {
                    $http.get(apiUrl).then(function successCallback(response) {
                        response.data.view_user
                        setLocalStorage(cacheId, response.data.view_user);
                    },
                    function errorCallback(response) {

                    });
                });
            },
        };
    }]);

    app.factory('SearchResultsFactory', ['$http', function SearchResultsFactory($http) {
        var apiUrl = API_BASE + '/api/v1/results.json';

        // Store here the entire last loaded results list and the
        // last page number requested.
        var currentLastPage = 0;
        var currentResults = [];

        var fSex = 0;
        var fSexOpts = [
            { id: 1, label: "women who like men" },
            { id: 2, label: "women who like women" },
            { id: 3, label: "women who like queer" },
            { id: 4, label: "men who like women" },
            { id: 5, label: "men who like men" },
            { id: 6, label: "men who like queer" },
            { id: 7, label: "queer who like women" },
            { id: 8, label: "queer who like men" },
            { id: 9, label: "queer who like queer" }];

        var fDistance = 0;
        var fDistanceOpts = [
            { id: 5000, label: "5000 km / 3100 miles" },
            { id: 2000, label: "2000 km / 1250 miles" },
            { id: 1000, label: "1000 km / 620 miles" },
            { id: 700, label: "700 km / 435 miles" },
            { id: 500, label: "500 km / 310 miles" },
            { id: 300, label: "300 km / 186 miles" },
            { id: 200, label: "200 km / 125 miles" },
            { id: 100, label: "100 km / 62 miles" },
            { id: 50, label: "50 km / 31 miles" },
            { id: 20, label: "20 km / 12 miles" }];

        var fSr = [];
        var fSrOpts = [
            { label: "600euro", active: true }, { label: "Arianespace", active: true }, { label: "AskEurope", active: true }, { label: "askscience", active: true }, { label: "AskSocialScience", active: true }, { label: "berlin", active: true }, { label: "bestof", active: true }, { label: "bestofhn", active: true }, { label: "Bitcoin", active: true }, { label: "blackhat", active: true }, { label: "ChineseReddit", active: true }, { label: "Colonizemars", active: true }, { label: "DarwinAwards", active: true }, { label: "dataisbeautiful", active: true }, { label: "datasets", active: true }, { label: "de", active: true }, { label: "DiePartei", active: true }, { label: "diginomads", active: true }, { label: "digitalnomad", active: true }, { label: "educationalgifs", active: true }, { label: "EuropeanFederalists", active: true }, { label: "europeanparliament", active: true }, { label: "europes", active: true }, { label: "FragReddit", active: true }, { label: "france", active: true }, { label: "free_images", active: true }, { label: "FreeTrialsOnline", active: true }, { label: "Futurology", active: true }, { label: "geopolitics", active: true }, { label: "googleearth", active: true }, { label: "hamburg", active: true }, { label: "hwstartups", active: true }, { label: "hybridapps", active: true }, { label: "hyperloop", active: true }, { label: "intdev", active: true }, { label: "InternetIsBeautiful", active: true }, { label: "Inventions", active: true }, { label: "MannausSachsen", active: true }, { label: "MapPorn", active: true }, { label: "mobile", active: true }, { label: "naturstein", active: true }, { label: "NeutralPolitics", active: true }, { label: "NichtDiePartei", active: true }, { label: "nottheonion", active: true }, { label: "OutOfTheLoop", active: true }, { label: "PeaceAndConflict", active: true }, { label: "privacy", active: true }, { label: "redddate", active: true }, { label: "science", active: true }, { label: "selfserve", active: true }, { label: "selinux", active: true }, { label: "socialmediaanalytics", active: true }, { label: "space", active: true }, { label: "Space_Colonization", active: true }, { label: "spacex", active: true }, { label: "talesfromtechsupport", active: true }, { label: "technology", active: true }, { label: "TechNomad", active: true }, { label: "TheoryOfReddit", active: true }, { label: "tinycode", active: true }, { label: "trichotillomania", active: true }, { label: "Trichsters", active: true }, { label: "Unexpected", active: true }, { label: "UsefulWebsites", active: true }, { label: "vpnreviews", active: true }, { label: "WikiLeaks", active: true }, { label: "WorldDevelopment", active: true }, { label: "worldevents", active: true }, { label: "worldnews", active: true }, { label: "worldpolitics", active: true }];

        var fOrderOpts = '';
        var fOrderOpts = [
            { id: "-sr_count", label: "best matches" },
            { id: "-accessed", label: "recently active" },
            { id: "-date_joined", label: "newest members" },
            { id: "-views_count", label: "most viewed" }];

        return {
            resetResults: function(){
                currentLastPage = 0;
                currentResults = [];
            },
            setSearchParams: function (searchParams) {
                // Changing search optioins resets results list.
                resetResults();

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
    }]);

})();

