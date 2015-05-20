(function() {
    'use strict';

    angular
        .module('app.favorites')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'favorites',
                config: {
                    url: '/favorites',
                    templateUrl: 'app/favorites/favorites.view.html',
                    controller: 'favoritesController',
                    controllerAs: 'vm',
                    title: 'favorites'
                }
            }
        ];
    }
})();
