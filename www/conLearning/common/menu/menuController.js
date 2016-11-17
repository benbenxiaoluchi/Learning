'use strict';
controllers.controller('menuController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.clickImpersonation = function () {
        if ($rootScope.ImpersonateStatus == false) {
            $scope.navigateToState('app.impersonate', null, true);
        } else if ($rootScope.ImpersonateStatus == true) {
            $rootScope.ImpersonateStatus = false;
            $scope.navigateToState('app.trainingDetailTabs.activityTab', {selectedTraining: null, fromMyTraining: null}, true, true);
            //$scope.$emit("ReflashHomePage");
        }
    };

}]);// End list controller
