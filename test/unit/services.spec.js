'use strict';

describe('Test reddmeetApp', function () {
    beforeEach(module('reddmeetApp'));

    describe('Factory', function () {

        describe('UserFactory', function () {
            let $httpBackend, AuthUserFactory, UserFactory;
            let apiUrlAuthUser = API_BASE + '/api/v1/authuser.json';
            let apiUrlViewUser = API_BASE + '/api/v1/u/Testing.json';
            
            beforeEach(inject(function ($injector) {
                $httpBackend = $injector.get('$httpBackend');
                AuthUserFactory = $injector.get('AuthUserFactory');
                UserFactory = $injector.get('UserFactory');
            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('loads and returns a user profile', function() {
                $httpBackend.when('GET', apiUrlAuthUser).respond(200, 'AuthUser Item');
                $httpBackend.when('GET', apiUrlViewUser).respond(200, 'ViewUser Item');
                UserFactory.getViewUser('Testing').then(response => expect(response).toBe('ViewUser Item'));
                $httpBackend.flush();
            });
        });

        describe('SearchResultsFactory', function () {
            let $httpBackend, AuthUserFactory, SearchResultsFactory;
            let apiUrlAuthUser = API_BASE + '/api/v1/authuser.json';
            let apiUrlResults = API_BASE + '/api/v1/results?page=1&f_sex=0&f_distance=0&order_by=-sr_count';

            beforeEach(inject(function ($injector) {
                $httpBackend = $injector.get('$httpBackend');
                AuthUserFactory = $injector.get('AuthUserFactory');
                SearchResultsFactory = $injector.get('SearchResultsFactory');
                
                $httpBackend.when('GET', apiUrlAuthUser).respond(200, {data: {}});
            }));

            afterEach(function() {
                $httpBackend.flush();

                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('sets search params correctly', function() {
                SearchResultsFactory.setSearchParam('f_sex', '4');
                SearchResultsFactory.setSearchParam('f_distance', '1000');
                SearchResultsFactory.setSearchParam('order_by', '-sr_count');

                expect(SearchResultsFactory.getSearchParam('f_sex')).toBe('4');
                expect(SearchResultsFactory.getSearchParam('f_distance')).toBe('1000');
                expect(SearchResultsFactory.getSearchParam('order_by')).toBe('-sr_count');
            });

            it('builds search params string correctly', function() {
                SearchResultsFactory.setSearchParam('f_sex', '4');
                SearchResultsFactory.setSearchParam('f_distance', '1000');
                SearchResultsFactory.setSearchParam('order_by', '-sr_count');

                let expected = 'f_sex=4&f_distance=1000&order_by=-sr_count';
                expect(SearchResultsFactory.getSearchParamsString()).toBe(expected);
            });

            it('loads a list of user objects', function() {
                $httpBackend.when('GET', apiUrlResults).respond(200, { user_list: 'UserList Item' });
                SearchResultsFactory.getUserList().then(response => expect(response[0]).toBe('UserList Item'));
            });
        });

    });
});
