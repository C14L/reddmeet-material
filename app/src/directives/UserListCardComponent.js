(function(){ 'use strict';

	angular.module('reddmeetApp')
	.component('userListCard', {
		bindings: { username: '@', age: '@', gender: '@', distance: '@' },
		controller: ['$location', UserListCardComponentController],
		templateUrl: '/app/views/component-user-list-card.html',
	});

	function UserListCardComponentController($location) {
		return {
			transitionToProfile: function(event) {
				/* Find the clicked card object's image and animate if from its 
				   original position and size to its position on the user's profile
				   page. Profiles are responsive! On small screens, animate
				   to the top and fill entire width. On larger screens, animate to 
				   the top right side of the (not yet existing) profile container. */
				var vw = $('body').width();
				var vh = $('body').height();

				var card = angular.element(event.target).parents('md-card');
				var orig = card.find('img');
				var start = orig.offset();
				var img = orig.clone();

				var animInit = { zIndex: "901", width: "150px", height: "150px", position: "fixed", top: start.top, left: start.left, willChange: "transform,opacity" };
				// unused -- var animCoverInit = { backgroundColor: 'white', width: '100vw', height: '100vh', position: 'fixed', top: '100vh', left: '0', zIndex: '900', opacity: '1', borderTop: '56px solid transparent', 'boxSizing': 'border-box' };

				var animTarget = { top: "56px", left: 0, width: "100vw", height: "100vw" };
				// unused -- var animCoverTarget = { top: '100vw', opacity: 1 };
				if (vw > 600) {
					animTarget = { width: "300px", height: "300px", top: "106px", left: ((vw/2)-400) };
					// unused -- animCoverTarget.top = "56px";
				}

				// User imiage moves from orig position in user list to its final 
				// position on user's profile page.
				$('body').prepend(img);
				orig.css({ opacity: "0.1" });
				img.css(animInit).animate(animTarget, 300, 'swing', function() { orig.css({ opacity: "1" }); });

				// The cover slides up from below to cover the background user list.
				//var cover = $('<div></div>');
				//cover.css(animCoverInit);
				//$('body').prepend(cover);
				//cover.animate(animCoverTarget, 400, 'swing', function(){ });

				// Select by this class to remove elements once profile is loaded.
				img.addClass("transition-helper");
				//cover.addClass("profile-transition-helper");

				// Navigate to profile page.
				$location.url(card.attr("href"));
			}
		};
	}

})();
