
window.API_BASE = "";

(function () {
	'use strict';

	var app = angular.module('reddmeetApp', ['ngMaterial', 'ngRoute', 'angularMoment', 'NgPicUpload']);

	app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$mdThemingProvider', 'amTimeAgoConfig', function reddmeetAppConfig($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider, amTimeAgoConfig) {

		$mdThemingProvider
			.theme('default')
			.primaryPalette('indigo')
			.accentPalette('amber');

		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});

		$httpProvider.useApplyAsync(true);  // pool xhrs promises for digesting

		amTimeAgoConfig['withoutSuffix'] = true;

		$routeProvider
			.when('/results', {
				controller: 'ResultsController',
				controllerAs: 'vm',
				templateUrl: '/app/views/results.html'
			})

			.when('/upvotes', {
				controller: 'MatchesController',
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

			.when('/hidden', {
				controller: 'DownvotesController',
				controllerAs: 'vm',
				templateUrl: '/app/views/results.html'
			})

			.when('/r/:subreddit', {
				controller: 'SrController',
				controllerAs: 'vm',
				templateUrl: '/app/views/sr.html'
			})
			.when('/u/:username', {
				controller: 'ProfileController',
				controllerAs: 'vm',
				templateUrl: '/app/views/profile.html'
			})

			.when('/me/profile', {
				controller: 'SettingsProfileController',
				controllerAs: 'vm',
				templateUrl: '/app/views/settings-profile.html'
			})
			.when('/me/pictures', {
				controller: 'SettingsPicturesController',
				controllerAs: 'vm',
				templateUrl: '/app/views/settings-pictures.html'
			})
			.when('/me/location', {
				controller: 'SettingsLocationController',
				controllerAs: 'vm',
				templateUrl: '/app/views/settings-location.html'
			})
			.when('/me/subs', {
				controller: 'SettingsSubredditsController',
				controllerAs: 'vm',
				templateUrl: '/app/views/settings-subreddits.html'
			})
			.when('/me/account', {
				controller: 'SettingsAccountController',
				controllerAs: 'vm',
				templateUrl: '/app/views/settings-account.html'
			})

			.when('/map', {
				controller: 'MapController',
				controllerAs: 'vm',
				templateUrl: '/app/views/map.html'
			})
			.when('/stats', {
				controller: 'StatsController',
				controllerAs: 'vm',
				templateUrl: '/app/views/stats.html'
			})

			.otherwise({
				redirectTo: '/results',
			});
	}]);


	app.run(['$http', '$log', 'AuthUserFactory', function reddmeetAppRun($http, $log, AuthUserFactory) {
		$http.defaults.headers.post['X-CSRFToken'] = get_cookie('csrftoken');
		$http.defaults.headers.put['X-CSRFToken'] = get_cookie('csrftoken');
		$http.defaults.headers.delete = { 'X-CSRFToken': get_cookie('csrftoken') };
		$log.debug('Runnning...');
	}]);
})();
