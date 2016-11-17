controllers.controller('streamDetailController',
    ['$scope', '$stateParams', '$timeout', 'streamService', '$ionicHistory',
    function ($scope, $stateParams, $timeout, streamService, $ionicHistory) {
        //#region Properties
        $scope.article = null;
        $scope.skip = 0;
        $scope.newComment = '';
        //#endregion

        //#region Actions
        $scope.init = function () {
            //crittercismService.leaveBreadcrumb('$scope.init - streamDetailController - ' + $stateParams.articleId);
            $scope.article = null;
            $scope.loadArticle();
        };
        $scope.loadArticle = function () {
            //crittercismService.leaveBreadcrumb('Load Article - Id:' + $stateParams.articleId);
            streamService.getStreamDetail($stateParams.articleId).then(
                function (data) {
                    $scope.article = data;
                    if ($stateParams.flag == 'true') {
                        $timeout(function () {
                            // set focus && open keyboard
                            $scope.$broadcast('focus-me', 'stream-detail');
                        }, 100);
                    }
                },
                function (error) {
                    console.log(error);
                    //messagesService.log(error);
                    //messagesService.show(constants.messages.stream.getArticle);
                }
            );
        };
        $scope.createComment = function (comment) {
            //crittercismService.leaveBreadcrumb('Post Comment on Article - Id:' + $stateParams.articleId);

            streamService.comment($stateParams.articleId, comment).then(
                function (data) {
                    // comment created succesfully
                    streamService.commentManagement($scope.article, data);
                    $scope.$broadcast('acc-article-comment-added', $stateParams.articleId);
                },
                function (error) {
                    console.log(eroor);
                    //messagesService.log(error);
                    //messagesService.show(constants.messages.stream.comment);
                }
            );
        };
        //#endregion

        //#region Init
        $scope.init();
        //#endregion

        //#region Events
        $scope.$on('acc-article-like', function (event, args) {
            //crittercismService.leaveBreadcrumb('Like Article - Id:' + args.eventID);
            streamService.like(args.eventID).then(
                function (data) {
                    streamService.likeManagement(args);
                },
                function (error) {
                    console.log(error);
                    //messagesService.log(error);
                    //messagesService.show(constants.messages.stream.like);
                }
            );
        });
        $scope.$on('acc-article-share', function (event, args) {
            if (args.userShareThis == 1) { return; }
            //crittercismService.leaveBreadcrumb('Share Article - Id:' + args.eventID);
            streamService.share(args.eventID).then(
                function (data) {
                    streamService.shareManagement(args);
                }, function (error) {
                    console.log(error);
                    //messagesService.log(error);
                    //messagesService.show(constants.messages.stream.share);
                }
            );
        });

        $scope.closeDetail = function () {
            $ionicHistory.goBack();
        }
        //#endregion
    }]
);
