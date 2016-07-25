(function(){ 'use strict;'

	angular.module('reddmeetApp')
	    .controller('SettingsController', ['$log', SettingsController])
		.controller('SettingsProfileController', ['$log', SettingsProfileController])
		.controller('SettingsPicturesController', ['$log', SettingsPicturesController])
		.controller('SettingsLocationController', ['$log', '$timeout', '$mdToast', 'AuthUserFactory', SettingsLocationController])
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

	function SettingsLocationController($log, $timeout, $mdToast, AuthUserFactory) {
		var vm = this;
		vm.showBtn = true;
		vm.showSpinner = false;
		vm.toast = () => $mdToast.show($mdToast.simple().textContent('Location saved.').position('bottom').hideDelay(800));

		vm.save = event => {
			vm.showBtn = false;
			vm.showSpinner = true;
			AuthUserFactory.saveProfile('fuzzy')
			.then(response => vm.toast())
			.catch(err => $log.debug(err))
			.then(() => { 
				vm.showBtn = true;
				vm.showSpinner = false
			});
		};

		AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);
	}

	function SettingsSubredditsController($log) {
		var vm = this;
	}

	function SettingsAccountController($log) {
		var vm = this;
	}

})();
