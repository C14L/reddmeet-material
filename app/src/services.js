(function(){ 'use strict';

  angular.module('reddmeetApp')
    .factory('SearchResultsFactory', ['$http', SearchResultsFactory]);


  /**
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function SearchResultsFactory($http){
    var apiUrl = "/app/mock/results.json"; // TODO: mock user data URL.

    return {
      getUserList : function(limit) {
        limit = limit || 20;

        return new Promise(function(resolve, reject) {
          $http.get(apiUrl)
            .success(function(data) {
              resolve(data.list.slice(0, limit));
            })
            .error(function() {
              //pass
            });

        });
      }
    };
  }

})();
