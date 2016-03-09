(function(){

  angular.module('reddmeetApp')
    .controller('MainController', 
      ['$mdDialog', '$mdSidenav', '$mdBottomSheet', '$location', '$log', 
      MainController])

    .controller('ResultsController', ['$log', '$mdDialog', '$mdBottomSheet', ResultsController])
    .controller('UpvotesController', ['$log', '$location', '$scope', UpvotesController])
    .controller('VisitsController', ['$log', ResultsController])
    .controller('SrController', ['$log', SrController])
    .controller('DownvotesController', ['$log', DownvotesController])
    .controller('SettingsController', ['$log', SettingsController])
    .controller('ProfileController', ['$log', ProfileController])
    .controller('MapController', ['$log', MapController])
    .controller('StatsController', ['$log', StatsController])
    ;

  /**
   * Display a list of users found with the current search settings.
   */
  function ResultsController($log, $mdDialog, $mdBottomSheet) {
    var vm = this;
    vm.title = "search results";
    vm.ts = new Date( ).toISOString( );
    vm.editSearch = editSearch;

    $log.debug('ResultsController called: ' + vm.ts);

    function editSearch(ev) {
      $log.debug('ResultsController.editSearch() called!!!');
      $mdDialog.show({
        targetEvent: ev,
        controller: DialogController,
        template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <md-dialog-actions layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </md-dialog-actions></md-dialog>'
      })
      .then(function(answer) {
        vm.alert = 'You said the information was "' + answer + '".';
      }, function() {
        vm.alert = 'You cancelled the dialog.';
      });
    }

    vm.showListBottomSheet = function($event) {
      $mdBottomSheet.show({
        controller: 'ListBottomSheetCtrl',
        targetEvent: $event,

        template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>'

      }).then(function(clickedItem) {
        vm.alert = clickedItem.name + ' clicked!';
      });
    };
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  };

  /**
   * Display three tabs with "upvotes received", "upvote matches", "upvotes sent".
   */
  function UpvotesController($log, $location, $scope) {
    var vm = this;
    vm.tabs = {selectedIndex:1};
    vm.title = "upvotes inbox / matches / upvotes sent";
    vm.ts = new Date( ).toISOString( );

    $log.debug('UpvotesController called: ' + vm.ts);
  }


  /**
   * Display two tabs with "viewed me" and "recently viewed".
   */
  function VisitsController($log) {
    var vm = this;
    vm.title = "viewed me / recently viewed";
    vm.ts = new Date( ).toISOString( );

    $log.debug('VisitsController called: ' + vm.ts);
  }


  /**
   * Display a subreddit's user list.
   */
  function SrController($log) {
    var vm = this;
    vm.title = "subreddit";
    vm.ts = new Date( ).toISOString( );

    $log.debug('SrController called: ' + vm.ts);
  }


  /**
   * Display a list of users downvoted by authuser.
   */
  function DownvotesController($log) {
    var vm = this;
    vm.title = "hidden";
    vm.ts = new Date( ).toISOString( );

    $log.debug('DownvotesController called: ' + vm.ts);
  }

  /**
   * Display an account settings page.
   */
  function SettingsController($log) {
    var vm = this;
    vm.title = "account settings";
    vm.ts = new Date( ).toISOString( );

    $log.debug('SettingsController called: ' + vm.ts);
  }


  /**
   * Display a user profile page. If its authuser's own page, 
   * add "edit" buttons to different parts, and have popups
   * with forms to change the values.
   */
  function ProfileController($log) {
    var vm = this;
    vm.title = "profile for username";
    vm.ts = new Date( ).toISOString( );

    $log.debug('ProfileController called: ' + vm.ts);
  }


  /**
   * Display a page with users on a map.
   */
  function MapController($log) {
    var vm = this;
    vm.title = "user map";
    vm.ts = new Date( ).toISOString( );

    $log.debug('MapController called: ' + vm.ts);
  }


  /**
   * Display a page with some site statistics.
   */
  function StatsController($log) {
    var vm = this;
    vm.somename = "BLAAAAAH";
    vm.ts = new Date( ).toISOString( );

    $log.debug('StatsController called: ' + vm.ts);
  }


  /**
   * Control most of the app logig that happens independently of the current view.
   */
  function MainController($mdDialog, $mdSidenav, $mdBottomSheet, $location, $log) {
    var vm = this;
    
    vm.userLogout = userLogout;
    vm.toggleSidebar = toggleSidebar;
    vm.openMenu = openMenu;

    vm.selected     = null;
    vm.users        = [ ];
    vm.selectUser   = selectUser;
    vm.makeContact  = makeContact;

    function toggleSidebar() {
      $mdSidenav('left').toggle();
    };

    vm.sidebarItems = [
      {href: '#/map', title: 'redditors map', icon: 'dashboard'},
      {href: '#/', title: 'reddit mailbox', icon: 'email'},
      {href: '#/upvotes_sent', title: 'upvotes you sent', icon: 'arrow_upward'},
      {href: '#/hidden', title: 'hidden profiles', icon: 'arrow_downward'}];

    function openMenu($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    function userLogout() {
      $log.debug('Would now logout user.');
    }

    function selectUser(user) {
      vm.selected = angular.isNumber(user) ? $scope.users[user] : user;
    }

    function makeContact(selectedUser) {
      $mdBottomSheet.show({
        controllerAs  : "cp",
        templateUrl   : './src/users/view/contactSheet.html',
        controller    : [ '$mdBottomSheet', ContactSheetController],
        parent        : angular.element(document.getElementById('content'))
      }).then(function(clickedItem) {
        $log.debug( clickedItem.name + ' clicked!');
      });

      /**
       * User ContactSheet controller
       */
      function ContactSheetController( $mdBottomSheet ) {
        this.user = selectedUser;
        this.actions = [
          { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
          { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
          { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
          { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
        ];
        this.contactUser = function(action) {
          // The actually contact process has not been implemented...
          // so just hide the bottomSheet

          $mdBottomSheet.hide(action);
        };
      }
    }
  }

})();