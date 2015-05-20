(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('filterController', FilterController);

    FilterController.$inject = [
        '$scope',
        '$q',
        '$stateParams',
        '$state',
        '$sessionStorage',
        '$document',
        '$',
        'searchService',
        'dataService',
        'logger'
    ];
    /* @ngInject */
    function FilterController(
        $scope,
        $q,
        $stateParams,
        $state,
        $sessionStorage,
        $document,
        $,
        searchService,
        dataService,
        logger) {
        var vm = this;

        initializeViewModel();
        activate();

        function initializeViewModel() {
            vm.isBusy = true;

            if ($sessionStorage.favorites === undefined) {
                $sessionStorage.favorites = [];
            }
            vm.favorites = $sessionStorage.favorites;
            vm.isFavorite = isFavorite;
            vm.goToFavorites = goToFavorites;
            vm.toggleFavorite = toggleFavorite;

            vm.criteria = {
                budgetFrom: $stateParams.budgetFrom,
                budgetTo: $stateParams.budgetTo,
                period: $stateParams.period,
                distance: $stateParams.distance
            };

            vm.getResults = getResults;
            vm.results = [];

            vm.paging = {
                currentNr: 1
            };
            vm.pagePrevious = pagePrevious;
            vm.pageNext = pageNext;

            vm.facets = {
                fuelTypes: [],
                makes: []
            };
            vm.showAllFacets = {
                makes: false,
                fuelTypes: false
            };
            vm.updateFacets = updateFacets;
            vm.makesFacetFilter = makesFacetFilter;
            vm.fuelTypesFacetFilter = fuelTypesFacetFilter;
            vm.toggleMakesFilter = toggleMakesFilter;
            vm.toggleFuelTypesFilter = toggleFuelTypesFilter;
            vm.selectedMakes = [];
            vm.selectedFuelTypes = [];
            if ($stateParams.makes !== undefined) {
                vm.selectedMakes = $stateParams.makes.split(',');
            }
            if ($stateParams.fuelTypes !== undefined) {
                vm.selectedFuelTypes = $stateParams.fuelTypes.split(',');
            }

            vm.expanderClass = expanderClass;
            vm.fuelTypesExpandable = true;
            vm.makesExpandable = true;
        }

        function fuelTypesFacetFilter(facet) {
            if (vm.showAllFacets.fuelTypes) {
                return true;
            }

            return _.contains(vm.selectedFuelTypes, facet.id);
        }

        function makesFacetFilter(facet) {
            if (vm.showAllFacets.makes) {
                return true;
            }
            return _.contains(vm.selectedMakes, facet.id);
        }

        function registerWatches() {
            $scope.$watchCollection('vm.selectedFuelTypes', function (newValue, oldValue) {
                vm.fuelTypesExpandable =
                    (newValue.length < vm.facets.fuelTypes.length) || (vm.facets.fuelTypes.length === 0);
            });

            $scope.$watchCollection('vm.selectedMakes', function (newValue, oldValue) {
                vm.makesExpandable = (newValue.length < vm.facets.makes.length) || (vm.facets.makes.length === 0);
            });
        }

        function updateFacets(facetType) {
            vm.getResults(facetType);
        }

        function expanderClass(expanded, selectionArray) {

            if (expanded) {
                return 'fa-chevron-up';
            }
            else if (selectionArray.length === 0) {
                return 'fa-plus';
            }
            else {
                return 'fa-chevron-down';
            }
        }

        function toggleMakesFilter() {
            vm.showAllFacets.makes = !vm.showAllFacets.makes;
        }
        function toggleFuelTypesFilter() {
            vm.showAllFacets.fuelTypes = !vm.showAllFacets.fuelTypes;
        }

        //vm.removeFilter = removeFilter;

        //vm.modifyMakeFilter = modifyMakeFilter;
        //vm.modifyFuelTypeFilter = modifyFuelTypeFilter;

        //vm.hideDialog = hideDialog;

        function goToFavorites() {
            $state.go('favorites');
        }

        function pulseFavoritesButton() {
            setTimeout(function () {
                $('#btnFavorites').removeClass('pulse');
            }, 1000);
            $('#btnFavorites').addClass('pulse');
        }

        function toggleFavorite(item) {
            if (isFavorite(item.id)) {
                var favoriteItem = _.find(vm.favorites, function (favorite) {
                    return favorite.id === item.id;
                });
                var index = vm.favorites.indexOf(favoriteItem);
                vm.favorites.splice(index, 1);
            }
            else {
                dataService.getVehicle(item.id, vm.criteria.period, vm.criteria.distance)
                           .then(function (data) {
                               vm.favorites.push(data);
                               //$sessionStorage.favorites.push(item);
                               pulseFavoritesButton();
                           });

            }
        }

        function isFavorite(id) {
            return _.contains(_.toArray(_.pluck(vm.favorites, 'id')), id);
        }

        function activate() {
            var promises = [getResults('activate')];
            return $q.all(promises).then(function () {
                logger.info('Activated Filter View');
            });
        }

        function pagePrevious() {
            vm.paging.currentNr--;
            getResults();
        }
        function pageNext() {
            vm.paging.currentNr++;
            getResults();
        }

        function removeFilter(filter) {
            filter.checked = false;
        }

        function tickFilters() {

            if ($stateParams.makes) {
                setFilterValues(vm.facets.makes, $stateParams.makes.split(','), vm.selectedMakes);
            }

            if ($stateParams.fuelTypes) {

                setFilterValues(vm.facets.fuelTypes, $stateParams.fuelTypes.split(','), vm.selectedFuelTypes);
            }

        }

        function setFilterValues(items, ids, selectCollection) {
            _.each(ids, function (id) {
                var filter = _.find(items, function (item) {
                    return item.id === id;
                });

                if (filter) {
                    filter.selected = true;
                }

            });
        }

        function getResults(source) {
            vm.isBusy = true;

            var selectedMakes = _.toArray(_.pluck(_.filter(vm.facets.makes, function (make) {
                return make.selected;
            }), 'id'));

            var query = {
                amountFrom: vm.criteria.budgetFrom,
                amountTo: vm.criteria.budgetTo,
                pageNr: vm.paging.currentNr,
                makes: vm.selectedMakes.join(),
                fuelTypes: vm.selectedFuelTypes.join()
            };

            return searchService.getResults(query).then(function (data) {

                switch (source) {
                    case 'activate':
                        vm.facets = data.facets;
                        break;
                    case 'makes':
                        vm.facets.fuelTypes = data.facets.fuelTypes;
                        break;
                    case 'fuelTypes':
                        vm.facets.makes = data.facets.makes;
                        break;
                    default:
                }

                vm.results = data.results;
                vm.totalResults = data.totalResults;
                vm.paging = data.paging;

                tickFilters();

                vm.isBusy = false;

                scrollTo(0, 0);
                return vm.facets;
            });
        }
    }
})();
