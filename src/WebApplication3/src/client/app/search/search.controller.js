(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('searchController', SearchController);

    SearchController.$inject = ['$q', '$state', '$', 'searchService', 'logger'];
    /* @ngInject */
    function SearchController($q, $state, $, searchService, logger) {
        var vm = this;
        vm.title = 'Dashboard';
        vm.facets = [];
        vm.selectedMakes = [];
        vm.selectedFuelTypes = [];

        vm.criteria = {
            budget: [100, 3000],
            period: 12,
            distance: 30000
        };
        vm.moreFilters = false;
        vm.showResults = showResults;
        vm.totalResultsString = function () {
            if (vm.totalResults === 1) {
                return vm.totalResults + ' result';
            }
            else {
                return vm.totalResults + ' results';
            }
        };

        vm.setFacet = function (facet, value) {
            facet.selected = value;
        };

        vm.getFacets = getFacets;

        //vm.onSliderChange = function (value, event) {
        //    getFacets();
        //}

        vm.greaterThan = function (prop, val) {
            return function (item) {
                return item[prop] > val;
            };
        };

        angular.element(document).ready(function () {
            $('.tooltipped').tooltip({
                delay: 50
            });
        });

        activate();

        function activate() {
            var promises = [getFacets()];
            return $q.all(promises).then(function () {
                logger.info('Activated Dashboard View');
            });

        }
        function showResults() {
            var fuelTypes = _.pluck(_.filter(vm.facets.fuelTypes, function (item) {
                return item.checked;
            }), 'id').join();

            var params = {
                budgetFrom: vm.criteria.budget[0],
                budgetTo: vm.criteria.budget[1],
                period: vm.criteria.period,
                distance: vm.criteria.distance,
                makes: vm.selectedMakes.join(),
                fuelTypes: vm.selectedFuelTypes.join()
            };

            $state.go('searchFilter', params);
            // $state.transitionTo('search.filter');
        }

        function getFacets(source) {
            var query = {
                amountFrom: vm.criteria.budget[0],
                amountTo: vm.criteria.budget[1],
                period: vm.criteria.period,
                distance: vm.criteria.distance,
                pageNr: 1,
                makes: vm.selectedMakes.join(),
                fuelTypes: vm.selectedFuelTypes.join()
            };

            return searchService.getResults(query).then(function (data) {

                if (source === undefined) {
                    vm.facets = data.facets;
                }
                else {
                    if (source === 'makes') {
                        vm.facets.fuelTypes = data.facets.fuelTypes;

                    }
                    else if (source === 'fuelTypes') {
                        vm.facets.makes = data.facets.makes;
                    }
                }

                vm.totalResults = data.totalResults;
                return vm.facets;
            });
        }

    }
})();
