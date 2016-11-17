var cards = null;

try {
    cards = angular.module('harmonizr.cards');
}
catch (e) {
    cards = angular.module('harmonizr.cards', ['harmonizr']);
}
//#endregion

cards.controller('$accSocial', ['$scope', '$rootScope', '$sce', 'harmonizr.methods', function ($scope, $rootScope, $sce, methods) {
    $scope.article = $scope.item;

    //#region Actions
    $scope.comment = function () {
        if ($scope.canNavigate === 'true') {
            $scope.$emit('acc-article-comment', $scope.article)
        }
    };
    $scope.navigate = function () {
        if ($scope.canNavigate === 'true') {
            $scope.$emit('acc-article-navigate', $scope.article)
        }
    };
    $scope.profile = function ($event, enterpriseId, peopleKey) {
        $event.stopPropagation();
        if ($scope.canNavigate === 'true') {
            $scope.$emit('acc-article-profile', enterpriseId, peopleKey)
        }
    };
    $scope.hashtag = function ($event, hashtag) {
        $event.stopPropagation();
        if ($scope.canNavigate === 'true') {

            $scope.$emit('acc-article-hashtag', hashtag)
        }
    };
    $scope.like = function () {
        //console.log("emit");
        $scope.$emit('acc-article-like', $scope.article)
    };
    $scope.share = function () {
        $scope.$emit('acc-article-share', $scope.article)
    };
    $scope.safeHTMLComments = function () {
        // safe comments
        if ($scope.article.Comments) {
            for (var c = 0; c < $scope.article.Comments.length; c++) {
                var obj = angular.element('<div class="comment-image">' + $scope.article.Comments[c].bodyTxt + '</div>');

                // manage images
                if (obj && (obj.length) > 0) {
                    var links = obj[0].querySelectorAll('a');
                    for (var i = 0; i < links.length; i++) {
                        if ((links[i].getAttribute('href') != '') &&
                            (links[i].getAttribute('href').toLowerCase().indexOf('.jpg') >= 0) &&
                            (links[i].getAttribute('href').toLowerCase().indexOf('https://collab-ts.accenture.com/') >= 0)) {
                            obj.append('<img src="https://people.accenture.com/misc/GoogleChartHandler.ashx?URL=' + links[i].getAttribute('href') + '"/>');
                        }
                        if (links[i].getAttribute('href') != '') {
                            links[i].setAttribute('acc-open-link', '');
                        }
                    }
                    $scope.article.Comments[c].bodyMarkupTrusted = $sce.trustAsHtml(obj[0].outerHTML);
                }
            }
        }
    };
    $scope.safeHTML = function () {
        if (methods.isEmptyOrNull($scope.article.bodyMarkup)) {
            $scope.article.bodyMarkup = '';
        }

        // Manage images
        $scope.article.bodyMarkup = $scope.article.bodyMarkup.replace(/'\/misc\/GoogleChartHandler.ashx/g, '\'https://people.accenture.com/misc/GoogleChartHandler.ashx');

        if ($scope.article.mediaImage != null && $scope.article.mediaImage.indexOf('https://people.accenture.com/misc/GoogleChartHandler.ashx?URL=') < 0) {
            $scope.article.mediaImage = 'https://people.accenture.com/misc/GoogleChartHandler.ashx?URL=' + $scope.article.mediaImage;
        }

        // safe post
        var obj = angular.element('<div>' + $scope.article.bodyMarkup + '</div>');

        // manage people links
        if (obj) {
            var personLinks = obj[0].querySelectorAll('.feed-person-item.link');
            for (var c = 0; c < personLinks.length; c++) {
                var enterpriseId = personLinks[c].getAttribute('data-eid');
                if (enterpriseId && enterpriseId !== '') {
                    personLinks[c].setAttribute('href', '');
                    personLinks[c].setAttribute('ng-click', "profile($event,'" + enterpriseId + "')");
                }
            }
        }

        // manage hashtag links
        if (obj) {
            var hashtagLinks = obj[0].querySelectorAll('.hashtag.link');
            for (var c = 0; c < hashtagLinks.length; c++) {
                var hashtag = hashtagLinks[c].innerText;
                if (hashtag && hashtag !== '') {
                    hashtag = hashtag.replace('#', '');
                    hashtagLinks[c].setAttribute('href', '');
                    hashtagLinks[c].setAttribute('ng-click', "hashtag($event,'" + hashtag + "')");
                }
            }
        }

        // manage external links
        if (obj) {
            var links = obj[0].querySelectorAll('a');
            for (var c = 0; c < links.length; c++) {
                if (links[c].getAttribute('href') != '') {
                    links[c].setAttribute('acc-open-link', '');
                }
            }
        }

        $scope.article.bodyMarkupTrusted = $sce.trustAsHtml(obj[0].outerHTML);
        //$scope.article.bodyMarkupTrusted = $sce.trustAsHtml($scope.article.bodyTxt);
    };
    //#endregion

    //#region Events
    $scope.$on('acc-article-comment-added', function (event, args) {
        if ($scope.article.eventID == args) {
            $scope.safeHTMLComments();
        }
    });
    //#endregion

    //#region Init
    $scope.safeHTML();
    $scope.safeHTMLComments();
    //#endregion
}]);


cards.directive('accSocial', [function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            canNavigate: '@',
            showComments: '@'
        },
        controller: '$accSocial',
        templateUrl: 'lib/harmonizr/acc-social/social.card.template.html',
        link: function (scope, element, attrs) {
        }
    };
}]);
