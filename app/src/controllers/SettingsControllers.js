(function(){ 'use strict';

	angular.module('reddmeetApp')

		.controller('SettingsProfileController', ['$log', '$mdDialog', '$mdMedia', '$mdpDatePicker', 'AuthUserFactory', SettingsProfileController])

		.controller('SettingsPicturesController', ['$log', '$scope', '$http', 'AuthUserFactory',SettingsPicturesController])

		.controller('SettingsLocationController', ['$log', '$timeout', '$mdToast', 'AuthUserFactory', SettingsLocationController])

		.controller('SettingsSubredditsController', ['$rootScope', '$log', '$timeout', '$mdToast', 'AuthUserFactory', 'WsFactory', SettingsSubredditsController])

		.controller('SettingsAccountController', ['$log', '$mdToast', 'AuthUserFactory', SettingsAccountController])
		;

	function SettingsProfileController($log, $mdDialog, $mdMedia, $mdpDatePicker, AuthUserFactory) {
		var vm = this;
		vm.ts = new Date( ).toISOString( );

		AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);

		vm.open = (field, event) => {
			console.log(field, event);

			if (field == 'gender') {
				$mdDialog.show({
					targetEvent: event,
					templateUrl: 'views/search-dialog-gender.html',
					controller: 'SearchOptionGenderDialogController',
					controllerAs: 'vmForm'
				}).then(li => {
					console.log('showSearchOptionGender selected: ', li);
				});
			}
			if (field == 'herefor') {
				$mdDialog.show({
					targetEvent: event,
					templateUrl: 'views/select-dialog-herefor.html',
					controller: 'HereForSelectDialogController',
					controllerAs: 'vmForm'
				}).then(li => {
					console.log('selected: ', li);
				});
			}
			if (field == 'dob') {
				let currentDate = new Date(vm.authuser.profile.dob);
				$mdpDatePicker(currentDate, {
					targetEvent: event,
				}).then(sel => {
					vm.authuser.profile.dob = new Date(sel).toISOString().split('T')[0];
					AuthUserFactory.setProfile('dob', vm.authuser.profile.dob);
					AuthUserFactory.saveProfile('dob');
				});
			}
			if (field == 'about') {
				$mdDialog.show({
					controller: 'AboutSettingsDialogController',
					controllerAs: 'vmDialog',
					templateUrl: 'views/settings-dialog-about.html',
					locals: { about: vm.authuser.profile.about || '' },
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose: false,
					fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
				}).then(about => {
					if (vm.authuser.profile.about != about) { // only if changed.
						vm.authuser.profile.about = about;
						AuthUserFactory.setProfile('about', about);
						AuthUserFactory.saveProfile('about');
					}
				});
			}
		}
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

	function SettingsSubredditsController($rootScope, $log, $timeout, $mdToast, AuthUserFactory, WsFactory) {
		var vm = this;
		vm.authuser = null;
		vm.showBtn = true;
		vm.showSpinner = false;
		vm.showSmallSpinner = false;

		vm.toastUpdated = () => $mdToast.show($mdToast.simple()
			.textContent('Subreddit list updated.').position('bottom').hideDelay(800));
		vm.toastSaved = () => $mdToast.show($mdToast.simple()
			.textContent('Selection saved.').position('bottom').hideDelay(800));

		AuthUserFactory.getAuthUser().then(obj => vm.authuser = obj);

		/**
		 * Observe "vm.authuser.subs" and send only the updated subs item to the
		 * server via WebSocket. No response expected, because the correct state
		 * is already on the client.
		 */
		vm.toggleFavorite = (sub, event) => {
			sub.is_favorite = !sub.is_favorite;
            WsFactory.send({ 'action': 'authuser.sub', 'sub': JSON.stringify(sub) });
		};

		/**
		 * That sets the data on the main authuser model, sends it to the server,
		 * and then broadcasts a change in authuser profile, so that all subscribed
		 * active scopes (mainly just "mainctrl") can get a fresh copy.
		 */
        vm.selectAll = () => {
            WsFactory.send({ 'action': 'authuser.sub', '__all__': true });
			vm.authuser.subs.forEach(obj => obj.is_favorite = true);
			$rootScope.$broadcast('authuser:profile_change', null);
		};

        vm.selectNone = () => {
            WsFactory.send({ 'action': 'authuser.sub', '__all__': false });
			vm.authuser.subs.forEach(obj => obj.is_favorite = false);
			$rootScope.$broadcast('authuser:profile_change', null);
		};

		/**
		 * Persist deactivated selection.
		 */
		vm.save = () => {
			vm.showSmallSpinner = true;
			AuthUserFactory.subsSaveFavorites(vm.authuser.subs).then(() => {
				vm.showSmallSpinner = false;
				vm.toastSaved();
			});
		}

		vm.update = () => {
			vm.showBtn = false;
			vm.showSpinner = true;
			AuthUserFactory.subsUpdateFromReddit().then(() => {
				vm.showSpinner = false;
				vm.toastUpdated();
				// Wait a bit before the user can press the button again.
				$timeout(() => { vm.showBtn = true; }, 1000);
			});
		};
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
