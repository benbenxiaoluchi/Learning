//#region module definition
var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.controller('myArticleController', ['$scope', '$rootScope', '$sce', 'harmonizr.methods', function ($scope, $rootScope, $sce, methods) {
    $scope.article = $scope.item;

    //#region Like
    // Check user likes the card
    $scope.isLikeActive = false;
    if (!methods.isEmptyOrNull($scope.article.social) && !methods.isEmptyOrNull($scope.article.social.like)) {
        $scope.isLikeActive = methods.inArray('peopleKey', $scope.article.social.like, $scope.peopleKey) >= 0;
    }
    $scope.addLikes = function () {
        if ($scope.isLikeActive) {
            // remove from array
            var position = methods.inArray('peopleKey', $scope.article.social.like, $scope.peopleKey);
            if (position >= 0) {
                $scope.article.social.like.splice(position, 1);
                $scope.isLikeActive = false;
            }
        }
        else {
            // Add to array
            $scope.article.social.like.push({ "date": new Date(), "peopleKey": $scope.peopleKey });
            $scope.isLikeActive = true;
        }
    };
    //#endregion

    //#region Comments
    for (var c = 0; c < $scope.article.Comments.length; c++) {
        $scope.article.Comments[c].isOwner = $scope.article.Comments[c].ownerPeopleKey == $scope.peopleKey;
    }
    $scope.showComments = function () {
        var data = {
            source: 'article',
            comments: $scope.article.Comments,
            id: $scope.article.eventID
        };
        $rootScope.$broadcast('showComments', data);
    };
    $scope.$on('addCommentArticle', function (event, args) {
        if (args.id == $scope.article.eventID) {
            var comment = {};
            comment.date = new Date();
            comment.ownerPeopleKey = $scope.peopleKey;
            comment.bodyMarkup = args.comment;
            comment.isOwner = true;

            $scope.article.Comments.push(comment);
        }
    });
    //#endregion

    //#region Safe HTML
    $scope.article.bodyMarkupTrusted = $sce.trustAsHtml($scope.article.bodyMarkup);
    //#endregion
}]);


cards.directive('accArticle', [function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            enterpriseId: '@',
            peopleKey: '@',
            tap: '&'
        },
        controller: 'myArticleController',
        templateUrl: 'lib/harmonizr/acc-article/article.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);