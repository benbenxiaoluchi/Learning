controllers.controller('discussionsDetailController',
    ['$scope', '$stateParams', 'streamService', '$ionicHistory',
    function ($scope, $stateParams, streamService, $ionicHistory) {
        //#region Properties
        $scope.discussions = [];
        $scope.hashtag = $stateParams.discussionId;
        $scope.loading = false;
        //#endregion

        //#region Actions
        $scope.init = function () {
            $scope.loadStream();
        };

        $scope.loadStream = function () {
            $scope.loading = true;

            streamService.getDiscussionStream($stateParams.circleId, 100, 0, '#' + $stateParams.discussionId).then(
                function (data) {
                    $scope.discussions = data;
                    $scope.loading = false;
                },
                function (error) {
                    $scope.loading = false;
                    console.log(error);
                }
            );
        };
        //#endregion

        //#region Init
        $scope.init();
        //#endregion

        //#region Events
        $scope.$on('acc-article-navigate', function (event, args) {
            streamService.setDetail(args);
            $scope.navigateToState('app.article', { articleId: args.eventID, flag: false }, false);
        });
        $scope.$on('acc-article-comment', function (event, args) {
            streamService.setDetail(args);
            $scope.navigateToState('app.article', { articleId: args.eventID, flag: true }, false);
        });
        $scope.$on('acc-article-profile', function (event, eid, peopleKey) {
            $scope.navToPeople(eid, peopleKey);
        });
        $scope.$on('acc-article-hashtag', function (event, args) {
            $scope.navigateToState('app.discussion', { discussionId: args, circleId: $stateParams.circleId }, false);
        });
        $scope.$on('acc-article-like', function (event, args) {
            streamService.like(args.eventID).then(
                function (data) {
                    streamService.likeManagement(args);
                },
                function (error) {
                    console.log(error);
                }
            );
        });
        $scope.$on('acc-article-share', function (event, args) {
            if (args.userShareThis == 1) { return; }
            streamService.share(args.eventID).then(
                function (data) {
                    streamService.shareManagement(args);
                },
                function (error) {
                    console.log(error);
                }
            );
        });

        $scope.closeDisscusionsDetail = function () {
            $ionicHistory.goBack();
        }
        //#endregion
    }]
);
