(function(){
  'use strict';

  angular.module('reddmeetApp')
    .service('userService', ['$q', UserService]);



  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function UserService($q){
    var users = [
      {
        username: 'yaix',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'svg-1', }],
          age: '38',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '43.2 km',
        flags: []
      },

      {
        username: 'nucu2',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/TKAKLKEm.jpg', }],
          age: '23',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '194.3 km',
        flags: []
      },

      {
        username: 'funkypigeon321',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/jIMZMS2m.jpg', }],
          age: '18',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '777.7 km',
        flags: []
      },

      {
        username: 'Fishfingers87',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/N14toSbm.jpg', }],
          age: '29',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '401.8 km',
        flags: []
      },

      {
        username: 'SecondBestNameEver',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/8GzloGym.jpg', }],
          age: '24',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '6814.6 km',
        flags: []
      },

      {
        username: 'JoetheGrim',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/BqjIVbjm.jpg', }],
          age: '24',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '1097.3 km',
        flags: []
      },

      {
        username: 'robotomato13',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://scontent-sin1-1.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/11351303_10155519377830251_1716962210078739261_n.jpg?oh=e14b94675326dd34fa357588aaba6e7e&amp;oe=576DEFC6', }],
          age: '31',
          sex_symbol: '♀♥♂',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '11040.3 km',
        flags: ['like-recv']
      },

      {
        username: 'The_Bear1',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/VqLMjlAm.jpg', }],
          age: '23',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '6219.8 km',
        flags: []
      },

      {
        username: 'obviousdisposable',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/Yp7e2yvm.jpg', }],
          age: '29',
          sex_symbol: '♂♥♂',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '8899.6 km',
        flags: []
      },

      {
        username: 'MartyrB93',
        is_staff: 0,
        is_superuser: 0,
        is_active: 1,
        profile: {
          pics: [{url: 'https://i.imgur.com/pVuamqHm.jpg', }],
          age: '22',
          sex_symbol: '♂♥♀',
          about: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        distance: '16217.8 km',
        flags: []
      },

    ];

    // Promise-based API
    return {
      loadAllUsers : function() {
        // Simulate async nature of real remote calls
        return $q.when(users);
      }
    };
  }

})();
