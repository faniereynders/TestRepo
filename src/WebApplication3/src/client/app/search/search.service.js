(function () {
    'use strict';

    angular
        .module('app.search')
        .factory('searchService', SearchService);

    SearchService.$inject = ['$http', '$q', 'logger', 'config'];
    /* @ngInject */
    function SearchService($http, $q, logger, config) {
        var baseUri = config.api.baseUri;

        var service = {
            getFacets: getFacets,
            getResults: getResults
        };

        return service;

        function getFacets() {
            return $http.get(baseUri + '/api/search/facets')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                var msg = 'query for facets failed. ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            }
        }

        function getResults(query) {
            return $http.get(baseUri + '/api/search',
                {
                    params: query
                })
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                var msg = 'query for facets failed. ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            }
        }

    }
})();
