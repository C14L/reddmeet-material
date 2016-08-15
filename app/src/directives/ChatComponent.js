(function() { 'use strict';

    /**
     * The chat window is independent from the Profile, and can be opened 
     * anywere, for example on the Recent Messages list view.
     * 
     * On mobile, this shows a fullscreen overlay with the chat. 
     * 
     * On desktop, this shows a partial overlay at the bottom of the screen
     * that the user can collapse and expand.
     */

    angular.module('reddmeetApp').component('ChatComponent', {
        bindings: { username: '@' },
        controller: ['AuthUserFactory', ChatComponentController],
        template: '',
    });

    function ChatComponentController(AuthUserFactory) {
        
    }
})();