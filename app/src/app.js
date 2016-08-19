
window.API_BASE = "";
window.WS_BASE = "ws://localhost:8000/api/v1/ws";

(function () {
	'use strict';

	var app = angular.module('reddmeetApp', ['ngMaterial', 'ngRoute', 'angularMoment', 'NgPicUpload', 'ngWebSocket']);

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
			.when('/chats', {
				controller: 'ChatsController',
				controllerAs: 'vm',
				templateUrl: '/app/views/chats.html'
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
			.when('/chat/:username', {
				controller: 'ChatController',
				controllerAs: 'vm',
				templateUrl: '/app/views/chat.html'
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

	app.value('fProfileOpts', {
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
	});

	app.run(['$http', '$log', 'AuthUserFactory', function reddmeetAppRun($http, $log, AuthUserFactory) {
		$http.defaults.headers.post['X-CSRFToken'] = get_cookie('csrftoken');
		$http.defaults.headers.put['X-CSRFToken'] = get_cookie('csrftoken');
		$http.defaults.headers.delete = { 'X-CSRFToken': get_cookie('csrftoken') };
		$log.debug('Runnning...');
	}]);
})();
