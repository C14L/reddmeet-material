(function(){ 'use strict';

  angular.module('reddmeetApp')
    .controller('MainController', 
      ['$mdDialog', '$mdSidenav', '$mdBottomSheet', '$location', '$log', 
      MainController])

    .controller('ResultsController', 
      ['$log', '$mdDialog', '$mdBottomSheet', '$scope', 'SearchResultsFactory', 
      ResultsController])
    .controller('UpvotesController', ['$log', '$location', '$scope', UpvotesController])
    .controller('VisitsController', ['$log', VisitsController])
    .controller('SrController', ['$log', SrController])
    .controller('DownvotesController', ['$log', DownvotesController])
    .controller('SettingsController', ['$log', SettingsController])
    .controller('ProfileController', ['$log', ProfileController])
    .controller('MapController', ['$log', MapController])
    .controller('StatsController', ['$log', StatsController])

    .controller('SearchOptionGenderDialogController',
        ['$mdDialog', SearchOptionGenderDialogController])
    .controller('SearchOptionDistanceDialogController',
        ['$mdDialog', SearchOptionDistanceDialogController])
    .controller('SearchOptionSubredditsDialogController',
        ['$mdDialog', SearchOptionSubredditsDialogController])
    .controller('SearchOptionOrderDialogController',
        ['$mdDialog', SearchOptionOrderDialogController])
    ;

  /**
   * Display a list of users found with the current search settings.
   */
  function ResultsController($log, $mdDialog, $mdBottomSheet, $scope, SearchResultsFactory) {
    var vm = this;
    vm.title = "search results";
    vm.results = [];
    vm.ts = new Date( ).toISOString( );

    $log.debug('ResultsController called: ' + vm.ts);

    /**
     * Reads the current state of the search settings and fetches
     * new search results from the SearchResults service.
     * 
     * Called every time a search setting is updated, to reflect the
     * new setting in real-time.
     */
    vm.refreshResults = function() {
      SearchResultsFactory.getUserList().then(function(li) {
        vm.results = li;
        $scope.$digest();
      });
    }

    vm.refreshResults(); // First call to populate search results page.

    vm.editSearch = function(ev) {
      $log.debug('ResultsController.editSearch() called!!!');
      $mdDialog.show({
        targetEvent: ev,
        controller: SearchSettingsDialogController,
        controllerAs: 'vmForm',
        templateUrl: '/app/views/search-dialog.html'
      })
      .then(function(answer) {
        console.log('ResultsController got answer: "'+answer+'".');
      }, function() {
        console.log('Event cancled, ResultsController got nada.');
      });
    }

    vm.showSearchOptionGender = function(ev) {
      $mdDialog.show({
        targetEvent: ev,
        templateUrl: '/app/views/search-dialog-gender.html',
        controller: 'SearchOptionGenderDialogController',
        controllerAs: 'vmForm'
      }).then(function(clickedItem) {
        console.log('showSearchOptionGender clickedItem: ' + clickedItem);
      });
    };

    vm.showSearchOptionDistance = function(ev) {
      $mdDialog.show({
        targetEvent: ev,
        templateUrl: '/app/views/search-dialog-distance.html',
        controller: 'SearchOptionDistanceDialogController',
        controllerAs: 'vmForm'
      }).then(function(clickedItem) {
        console.log('showSearchOptionDistance clickedItem: ' + clickedItem);
      });
    };

    vm.showSearchOptionSubreddits = function(ev) {
      $mdDialog.show({
        targetEvent: ev,
        templateUrl: '/app/views/search-dialog-srlist.html',
        controller: 'SearchOptionSubredditsDialogController',
        controllerAs: 'vmForm'
      }).then(function(clickedItem) {
        console.log('showSearchOptionSubreddits clickedItem: ' + clickedItem);
      });
    };

    vm.showSearchOptionOrder = function(ev) {
      $mdDialog.show({
        targetEvent: ev,
        templateUrl: '/app/views/search-dialog-order.html',
        controller: 'SearchOptionOrderDialogController',
        controllerAs: 'vmForm'
      }).then(function(clickedItem) {
        console.log('showSearchOptionOrder clickedItem: ' + clickedItem);
      });
    };

  }

  function SearchOptionGenderDialogController($mdDialog) {
    var vm = this;

    vm.fSexOpts = [
      {id: 1, label: "women who like men"},
      {id: 2, label: "women who like women"},
      {id: 3, label: "women who like queer"},
      {id: 4, label: "men who like women"},
      {id: 5, label: "men who like men"},
      {id: 6, label: "men who like queer"},
      {id: 7, label: "queer who like women"},
      {id: 8, label: "queer who like men"},
      {id: 9, label: "queer who like queer"}];

    vm.hide = function() {
      console.log('SearchOptionGenderDialogController dialog hide.')
      $mdDialog.hide();
    };
    vm.cancel = function() {
      console.log('SearchOptionGenderDialogController dialog cancel.')
      $mdDialog.cancel();
    };
    vm.answer = function(answer) {
      console.log('SearchOptionGenderDialogController dialog returned: "'+answer+'".')
      $mdDialog.hide(answer);
    };
  }

  function SearchOptionDistanceDialogController($mdDialog) {
    var vm = this;

    vm.fDistanceOpts = [
      {id: 5000, label: "5000 km / 3100 miles"},
      {id: 2000, label: "2000 km / 1250 miles"},
      {id: 1000, label: "1000 km / 620 miles" },
      {id:  700, label:  "700 km / 435 miles" },
      {id:  500, label:  "500 km / 310 miles" },
      {id:  300, label:  "300 km / 186 miles" },
      {id:  200, label:  "200 km / 125 miles" },
      {id:  100, label:  "100 km / 62 miles"  },
      {id:   50, label:   "50 km / 31 miles"  },
      {id:   20, label:   "20 km / 12 miles"  }];

    vm.hide = function() {
      console.log('SearchOptionDistanceDialogController dialog hide.')
      $mdDialog.hide();
    };
    vm.cancel = function() {
      console.log('SearchOptionDistanceDialogController dialog cancel.')
      $mdDialog.cancel();
    };
    vm.answer = function(answer) {
      console.log('SearchOptionDistanceDialogController dialog returned: "'+answer+'".')
      $mdDialog.hide(answer);
    };
  }

  function SearchOptionSubredditsDialogController($mdDialog) {
    var vm = this;
    vm.fSrOpts = [{label: "600euro", active: true}, {label: "Arianespace", active: true}, {label: "AskEurope", active: true}, {label: "askscience", active: true}, {label: "AskSocialScience", active: true}, {label: "berlin", active: true}, {label: "bestof", active: true}, {label: "bestofhn", active: true}, {label: "Bitcoin", active: true}, {label: "blackhat", active: true}, {label: "ChineseReddit", active: true}, {label: "Colonizemars", active: true}, {label: "DarwinAwards", active: true}, {label: "dataisbeautiful", active: true}, {label: "datasets", active: true}, {label: "de", active: true}, {label: "DiePartei", active: true}, {label: "diginomads", active: true}, {label: "digitalnomad", active: true}, {label: "educationalgifs", active: true}, {label: "EuropeanFederalists", active: true}, {label: "europeanparliament", active: true}, {label: "europes", active: true}, {label: "FragReddit", active: true}, {label: "france", active: true}, {label: "free_images", active: true}, {label: "FreeTrialsOnline", active: true}, {label: "Futurology", active: true}, {label: "geopolitics", active: true}, {label: "googleearth", active: true}, {label: "hamburg", active: true}, {label: "hwstartups", active: true}, {label: "hybridapps", active: true}, {label: "hyperloop", active: true}, {label: "intdev", active: true}, {label: "InternetIsBeautiful", active: true}, {label: "Inventions", active: true}, {label: "MannausSachsen", active: true}, {label: "MapPorn", active: true}, {label: "mobile", active: true}, {label: "naturstein", active: true}, {label: "NeutralPolitics", active: true}, {label: "NichtDiePartei", active: true}, {label: "nottheonion", active: true}, {label: "OutOfTheLoop", active: true}, {label: "PeaceAndConflict", active: true}, {label: "privacy", active: true}, {label: "redddate", active: true}, {label: "science", active: true}, {label: "selfserve", active: true}, {label: "selinux", active: true}, {label: "socialmediaanalytics", active: true}, {label: "space", active: true}, {label: "Space_Colonization", active: true}, {label: "spacex", active: true}, {label: "talesfromtechsupport", active: true}, {label: "technology", active: true}, {label: "TechNomad", active: true}, {label: "TheoryOfReddit", active: true}, {label: "tinycode", active: true}, {label: "trichotillomania", active: true}, {label: "Trichsters", active: true}, {label: "Unexpected", active: true}, {label: "UsefulWebsites", active: true}, {label: "vpnreviews", active: true}, {label: "WikiLeaks", active: true}, {label: "WorldDevelopment", active: true}, {label: "worldevents", active: true}, {label: "worldnews", active: true}, {label: "worldpolitics", active: true}];

    vm.fSr = vm.fSrOpts; // default select all

    vm.selectAll = function() {
      vm.fSr = vm.fSrOpts;      
    }
    vm.selectNone = function() {
      vm.fSr = [];
    }

    vm.hide = function() {
      console.log('SearchSettingsDialogController dialog hide.')
      $mdDialog.hide();
    };
    vm.cancel = function() {
      console.log('SearchSettingsDialogController dialog cancel.')
      $mdDialog.cancel();
    };
    vm.answer = function(answer) {
      console.log('SearchSettingsDialogController dialog returned: "'+answer+'".')
      $mdDialog.hide(answer);
    };
  }

  function SearchOptionOrderDialogController($mdDialog) {
    var vm = this;

    vm.fOrderOpts = [
      {id: "-sr_count", label: "best matches"},
      {id: "-accessed", label: "recently active"},
      {id: "-date_joined", label: "newest members"},
      {id: "-views_count", label: "most viewed"}];

    vm.hide = function() {
      console.log('SearchOptionOrderDialogController dialog hide.')
      $mdDialog.hide();
    };
    vm.cancel = function() {
      console.log('SearchOptionOrderDialogController dialog cancel.')
      $mdDialog.cancel();
    };
    vm.answer = function(answer) {
      console.log('SearchOptionOrderDialogController dialog returned: "'+answer+'".')
      $mdDialog.hide(answer);
    };
  }


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

    vm.overflowItems = [
      { href: '#/map', 
        title: 'redditors map', 
        icon: 'dashboard' },
      { href: '#/', 
        title: 'reddit mailbox', 
        icon: 'email' },
      { href: '#/upvotes_sent', 
        title: 'upvotes you sent', 
        icon: 'arrow_upward' },
      { href: '#/hidden', 
        title: 'hidden profiles', 
        icon: 'arrow_downward'},
      { href: '#/stats', 
        title: 'site statistics', 
        icon: 'assessment'} ];
    vm.sidebarItems = [
      { href: '#/me/profile', 
        title: 'update profile basics', 
        icon: 'assignment_ind' },
      { href: '#/me/pictures', 
        title: 'update pictures', 
        icon: 'add_a_photo' },
      { href: '#/me/location', 
        title: 'update your location', 
        icon: 'my_location' },
      { href: '#/me/subs', 
        title: 'update your subreddit list', 
        icon: 'playlist_add_check' },
      { href: '#/me/account', 
        title: 'account settings', 
        icon: 'settings' } ];

    function openMenu($mdOpenMenu, ev) {
      var originatorEv = ev;
      $mdOpenMenu(ev);
    };

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