(function(){ 'use strict';

	angular.module('reddmeetApp')
	.component('srChip', {
		bindings: { name: '@', subscribersHere: '@', subscribers: '@' },
		controller: ['$location', SrChipComponentController],
		template: '<a href="#/r/{{ $ctrl.name }}" title="{{ $ctrl.subscribersHere }} subscribers here" md-ink-ripple>r/{{ $ctrl.name }}</a>'
	});

	function SrChipComponentController($location) {
		return {
		};
	}

})();
