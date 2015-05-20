(function () {
    'use strict';

    angular
        .module('app.favorites')
        .controller('favoritesController', FavoritesController);

    FavoritesController.$inject = ['$q', '$state', '$sessionStorage', 'logger'];
    /* @ngInject */
    function FavoritesController($q, $state, $sessionStorage, logger) {
        var vm = this;
        vm.favorites = $sessionStorage.favorites;
        activate();

        function activate() {
            var promises = [];
            return $q.all(promises).then(function () {
                logger.info('Activated Favorites View');
            });

        }

    }
})();
