(function(){ 'use strict;'

	angular.module('reddmeetApp')
	    .controller('SettingsController', ['$log', SettingsController])
		.controller('SettingsProfileController', ['$log', SettingsProfileController])
		.controller('SettingsPicturesController', ['$log', SettingsPicturesController])
		.controller('SettingsLocationController', ['$log', SettingsLocationController])
		.controller('SettingsSubredditsController', ['$log', SettingsSubredditsController])
		.controller('SettingsAccountController', ['$log', SettingsAccountController])
		;

	/**
	 * Display an account settings page.
	 */
	function SettingsController($log) {
		var vm = this;
		vm.title = "account settings";
		vm.ts = new Date( ).toISOString( );

		$log.debug('SettingsController called: ' + vm.ts);
	}

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
