//#region module definition
var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.controller('myLearningActivityController', ['$scope', '$rootScope', 'harmonizr.methods', function ($scope, $rootScope, methods) {
}]);

cards.directive('accLearningActivity', [function () {
    return {
        restrict: 'EA',
        scope: {
            item: '=',
            tap: '&',
            identifier: '@'
        },
        controller: 'myLearningActivityController',
        templateUrl: 'lib/harmonizr/acc-learning-activity/learning-activity.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);