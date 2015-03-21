angular.module('grillApp')
    .controller('AvailableModalController', ['$log', '$scope', '$modalInstance', function ($log, $scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close("ok");
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };

        $log.info('AvailableModalController booted successfully');
    }]);