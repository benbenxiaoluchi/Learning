//#region module definition
var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.directive('accPeople', [function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            enterpriseId: '@',
            peopleKey: '@',
            tap: '&'
        },
        controller: function ($scope, $element) {
        },
        templateUrl: 'lib/harmonizr/acc-people/people.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);