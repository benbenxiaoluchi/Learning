'use strict';
controllers.controller('menuController', ['$scope', '$rootScope','menuService',
    function ($scope, $rootScope, menuService) {
    $scope.clickImpersonation = function () {
        if ($rootScope.ImpersonateStatus == false) {
            $scope.navigateToState('app.impersonate', null, true);
        } else if ($rootScope.ImpersonateStatus == true) {
            $rootScope.ImpersonateStatus = false;
            $scope.navigateToState('app.trainingDetailTabs.activityTab', {selectedTraining: null, fromMyTraining: null}, true, true);
            //$scope.$emit("ReflashHomePage");
        }
    };

    $scope.facilityInformation = [];
    var defaultFacilityList = [
        {country : "USA", city : "St. Charles"},
        {country : "Malaysia", city : "Kuala Lumpur"},
        {country : "Spain", city : "Madrid"},
        {country : "India", city : "Bengaluru"},
        {country : "United Kingdom", city : "London"},
        {country : "", city : "Dublin"}
    ];

    function getFacilityList() {
        menuService.getFacilityList().then(
            function (result) {
                $scope.facilityInformation = result;
                if(result == [] || result == null){
                    $scope.facilityInformation = defaultFacilityList;
                }
            },
            function () {
                console.log("NO FACILITY DATA");
                $scope.facilityInformation = [{country:"Error",city:"Error"}];
            }
        )
    }

    getFacilityList();
    $rootScope.$on('getFacility',getFacilityList);

}]);// End list controller
