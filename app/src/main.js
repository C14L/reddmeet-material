(function(){
  'use strict';

	angular.module('reddmeetApp', ['ngMaterial', 'ngRoute']);

	angular.module('reddmeetApp')
		.config(['$routeProvider', '$locationProvider', '$httpProvider', '$mdThemingProvider', reddmeetAppConfig])
		.run(['$http', '$log', reddmeetAppRun]);


	function reddmeetAppConfig($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider) {
    $mdThemingProvider
    	.theme('default')
      .primaryPalette('indigo')
      .accentPalette('amber');

		$locationProvider.html5Mode({
		  enabled: false,
		  requireBase: false
		});

		$httpProvider.useApplyAsync(true);  // pool xhrs promises for digesting

    $routeProvider
	    .when('/results', {
        controller: 'ResultsController',
        controllerAs: 'vm',
        templateUrl: '/app/views/results.html'
	    })

	    .when('/upvotes_inbox', {
        controller: 'UpvotesController',
        controllerAs: 'vm',
        templateUrl: '/app/views/matches.html'
	    })
	    .when('/matches', {
        controller: 'UpvotesController',
        controllerAs: 'vm',
        templateUrl: '/app/views/matches.html'
	    })
	    .when('/upvotes_sent', {
        controller: 'UpvotesController',
        controllerAs: 'vm',
        templateUrl: '/app/views/matches.html'
	    })

	    .when('/visitors', {
        controller: 'VisitsController',
        controllerAs: 'vm',
        templateUrl: '/app/views/visits.html'
	    })
	    .when('/visited', {
        controller: 'VisitsController',
        controllerAs: 'vm',
        templateUrl: '/app/views/visits.html'
	    })

	    .when('/r/:subreddit/', {
        controller: 'SrController',
        controllerAs: 'vm',
        templateUrl: '/app/views/results.html'
	    }) 

	    .when('/hidden', {
        controller: 'DownvotesController',
        controllerAs: 'vm',
        templateUrl: '/app/views/results.html'
	    })

	    .when('/me', { 
        controller: 'SettingsController',
        controllerAs: 'vm',
        templateUrl: 'src/views/settings.html'
	    })
	    .when('/u/:username', {
        controller: 'ProfileController',
        controllerAs: 'vm',
        templateUrl: 'src/views/profile.html'
	    })

	    .when('/map', {
        controller: 'MapController',
        controllerAs: 'vm',
        templateUrl: 'src/views/map.html'
	    })
	    .when('/stats', {
        controller: 'StatsController',
        controllerAs: 'vm',
        templateUrl: 'src/views/stats.html'
	    })

			.otherwise({
				redirectTo: '/results',
			})
	}

	function reddmeetAppRun($http, $log) {
    $http.defaults.headers.post['X-CSRFToken'] = get_cookie('csrftoken');
    $http.defaults.headers.put['X-CSRFToken'] = get_cookie('csrftoken');
    $http.defaults.headers.delete = { 'X-CSRFToken': get_cookie('csrftoken') };
    $log.debug('Runnning...');
	}

	// Cookie helper functions

	function set_cookie(name, value, days){
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime()+(days*24*60*60*1000));
	        var expires = "; expires="+date.toGMTString();
	    }
	    else var expires = "";
	    // Replace any ";" in value with something else
	    value = ('' + value).replace(/;/g, ',');
	    document.cookie = urlencode(name) + "=" + urlencode(value) + expires + "; path=/";
	}
	function get_cookie(name){
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1, c.length);
	        if (c.indexOf(nameEQ) == 0)
	            return urldecode(c.substring(nameEQ.length, c.length));
	    }
	    return null;
	}
	function delete_cookie(name){
	    setCookie(name, "", -1);
	}

})();


