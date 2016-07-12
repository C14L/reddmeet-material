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
          $http.get(apiUrl).then(
            function successCallback(response) {
              response.data.view_user
              setLocalStorage(cacheId, response.data.view_user);
            },
            function errorCallback(response) {

            });

        });
      }
    };

  }]);


  app.factory('SearchResultsFactory', ['$http', function SearchResultsFactory($http) {
    var apiUrl = API_BASE + '/api/v1/results.json';

    return {
      setSearchParams: function (searchParams) {

      },
      getUserList: function () {
        return $http.get(apiUrl).then(function (response) {
          if (response.status == 200) {
            return response.data.user_list;
          }
          console.error(response.status, response.statusText);
          return [];
        }).catch(function (error) {
          console.error(error);
          return [];
        });
      }
    };

  }]);

})();


// Global helper functions. TODO: move to their own file.

function getLocalStorageObject(key) {
  // Gets a string from localStorage, parses it as JSON, and returns the 
  // resulting object. If the sting is not JSON, throws an error. If the 
  // key does not exist in localStorage, returns null.
  var val = localStorage.getItem(key);
  return (val) ? JSON.parse(val) : null;
}

function setLocalStorageObject(key, val) {
  // Gets a key name and a JSON object. Saves the object to localStorage after
  // converting it to a JSON string.
  return localStorage.setItem(key, JSON.stringify(val));
}

function mpLocalStorageGetItem(itemKey, defaultValue) {
    let val = localStorage.getItem(itemKey);

    if (val === null && defaultValue !== undefined) {
        return defaultValue;
    }
    return val;
}
