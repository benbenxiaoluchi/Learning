//#region module definition
var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.controller('myBoardController', ['$scope', '$rootScope', 'harmonizr.methods', function ($scope, $rootScope, methods) {
    // Review elements to show
    $scope.showVideo = !methods.isEmptyOrNull($scope.item.video);
    $scope.showImage = !methods.isEmptyOrNull($scope.item.image);
    $scope.showCard = !$scope.showVideo && !$scope.showImage;
    $scope.showIdentifier = true; // default value
    // Possible actions: Apply
    $scope.showActions = $scope.item.canApply;
            
    // Configurable attributes
    if ($scope.identifier == 'false') {
        $scope.showIdentifier = false;
    }
    $scope.showCommunicator = false;

}]);

cards.directive('accBoard', [function () {
    return {
        restrict: 'EA',
        scope: {
            item: '=',
            tap: '&',
            identifier: '@'
        },
        controller: 'myBoardController',
        templateUrl: 'lib/harmonizr/acc-board/board.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);