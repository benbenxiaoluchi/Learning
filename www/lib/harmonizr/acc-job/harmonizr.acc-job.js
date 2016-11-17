//#region module definition
var cards = null;

try { 
    cards = angular.module('harmonizr.cards');
} 
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.directive('accJob', [function () {
    return {
        restrict: 'EA',
        scope: {
            item: '=',
            identifier: '@'
        },
        controller: function ($scope, $element) {
            function isEmptyOrNull(obj) {
                return (
                (obj === undefined) ||
                (obj === null) ||
                (angular.isString(obj) && (obj === '')) ||      // String
                (angular.isArray(obj) && (obj.length === 0))    // Arrays
                );
            }

            // Review elements to show
            $scope.showVideo = !isEmptyOrNull($scope.item.video);
            $scope.showImage = !isEmptyOrNull($scope.item.image);
            $scope.showCard = !$scope.showVideo && !$scope.showImage;
            $scope.showIdentifier = true; // default value
            // Possible actions: Apply
            $scope.showActions = $scope.item.canApply;
            
            // Configurable attributes
            if ($scope.identifier == 'false') {
                $scope.showIdentifier = false;
            }
            $scope.showCommunicator = false;

            // Check user likes the card
            // ...
        },
        templateUrl: 'lib/harmonizr/acc-job/job.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);
