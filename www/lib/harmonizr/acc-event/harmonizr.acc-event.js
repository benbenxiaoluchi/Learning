//#region module definition
var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.controller('myEventController', ['$scope', '$rootScope', '$sce', '$window', 'harmonizr.methods', function ($scope, $rootScope, $sce, $window, methods) {
    //#region Like
    // Check user likes the card
    $scope.isLikeActive = false;
    if (!methods.isEmptyOrNull($scope.item.social) && !methods.isEmptyOrNull($scope.item.social.like)) {
        $scope.isLikeActive = methods.inArray('peopleKey', $scope.item.social.like, $scope.peopleKey) >= 0;
    }
    $scope.addLikes = function () {
        if ($scope.isLikeActive) {
            // remove from array
            var position = methods.inArray('peopleKey', $scope.item.social.like, $scope.peopleKey);
            if (position >= 0) {
                $scope.item.social.like.splice(position, 1);
                $scope.isLikeActive = false;
            }
        }
        else {
            // Add to array
            $scope.item.social.like.push({ "date": new Date(), "peopleKey": $scope.peopleKey });
            $scope.isLikeActive = true;
        }
    };
    //#endregion

    //#region Comments
    for (var c = 0; c < $scope.item.social.comments.length; c++) {
        $scope.item.social.comments[c].isOwner = $scope.item.social.comments[c].peopleKey == $scope.peopleKey;
    }
    $scope.showComments = function () {
        var data = {
            source: 'event',
            comments: $scope.item.social.comments,
            id: $scope.item.id
        };
        $rootScope.$broadcast('showComments', data);
    };
    $scope.$on('addCommentEvent', function (event, args) {
        if (args.id == $scope.item.id) {
            var comment = {};
            comment.date = new Date();
            comment.peopleKey = $scope.peopleKey;
            comment.comment = args.comment;
            comment.isOwner = true;

            $scope.item.social.comments.push(comment);
        }
    });
    //#endregion

    //#region identifierImage
    // Identifier image
    $scope.identifierImage = 'img/img_' + $scope.item.createdUserPeopleKey + '.jpg';
    //#endregion

    //#region Action buttons
    $scope.checkVisibility = function () {

        $scope.showJoin = false;
        $scope.showLeave = false;
        $scope.showFollow = false;
        $scope.showUnfollow = false;

        if ($scope.item.type == 'event') {
            $scope.showJoin = ($scope.item.isJoined == false) && ($scope.item.status == 'active');
            $scope.showLeave = ($scope.item.isJoined == true) && ($scope.item.status == 'active');
        }
        else if ($scope.item.type == 'blog') {
            $scope.showFollow = ($scope.item.isFollowed != true) && ($scope.item.status == 'active');
            $scope.showUnfollow = ($scope.item.isFollowed == true) && ($scope.item.status == 'active');
        }

        $scope.showButtons = $scope.showJoin || $scope.showLeave || $scope.showFollow || $scope.showUnfollow;
    };
    $scope.checkVisibility();

    $scope.joinEvent = function () {
        $scope.item.isJoined = true;
        $scope.checkVisibility();
    };
    $scope.leaveEvent = function () {
        $scope.item.isJoined = false;
        $scope.checkVisibility();
    };
    $scope.followBlog = function () {
        $scope.item.isFollowed = true;
        $scope.checkVisibility();
    };
    $scope.unfollowBlog = function () {
        $scope.item.isFollowed = false;
        $scope.checkVisibility();
    };

    $scope.$on('joinEvent', function (event, args) {
        if (args.id == $scope.item.id) {
            $scope.joinEvent();
        }
    });
    $scope.$on('leaveEvent', function (event, args) {
        if (args.id == $scope.item.id) {
            $scope.leaveEvent();
        }
    });
    $scope.$on('followBlog', function (event, args) {
        if (args.id == $scope.item.id) {
            $scope.followBlog();
        }
    });
    $scope.$on('unfollowBlog', function (event, args) {
        if (args.id == $scope.item.id) {
            $scope.unfollowBlog();
        }
    });

    $scope.showActions = function () {
        var data = { item: $scope.item };
        $rootScope.$broadcast('showActions', data);
    }
    //#endregion

    //#region Safe HTML
    $scope.item.bodySafe = $sce.trustAsHtml($scope.item.body);
    //#endregion
}]);

cards.directive('accEvent', [function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            enterpriseId: '@',
            peopleKey: '@',
            tap: '&'
        },
        controller: 'myEventController',
        templateUrl: 'lib/harmonizr/acc-event/event.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);
cards.directive('accEventDetail', [function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            enterpriseId: '@',
            peopleKey: '@'
        },
        controller: 'myEventController',
        templateUrl: 'lib/harmonizr/acc-event/event.detail.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);