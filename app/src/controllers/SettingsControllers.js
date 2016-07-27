(function(){ 'use strict;'

	angular.module('reddmeetApp')
	    .controller('SettingsController', ['$log', SettingsController])
		.controller('SettingsProfileController', ['$log', SettingsProfileController])
		.controller('SettingsPicturesController', ['$log', SettingsPicturesController])
		.controller('SettingsLocationController', ['$log', '$timeout', '$mdToast', 'AuthUserFactory', SettingsLocationController])
		.controller('SettingsSubredditsController', ['$log', '$mdToast', 'AuthUserFactory', SettingsSubredditsController])
		.controller('SettingsAccountController', ['$log', '$mdToast', 'AuthUserFactory', SettingsAccountController])
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
			
			AuthUserFactory.setFuzzyGeoloc()
			.then(() => AuthUserFactory.saveProfile(['fuzzy', 'lat', 'lng']))
			.then(response => {
				vm.toast();
				vm.showBtn = true;
				vm.showSpinner = false;
			})
			.catch(err => {
				$log.debug(err);
				vm.showBtn = true;
				vm.showSpinner = false
			});
		};

		AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);
	}

	function SettingsSubredditsController($log, $mdToast, AuthUserFactory) {
		var vm = this;
		vm.showBtn = true;
		vm.showSpinner = false;
		vm.toast = () => $mdToast.show($mdToast.simple().textContent('Subreddit list updated.').position('bottom').hideDelay(800));

		vm.save = event => {
			vm.showBtn = false;
			vm.showSpinner = true;

			/* AuthUserFactory.saveProfile('fuzzy')
			.then(response => vm.toast())
			.catch(err => $log.debug(err))
			.then(() => { 
				vm.showBtn = true;
				vm.showSpinner = false
			}); */
		};

		AuthUserFactory.getAuthUser().then(obj => vm.subs = obj.subs);
	}

	function SettingsAccountController($log, $mdToast, AuthUserFactory) {
		var vm = this;

		vm.prefDistanceChanged = event => {
			let toast = $mdToast.simple().textContent('Unit change saved.').position('bottom').hideDelay(800);

			AuthUserFactory.saveProfile('pref_distance_unit')
			.then(response => $mdToast.show(toast))
			.catch(err => $log.debug(err));
		};

		vm.prefNotificationsChanged = event => {
			let toast = $mdToast.simple().textContent('Notification setting saved.').position('bottom').hideDelay(800);
			
			if (! AuthUserFactory.getProfile('pref_receive_notification')) {
				// Disable, only store on server.
				AuthUserFactory.saveProfile('pref_receive_notification')
				.then(response => $mdToast.show(toast));
			}
			else if (AuthUserFactory.getProfile('gcm_subscription')) {
				// Enable, but there is already a GSM subscription value.
				AuthUserFactory.saveProfile('pref_receive_notification')
				.then(response => $mdToast.show(toast));
			}
			else {
				// Enable. First get new subscription to GCM, then store keys on server.
				navigator.serviceWorker.getRegistration()
				.then(reg => reg.pushManager.subscribe({userVisibleOnly: true}))
				.then(sub => {
					AuthUserFactory.setProfile('gcm_subscription', JSON.stringify(sub));
					return AuthUserFactory.saveProfile(['pref_receive_notification', 'gcm_subscription']);
				})
				.then(response => $mdToast.show(toast))
				.catch(err => $log.debug(err));
			}
		};

		AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);
	}

})();
