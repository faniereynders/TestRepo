(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataService', DataService);

    DataService.$inject = ['$http', '$q', 'logger', 'config'];
    /* @ngInject */
    function DataService($http, $q, logger, config) {
        var baseUri = config.api.baseUri;
        var service = {
            getVehicle: getVehicle,
            //getMessageCount: getMessageCount
        };

        return service;

        //function getMessageCount() { return $q.when(72); }

        function getVehicle(id, period, distance) {
            return $http.get(baseUri + '/api/vehicles/' + id + '/' + period + '-' + distance)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                var msg = 'query for vehciles failed. ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            }
        }
    }
})();
