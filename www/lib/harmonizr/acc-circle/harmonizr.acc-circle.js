//#region module definition
var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.controller('myCircleController', ['$scope', '$rootScope', '$sce', 'harmonizr.methods', function ($scope, $rootScope, $sce, methods) {
    $scope.circle = $scope.item;

    //#region Like
    // Check user likes the card
    $scope.isLikeActive = false;
    if (!methods.isEmptyOrNull($scope.circle.social) && !methods.isEmptyOrNull($scope.circle.social.like)) {
        $scope.isLikeActive = methods.inArray('peopleKey', $scope.circle.social.like, $scope.peopleKey) >= 0;
    }
    $scope.addLikes = function () {
        if ($scope.isLikeActive) {
            // remove from array
            var position = methods.inArray('peopleKey', $scope.circle.social.like, $scope.peopleKey);
            if (position >= 0) {
                $scope.circle.social.like.splice(position, 1);
                $scope.isLikeActive = false;
            }
        }
        else {
            // Add to array
            $scope.circle.social.like.push({ "date": new Date(), "peopleKey": $scope.peopleKey });
            $scope.isLikeActive = true;
        }
    };
    //#endregion

    //#region Comments
    for (var c = 0; c < $scope.circle.social.comments.length; c++) {
        $scope.circle.social.comments[c].isOwner = $scope.circle.social.comments[c].peopleKey == $scope.peopleKey;
    }
    $scope.showComments = function () {
        var data = {
            source: 'circle',
            comments: $scope.circle.social.comments,
            id: $scope.circle.id
        };
        $rootScope.$broadcast('showComments', data);
    };
    $scope.$on('addCommentCircle', function (event, args) {
        if (args.id == $scope.circle.id) {
            var comment = {};
            comment.date = new Date();
            comment.peopleKey = $scope.peopleKey;
            comment.comment = args.comment;
            comment.isOwner = true;

            $scope.circle.social.comments.push(comment);
        }
    });
    //#endregion
}]);


cards.directive('accCircle', [function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            enterpriseId: '@',
            peopleKey: '@',
            tap: '&'
        },
        controller: 'myCircleController',
        templateUrl: 'lib/harmonizr/acc-circle/circle.card.template.html',
        link: function (scope, element, attrs) {

        }
    };
}]);