(function() {
    'use strict';

    angular
        .module('app.search')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'search',
                config: {
                    url: '/',
                    templateUrl: 'app/search/search.view.html',
                    controller: 'searchController',
                    controllerAs: 'vm',
                    title: 'search'
                }
            },
            {
                state: 'searchFilter',
                config: {
                    url: '/search/{budgetFrom}-{budgetTo}/{period}-{distance}?{makes}&{fuelTypes}',
                    templateUrl: 'app/search/filter.view.html',
                    controller: 'filterController',
                    controllerAs: 'vm',
                    title: 'search'
                }
            }
        ];
    }
})();
