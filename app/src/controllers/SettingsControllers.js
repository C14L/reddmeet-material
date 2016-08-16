(function(){ 'use strict';

	angular.module('reddmeetApp')
	    .controller('SettingsController', ['$log', SettingsController])

		.controller('SettingsProfileController', ['$log', SettingsProfileController])

		.controller('SettingsPicturesController', ['$log', '$scope', '$http', 'AuthUserFactory',SettingsPicturesController])

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

	function SettingsPicturesController($log, $scope, $http, AuthUserFactory) {
		var vm = this;
		vm.pic = null;
		vm.uploadApiUrl = API_BASE + '/api/v1/authuser-picture';
		vm.isLoading = false;
		vm.isResizing = false;
		vm.isTransfering = false;
		vm.rand = '';

		// TODO: In NgPicUpload, fix resizing dimensions.
		// TODO: Use upload md-buttin for upload and hide input[type=file].
		// TODO: Enable upload by link. Download from source, resize, and upload to server.

		vm.triggerUpload = () => {
			// Click the file select button.
			let target = angular.element('#settings-picture-file-input')[0];
			let event = new MouseEvent('click');
			target.dispatchEvent(event);
		}

		vm.beforeUpload = () => {
			$log.debug('### SettingsPicturesController.beforeUpload() called...');
			vm.isLoading = true;
			vm.isResizing = true;
			vm.isTransfering = false;
			$scope.$apply();
		}

		vm.afterResize = () => {
			$log.debug('### SettingsPicturesController.afterResize() called...');
			vm.isLoading = true;
			vm.isResizing = false;
			vm.isTransfering = true;
			$scope.$apply();
		}

		vm.afterUpload = imageResult => {
			$log.debug('### SettingsPicturesController.afterUpload() called...');
			$log.debug('### ...and vm.pic changed to: ', vm.pic);
			vm.isLoading = false;
			vm.isResizing = false;
			vm.isTransfering = false;
			vm.pic = null;
			vm.rand = getRandInt(1000, 9999);
			$scope.$apply();
			// TODO: add to authuser factory data! ###
		};

		vm.destroyPic = () => {
			$http({ url: vm.uploadApiUrl, method: 'DELETE' })
			.then(response => {
				vm.pic = null;
				vm.rand = getRandInt(1000, 9999);
				// let url = '/m/' + AuthUserFactory.username + '.jpg';
				// fetch('/m/' + AuthUserFactory.username + '.jpg'); // Refresh SW cache.
				// TODO: Broadcast for refresh in mainctrl.
				$scope.$apply();
			})
			.catch(err => $log.debug('Error while deleting picture!', err));
		}
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

			// Check if there is an active subscription on the device.
			navigator.serviceWorker.getRegistration()
			.then(reg => reg.pushManager.getSubscription())
			.then(sub => {
				if (sub) {
					// There is an active subscription on this device, disable it.
					Promise.all([
						AuthUserFactory.destroyPushNotificationEndpoint(sub),
						sub.unsubscribe()
					])
					.then(responses => {
						console.log('### Notifications disabled: ', sub);
						$mdToast.show(toast);
					});
				}
				else {
					// Not subscription active, so create one.
					// Get a new subscription to GCM, then store it on the server.
					navigator.serviceWorker.getRegistration()
					.then(reg => reg.pushManager.subscribe({userVisibleOnly: true}))
					.then(sub => {
						console.log('### Notifications enabled: ', sub);
						AuthUserFactory.createPushNotificationEndpoint(sub);
					})
					.then(response => $mdToast.show(toast))
					.catch(err => $log.debug(err));
				}
			});
			
		};

		AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);
	}

})();
