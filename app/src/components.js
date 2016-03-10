(function(){ 'use strict';

	angular.module('reddmeetApp').component('userListCard', {
		templateUrl: '/app/views/component-user-list-card.html',
		bindings: { username: '@', age: '@', gender: '@', distance: '@', imgUrl: '@' },
		controller: UserListCardComponentController,
	});

	function UserListCardComponentController() {
		return {
			transitionToProfile: function(event) {
				/* Find the clicked card object's image and animate if from its 
				   original position and size to its position on the user's profile
				   page. Careful: profiles are resonsive! On small screens, animate
				   to the top and fill entire width. On larger screens, animate to 
				   the top right side of the (not yet existing) profile container. */
				var target = angular.element(event.target);
				var orig = target.parents('md-card').find('img');
				var start = orig.offset();
				var img = orig.clone();
  			$('body').prepend(img);
  			img.css({
  				zIndex: "2001",
  				position: "fixed",
			    top: start.top,
			    left: start.left,
			    width: "150px",
			    height: "150px",
  			}).animate({
			    top: 56,
			    left: 0,
			    width: "100vw",
			    height: "100vw",
			  }, 300, function() {
			  	setTimeout(function(){ img.remove(); }, 500);
			  });

			}
		};
	}

})();
