(function(){ 'use strict;'

	angular.module('reddmeetApp')
		.controller('SettingsProfileController', 
			['$log', SettingsProfileController])
		.controller('SettingsPicturesController',
			['$log', SettingsPicturesController])
		.controller('SettingsLocationController',
			['$log', SettingsLocationController])
		.controller('SettingsSubredditsController',
			['$log', SettingsSubredditsController])
		.controller('SettingsAccountController',
			['$log', SettingsAccountController]);


	function SettingsProfileController($log) {
		var vm = this;
	}

	function SettingsPicturesController($log) {
		var vm = this;
	}

	function SettingsLocationController($log) {
		var vm = this;
	}

	function SettingsSubredditsController($log) {
		var vm = this;
	}

	function SettingsAccountController($log) {
		var vm = this;
	}

})();
