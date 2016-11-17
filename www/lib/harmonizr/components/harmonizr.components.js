//#region module definition
var components = null;

try {
    components = angular.module('harmonizr.components');
}
catch (e) {
    components = angular.module('harmonizr.components', ['harmonizr']);
}
//#endregion

//#region Components
components.directive('peopleList', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: { size: '@', list: '=' },
        templateUrl: 'lib/harmonizr/components/people.list.html',
        controller: function ($scope) {
            //#region people
            if ($scope.list != null) {
                $scope.splittedList = methods.chunk($scope.list, parseInt($scope.size));
            }
            //#endregion
            $scope.$watchCollection('list', function () {
                if ($scope.list != null) {
                    $scope.splittedList = methods.chunk($scope.list, parseInt($scope.size));
                }
            });
        }
    };
}]);

/*in social page how to show time*/
components.directive('accTimeAgo', function () {
    return {
        link: function (scope, element, attrs) {
            var text = moment.utc(attrs.date).fromNow();
            element.text(text);
        }
    };
});

components.directive('slideBoxSplittedImages', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: { size: '@', list: '=', height: '@', showPager: '@', slideInterval: '@' },
        templateUrl: 'lib/harmonizr/components/slidebox.splitted.images.html',
        controller: function ($scope) {
            var size = parseInt($scope.size);

            switch (size) {
                case 2: $scope.colSize = 'col-50'; break;
                case 3: $scope.colSize = 'col-33'; break;
                case 4: $scope.colSize = 'col-25'; break;
            }

            if ($scope.list != null) {
                $scope.splittedList = methods.chunk($scope.list, size);
            }
        }
    };
}]);

components.directive('slideBoxSplittedPeopleImages', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: { size: '@', rows: '@', list: '=', showPager: '@', tapEvent: '@' },
        templateUrl: 'lib/harmonizr/components/slidebox.splitted.people.images.html',
        controller: function ($scope, $rootScope) {
            var size = parseInt($scope.size);
            var rows = 1;
            if ($scope.rows !== undefined) {
                rows = parseInt($scope.rows);
            }

            switch (size / rows) {
                case 1: $scope.colSize = ''; break;
                case 2: $scope.colSize = 'col-50'; break;
                case 3: $scope.colSize = 'col-33'; break;
                case 4: $scope.colSize = 'col-25'; break;
            }

            $scope.$watch('list', function (newValue, oldValue) {
                var result = [],
                    resultRows = [];
                if (!methods.isEmptyOrNull($scope.list)) {
                    result = methods.chunk($scope.list, size);
                    for (var c = 0; c < result.length; c++) {
                        resultRows.push(methods.chunk(result[c], size / rows));
                    }
                }

                $scope.splittedList = resultRows;
            });

            $scope.clicked = function (item) {
                if ($scope.tapEvent !== undefined) {
                    $rootScope.$broadcast($scope.tapEvent, item);
                }
            }
        }
    };
}]);

components.directive('slideBoxImages', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: { list: '=', height: '@', showPager: '@', slideInterval: '@' },
        templateUrl: 'lib/harmonizr/components/slidebox.images.html',
        controller: function ($scope) {
            if ($scope.list != null) {
                $scope.splittedList = methods.chunk($scope.list, $scope.size);
            }
        }
    };
}]);

components.directive('googleMap', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: { map: '=', size: '@', type: '@', zoom: '@', markerColor: '@' },
        templateUrl: 'lib/harmonizr/components/google.map.html',
        controller: function ($scope) {
            // default values
            var zoom = '18',
                size = '600x300',
                type = 'roadmap',
                markerColor = 'blue',
                url = 'http://maps.googleapis.com/maps/api/staticmap?center={4}&zoom={0}&size={1}&maptype={2}&markers=color:{3}%7C{4}&key=AIzaSyA3ecruDzTgPCv-oMA9ZDib7j9Ra0qTG-I';

            $scope.mapUrl = '';

            if (!methods.isEmptyOrNull($scope.zoom)) { zoom = $scope.zoom; }
            if (!methods.isEmptyOrNull($scope.size)) { size = $scope.size; }
            if (!methods.isEmptyOrNull($scope.type)) { type = $scope.type; }
            if (!methods.isEmptyOrNull($scope.markerColor)) { markerColor = $scope.markerColor; }

            if (!methods.isEmptyOrNull($scope.map.geoLocation) != null) {
                $scope.mapUrl = methods.parse(url, zoom, size, type, markerColor, $scope.map.geoLocation);
            }

            if (!methods.isEmptyOrNull($scope.map.image)) {
                $scope.mapUrl = $scope.map.image;
            }
        }
    };
}]);

components.directive('rating', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: { stars: '@', counter: '@' },
        templateUrl: 'lib/harmonizr/components/rating.html',
        controller: function ($scope) {
            $scope.myStars = 0;
            $scope.myCounter = null;

            if (!methods.isEmptyOrNull($scope.stars)) { $scope.myStars = methods.tryParse($scope.stars); }
            if (!methods.isEmptyOrNull($scope.counter)) { $scope.myCounter = $scope.counter; }
        }
    };
}]);

components.directive('socialActions', ['harmonizr.methods', function (methods) {
    return {
        restrict: 'E',
        scope: {
            showLike: '@', actionLike: '&', isLikeActive: '@', likeNumber: '@',
            showComment: '@', actionComment: '&', commentNumber: '@',
            showShare: '@', actionShare: '&', isShareActive: '@', shareNumber: '@',
            showOptions: '@', actionOptions: '&'
        },
        templateUrl: 'lib/harmonizr/components/social.actions.html',
        controller: function ($scope) {
            function doNothing() { return; }
            //#region Like
            $scope.likeIsVisible = false;
            if ($scope.showLike == 'true') {
                $scope.likeIsVisible = true;
                if (methods.isEmptyOrNull($scope.actionLike)) { $scope.actionLike = doNothing; }
                //if ($scope.isLikeActive == 'true') { $scope.isLikeActive = true; } else { $scope.isLikeActive = false; }
            }
            //#endregion
            //#region Comment
            $scope.commentIsVisible = false;
            if ($scope.showComment == 'true') {
                $scope.commentIsVisible = true;
                if (methods.isEmptyOrNull($scope.actionComment)) { $scope.actionComment = doNothing; }
            }
            //#endregion
            //#region Share
            $scope.shareIsVisible = false;
            if ($scope.showShare == 'true') {
                $scope.shareIsVisible = true;
                if (methods.isEmptyOrNull($scope.actionShare)) { $scope.actionShare = doNothing; }
                //if ($scope.isShareActive == 'true') { $scope.isShareActive = true; } else { $scope.isLikisShareActiveeActive = false; }
            }
            //#endregion
            //#region Options
            $scope.classOptions = 'col-25';
            $scope.optionsIsVisible = false;
            if ($scope.showOptions == 'true') {
                $scope.optionsIsVisible = true;
                if (methods.isEmptyOrNull($scope.actionOptions)) { $scope.actionOptions = doNothing; }

                $scope.classOptions = 100;
                if ($scope.likeIsVisible) { $scope.classOptions = $scope.classOptions - 25; }
                if ($scope.commentIsVisible) { $scope.classOptions = $scope.classOptions - 25; }
                if ($scope.shareIsVisible) { $scope.classOptions = $scope.classOptions - 25; }
                $scope.classOptions = 'col-' + $scope.classOptions;
            }
            //#endregion
        }
    };
}]);
//#endregion

//#region Video
components.directive('autoplay', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            function openFirstVideo() {
                var views = document.getElementsByTagName('ion-view');
                var view = null;
                for (var c = 0; c < views.length; c++) {
                    if (views[c].getAttribute('nav-view') === 'active') {
                        view = views[c];
                        break;
                    }
                }
                if (view) {
                    var videos = view.getElementsByTagName("video");
                    if (videos && videos.length > 0) {
                        //console.log('play video ' + videos[0].id);
                        videos[0].play();
                        videos[0].oncanplay = function () {
                            videos[0].play();
                        }
                    }
                }
            };
            function stopAllVideos() {
                var videos = document.getElementsByTagName("video");
                for (var c = 0; c < videos.length; c++) {
                    videos[c].pause();
                    videos[c].currentTime = 0;
                }
            };

            // Manage event after enter view
            $rootScope.$on('$ionicView.beforeLeave', function () {
                stopAllVideos();
            });

            // Manage event after enter view
            $rootScope.$on('$ionicView.afterEnter', function () {
                $timeout(function () {
                    openFirstVideo();
                }, 100);
            });

            // Manage event after slide change
            $rootScope.$on('autoplay', function () {
                $timeout(function () {
                    stopAllVideos();
                    openFirstVideo();
                }, 100);
            });
        }
    };
}]);
//#endregion

//#region Header
components.directive("headerShrink", ["$compile", "$ionicPosition", "$state", "$document", "$rootScope", function ($compile, $ionicPosition, $state, $document, $rootScope) {
    /*
     * Functionality: change the style in the header (bar-header class) and/or the StatusBar when the vertical scroll exceeds a certain point 
     * Use: As attribute data-header-shrink="" or header-shrink="", the values accepted for this attribute are "false" if only want change the StatusBar, 
     *      empty or "true" indicates that the change occurs when the vertical scroll exceed the join point into the header (as ion-list) and the content,
     *      use another numeric value for increase or decrease this point
     * Parameters: 
     *      - header-shrink-status-bar: not available or empty indicates that the StatusBar doesn't change, a numeric value indicate the new style 
     *        "0" for white, "1" for black, use values separated by comma for indicates the style before and after the vertical scroll exceed the limit: "0,1"
     *        It use "window.StatusBar", maybe you can try "$cordovaStatusbar" if it doesn't works
     *      - header-shrink-classes: not available for use the default values before and after the vertical scroll exceed the limit "bar-transparent,bar-stable" 
     *        another values separated by comma are possible
     *      - header-shrink-title-template: not available indicates that the title doesn't change when the header style changes, empty for clean the title and 
     *        another value for replace the title for it when the vertical scroll exceed the limit, when the scroll returns below the limit the title changes 
     *        to the original value, HTML and angular keywords are possible
     * Events:
     *      - changeStatusBar with the new "status" value, you can use this information for change the StatusBar when you open a modal
     */
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var shrink = (attrs.headerShrinkClasses || "bar-transparent,bar-stable").split(",");
            var statusBar = (attrs.headerShrinkStatusBar || "").split(",");
            var $template = attrs.headerShrinkTitleTemplate;
            var offset = attrs.headerShrink || "0";
            var state = $state.current.name;

            var onlyStatusBar = false;
            var titlesContent = [];
            var firstTime = true;
            var $content = null;
            var position = 0;
            // booleans values in directive
            if (offset === "true" || offset === "false") { // true if you want change the header, false if you want change only the status bar
                onlyStatusBar = (offset === "false");
                offset = "0";
            }
            offset = parseInt(offset); // + $document[0].getElementsByClassName("fake-statusbar")[0].offsetHeight; // add fake status bar

            // check the template
            if (typeof $template === "undefined") {
                $template = null;
            } else {
                $template = $template.trim();
            }

            // save and change the status bar
            function changeStatusBar() {
                var status = statusBar[position];
                if (window.StatusBar && typeof status !== "undefined" && status.trim() !== "") {
                    status *= 1; // parseInt
                    if (status === 0) { // white
                        window.StatusBar.styleLightContent();
                    } else {
                        window.StatusBar.styleDefault(status); // 1 -- black
                    }
                    $rootScope.$broadcast("changeStatusBar", { "status": status });
                }
            }

            // save and change the title
            function changeTitle($header, headerPosition) {
                var childrens = $header.children();
                for (var index = 0; index < childrens.length; index++) {
                    var $children = angular.element(childrens[index]);
                    if ($children.hasClass("title")) {
                        if (!titlesContent[headerPosition]) {
                            if ($children.children().length === 0) {
                                $children.html("<div>" + $children.html().trim() + "</div>"); // text function is not working, force to html
                            }
                            titlesContent[headerPosition] = $children.children();
                        }
                        // show / hide title
                        childrens = $children.children();
                        for (index = 0; index < childrens.length; index++) {
                            if (index < titlesContent[headerPosition].length) {
                                childrens[index].style.display = ((position === 0) ? "" : "none"); // original title
                            } else {
                                childrens[index].remove(); // template title
                            }
                        }
                        if ($template !== "" && position !== 0) {

                            // get the scope property that has the template for the title
                            var originalTemplate = eval("scope." + $template);

                            // compile the template in order to angular code work correctly
                            var compiledTemplate = $compile(originalTemplate)(scope);
                            // append the compiled template to html code
                            $children.append(compiledTemplate);

                            $children[0].style.right = $children[0].style.left; // avoid short titles

                            // apply the scope in order to angular code be updated correctly
                            scope.$apply();
                        }
                        break;
                    }
                }
            }

            // detect the header that needs to be changed
            function changeHeader(content, force) {
                if (!onlyStatusBar) {
                    var headers = content.previousElementSibling;
                    if (headers) {
                        headers = headers.querySelectorAll(".bar-header");
                        for (var header = 0; header < headers.length; header++) {
                            var $header = angular.element(headers[header]);
                            if (!$header.hasClass(shrink[position]) || force) {
                                $header.removeClass(shrink[(position + 1) % shrink.length]).addClass(shrink[position]);
                                // change title if is necessary
                                if ($template !== null) {
                                    changeTitle($header, header);
                                }
                                if (header === 0) {
                                    changeStatusBar(); // only change one time
                                }
                            }
                        }
                    }
                } else {
                    changeStatusBar(); // only change one time
                }
            }

            // This method searches for the appropiate content to attach the scroll event.
            function searchContent(status) {

                // get all "ion-content" elements
                var content = null;
                var contents = $document[0].getElementsByTagName("ion-content");

                // iterate throught all content found
                for (var index = 0; index < contents.length; index++) {

                    // once we found the correct content element, attach the scroll event
                    if (contents[index].parentNode.getAttribute("nav-view") === status && ($content === null || $content[0] !== contents[index])) {
                        content = angular.element(contents[index]);

                        // startY variable stores the limit position that indicates when the header is shrinked and we need to change it
                        var startY = $ionicPosition.position(content.find("div").eq(0).find("ion-list").eq(0).next()).top + offset;
                        // scroll event
                        content.on("scroll", function (evt) {

                            // if we detect that the position surpases the startY, then change position property, indicating that the header will change
                            position = +!!(evt.detail.scrollTop >= startY);
                            changeHeader(this, false);
                        });
                        break;
                    }
                }

                return (content || $content);
            }

            // This two events prepare the content to have the scroll detection (searchContent method)
            scope.$on("$stateChangeSuccess", function (evt, to) {
                if (state === to.name) { // the current status
                    if (firstTime) {
                        if (!onlyStatusBar) {
                            $content = searchContent("stage");
                        } else {
                            $content = [];
                        }
                    }
                }
            });

            scope.$on("$ionicView.enter", function () {
                if (!firstTime && !onlyStatusBar) {
                    $content = searchContent("entering");
                }
                changeHeader($content[0], true);
                firstTime = false;
            });
        }
    };
}]);

components.directive("accHeaderShrink", ['$compile', '$templateCache', '$rootScope', function ($compile, $templateCache, $rootScope) {
    /*
     * Functionality: change the style in the header (bar-header class) and/or the StatusBar when the vertical scroll exceeds a certain point 
     * Use: As attribute data-header-shrink="" or header-shrink="", the values accepted for this attribute are "false" if only want change the StatusBar, 
     *      empty or "true" indicates that the change occurs when the vertical scroll exceed the join point into the header (as ion-list) and the content,
     *      use another numeric value for increase or decrease this point
     * Parameters: 
     * default-class:
     * shrink-class
     * default-status-bar ['white'|'black']
     * shrink-status-bar ['white'|'black']
     * title-template
     * offset
     */
    return {
        restrict: "A",
        link: function (scope, element, attrs) {

            var accHeaderShrink = {
                defaultClass: attrs.defaultClass || 'bar-transparent',
                shrinkClass: attrs.shrinkClass || 'bar-stable',
                defaultStatusBar: attrs.defaultStatusBar || 'white',
                shrinkStatusBar: attrs.shrinkStatusBar || 'white',
                titleTemplate: attrs.titleTemplate,
                titleTemplateHtml: attrs.titleTemplateHtml,
                titleTemplateString: attrs.titleTemplateString,
                offset: (ionic.Platform.isIOS()) ? attrs.offset : parseInt(attrs.offset) + 20,
                shrinked: false
            };

            // Init status bar
            if (window.StatusBar) {
                if (accHeaderShrink.defaultStatusBar == 'white') {
                    window.StatusBar.styleLightContent(); // white
                } else {
                    window.StatusBar.styleDefault('1'); // black
                }
            }

            scope.$on('$ionicView.enter', function (event) {
                addScrollEvent();
            });

            function addScrollEvent() {
                var content = element.find('ion-content');
                // scroll event
                content.on("scroll", function (event) {
                    // if we detect that the position exceed the offset the header will change if apply
                    var shouldShrink = (event.detail.scrollTop >= accHeaderShrink.offset);
                    var shouldNormal = (event.detail.scrollTop < accHeaderShrink.offset);

                    if (!accHeaderShrink.shrinked && shouldShrink) {
                        updateHeader(true);
                    }
                    else if (accHeaderShrink.shrinked && shouldNormal) {
                        updateHeader(false);
                    }
                });
            }

            function compileTemplate(title, template) {
                // compile the template in order to angular code work correctly
                var compiledTemplate = $compile(template)(scope);
                // set the compiled template to html code
                title.append(compiledTemplate);
                scope.$apply();
            }

            function updateHeader(shrink) {
                var header = angular.element(element.find('ion-header-bar'));

                if (shrink) {
                    accHeaderShrink.shrinked = true;

                    // iterate through each header (cached ones too)
                    for (var c = 0; c < header.length; c++) {
                        var title = angular.element(header[c].querySelector('div.title'));

                        var originalTemplate = '';
                        if (accHeaderShrink.titleTemplate) {
                            // get the scope property that has the template for the title
                            originalTemplate = eval('scope.' + accHeaderShrink.titleTemplate);
                        }
                        else if (accHeaderShrink.titleTemplateHtml) {
                            // get the template from html
                            originalTemplate = $templateCache.get(accHeaderShrink.titleTemplateHtml);
                        }
                        else if (accHeaderShrink.titleTemplateString) {
                            // template is an string property
                            originalTemplate = '<h1 class="title">' + accHeaderShrink.titleTemplateString + '</h1>';
                        }

                        // compile the template in order to angular code work correctly
                        compileTemplate(title, originalTemplate);
                    }

                    header.addClass(accHeaderShrink.shrinkClass);
                    header.removeClass(accHeaderShrink.defaultClass);

                    if (window.StatusBar) {
                        if (accHeaderShrink.shrinkStatusBar == 'white') {
                            window.StatusBar.styleLightContent(); // white
                        } else {
                            window.StatusBar.styleDefault('1'); // black
                        }
                    }
                }
                else {
                    accHeaderShrink.shrinked = false;
                    // iterate through each header (cached ones too)
                    for (var c = 0; c < header.length; c++) {
                        var title = header[c].querySelector('div.title');
                        // remove the title
                        if (title) {
                        title.innerHTML = '';
                    }
                    }

                    header.addClass(accHeaderShrink.defaultClass);
                    header.removeClass(accHeaderShrink.shrinkClass);

                    if (window.StatusBar) {
                        if (accHeaderShrink.defaultStatusBar == 'white') {
                            window.StatusBar.styleLightContent(); // white
                        } else {
                            window.StatusBar.styleDefault('1'); // black
                        }
                    }
                }
            }
        }
    };
}]);
//#endregion

//#region Tabs
components.directive("accTab", ["$http", "$compile", "$ionicPosition", "$state", "$document", "$rootScope", "$ionicSlideBoxDelegate", "$ionicScrollDelegate", "$timeout", '$location',
    function ($http, $compile, $ionicPosition, $state, $document, $rootScope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout, $location) {

        return {
            restrict: "E",
            link: function (scope, element, attrs) {


                var accTab = {
                    offset: (ionic.Platform.isIOS()) ? attrs.offset : parseInt(attrs.offset) + 20,
                    top: attrs.top,
                    template: attrs.template,
                    tabs: attrs.tabs,
                    html: '',
                    shrinked: false,
                    fakeTabClass: 'fake-header',
                    fakeTab: null,
                    id: attrs.id + '_fake',
                    content: element.parent().parent(),
                    state: $state.current.name,
                    url: $location.url()
                };

                // create the tabs, apply the template
                scope.tabs = JSON.parse(accTab.tabs.replace(/'/g, '"'));
                scope.currentTab = (($state.params && $state.params.tab) ? parseInt($state.params.tab) : 0);
                scope.onSlideMove = function (data) {
                    // active correct tab
                    var aFake = accTab.fakeTab.find("a");
                    for (var a = 0; a < aFake.length; a++) {
                        if (a !== data.index) {
                            aFake[a].classList.remove("active");
                        } else {
                            aFake[a].classList.add("active");
                        }
                    }

                    scope.currentTab = data.index;
                    scope.$broadcast("changeTab", { "tab": data.index });
                    scope.$broadcast("autoplay");
                    $timeout(function () {
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollBy(0, 0, false);
                    }, 50);
                };

                function buildTemplate() {
                    $http.get(accTab.template).success(function (html) {
                        accTab.html = html;
                        // compile tab
                        element.append($compile(html)(scope));

                        // if exists -> remove
                        if (document.querySelector('#' + accTab.id) != null) {
                            angular.element(document.querySelector('#' + accTab.id)).remove();
                        }

                        // fake tab header
                        var fakeHeader = '<div id="' + accTab.id + '" class="' + accTab.fakeTabClass + '" style="position: absolute; display: none; top:' + accTab.top + 'px; width: 100%;"></div>';
                        angular.element(document.getElementsByTagName("body")).append(fakeHeader);

                        accTab.fakeTab = angular.element(document.getElementById(accTab.id));
                        accTab.fakeTab.append($compile(accTab.html.replace('on-slide-changed', 'data-fake'))(scope));
                        accTab.fakeTab.find("ion-slide").remove();

                        $rootScope.$broadcast("changeTab", { "tab": scope.currentTab });
                    });
                }

                function addScrollEvent() {
                    //var content = element.find('ion-content');
                    //var content = element.parent().parent();

                    // scroll event
                    accTab.content.bind('scroll', function (event) {
                        // if we detect that the position exceed the offset the header will change if apply
                        var shouldShrink = (event.detail.scrollTop >= accTab.offset);
                        var shouldNormal = (event.detail.scrollTop < accTab.offset);

                        if (!accTab.shrinked && shouldShrink) {
                            updateHeader(true);
                        }
                        else if (accTab.shrinked && shouldNormal) {
                            updateHeader(false);
                        }
                    });
                }

                function updateHeader(shrink) {
                    if (shrink) {
                        accTab.shrinked = true;
                        accTab.fakeTab[0].querySelector('div.scroll').style.cssText = element[0].querySelector('div.scroll').style.cssText;
                        accTab.fakeTab.css('display', '');
                    }
                    else {
                        accTab.shrinked = false;
                        element[0].querySelector('div.scroll').style.cssText = accTab.fakeTab[0].querySelector('div.scroll').style.cssText;
                        accTab.fakeTab.css('display', 'none');
                    }
                }

                $rootScope.$on('$ionicView.beforeLeave', function () {
                    if (accTab.url != $location.url()) {
                        if (accTab.fakeTab) {
                            //console.log('beforeLeave ' + accTab.url + '-' + $location.url());
                            accTab.fakeTab.css('display', 'none');
                        }
                    }
                });

                $rootScope.$on('$ionicView.beforeEnter', function () {
                    if (accTab.url == $location.url()) {
                        //console.log('beforeEnter ' + accTab.url + '-' + $location.url());
                        accTab.shrinked = false;
                        $ionicScrollDelegate.scrollBy(0, 0, false);
                        if (accTab.html == '') {
                            buildTemplate();
                            addScrollEvent();
                        }
                    }
                });
            }
        }
    }]);

components.directive('accTabStatic', ['$http', '$compile', '$state', '$rootScope', '$ionicScrollDelegate', '$timeout', '$location', '$ionicPosition',
    function ($http, $compile, $state, $rootScope, $ionicScrollDelegate, $timeout, $location, $ionicPosition) {

        return {
            restrict: 'E',
            templateUrl: 'lib/harmonizr/components/acc.tab.static.html',
            link: function (scope, element, attrs) {
                var accTab = {
                    offset: (ionic.Platform.isIOS()) ? attrs.offset : parseInt(attrs.offset) + 20,
                    top: attrs.top,
                    shrinked: false,
                    fakeTabClass: 'fake-header',
                    fakeTab: null,
                    id: attrs.id,
                    fakeId: attrs.id + '_fake',
                    content: element.parent().parent(),
                    state: $state.current.name,
                    url: $location.url()
                };

                //#region tab functionality
                function selectDefaultTab() {
                    if ($state.params && $state.params.tab) {
                        scope.selectTab(parseInt($state.params.tab));
                    }
                    else {
                        scope.selectTab(0);
                    }
                }
                scope.$watch(attrs.tabs, function (result) {
                    if (result) {
                        scope.tabs = result;
                        accTab.shrinked = false;
                        buildTemplate();
                        addScrollEvent();
                        selectDefaultTab();
                    }
                });
                scope.selectTab = function (index, tabLabel) {
                    scope.currentTab = index;
                    scope.$emit('changedTab', { 'tab': scope.currentTab, 'id': accTab.id, 'tabLabel': tabLabel });
                    //adjust scroll
                    $timeout(function () {
                        //scope.exit = false;
                        //scope.currentTab = index;

                        //scope.$emit('changedTab', { 'tab': scope.currentTab, 'id': acnTab.id });
                        // Modified the code for learning events
                        //scope.$emit('changedTab', { 'tab': scope.currentTab, 'id': acnTab.id, 'tabLabel': scope.tabs[scope.currentTab].text });
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollBy(0, 0, false);
                    }, 50);

                    // Move horizontal scroll to selected tab
                    //if (shouldScroll) {
                    $timeout(function () {
                        // locate item to scroll
                        var left = 0;

                        if (index > 0) {
                            var scroll = angular.element(element.find('ion-scroll'));
                            var items = scroll.find('a');
                            for (var c = 0; c < index - 1; c++) {
                                left += items[c].offsetWidth;
                            }
                        }
                        $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll').scrollTo(left, 0, true);
                        $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll-fake').scrollTo(left, 0, true);
                    }, 100);
                    //}
                };

                // Merge code from learning events

                /*scope.selectTab = function (index, tabLabel) {
                    scope.currentTab = index;
                    scope.$emit('changedTab', { 'tab': scope.currentTab, 'id': acnTab.id, 'tabLabel': tabLabel });
                    //adjust scroll
                    $timeout(function () {
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollBy(0, 0, false);
                    }, 50);

                    // Move horizontal scroll to selected tab
                    //if (shouldScroll) {
                    $timeout(function () {
                        // locate item to scroll
                        var left = 0;

                        if (index > 0) {
                            var scroll = angular.element(element.find('ion-scroll'));
                            var items = scroll.find('a');
                            for (var c = 0; c < index - 1; c++) {
                                left += items[c].offsetWidth;
                            }
                        }
                        $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll').scrollTo(left, 0, true);
                        $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll-fake').scrollTo(left, 0, true);
                    }, 100);
                    //}
                };*/

                scope.$on('changeTab', function (event, args) {
                    if (accTab.url == $location.url()) {
                        scope.selectTab(args.tab);
                    }
                });
                //#endregion

                //#region shrink functionality
                function buildTemplate() {
                    $http.get('lib/harmonizr/components/acc.tab.static.html').success(function (html) {
                        // remove tab content from html
                        var objectHtml = angular.element(html);
                        objectHtml.find('ion-list').remove();

                        // if exists -> remove
                        if (document.querySelector('#' + accTab.fakeId) != null) {
                            angular.element(document.querySelector('#' + accTab.fakeId)).remove();
                        }

                        // fake tab header
                        var fakeHeader = '<div id="' + accTab.fakeId + '" class="' + accTab.fakeTabClass + '" style="display:none; position: absolute;  top:' + accTab.top + 'px; width: 100%;"></div>';
                        angular.element(document.getElementsByTagName('body')).append(fakeHeader);
                        accTab.fakeTab = angular.element(document.getElementById(accTab.fakeId));

                        var html = objectHtml.html().replace('scroll-acc-tab-static-scroll', 'scroll-acc-tab-static-scroll-fake');

                        accTab.fakeTab.append($compile(html)(scope));
                    });
                }

                function addScrollEvent() {
                    // scroll event
                    accTab.content.bind('scroll', function (event) {
                        // if we detect that the position exceed the offset the header will change if apply
                        var shouldShrink = (event.detail.scrollTop >= accTab.offset);
                        var shouldNormal = (event.detail.scrollTop < accTab.offset);

                        if (!accTab.shrinked && shouldShrink) {
                            updateHeader(true);
                        }
                        else if (accTab.shrinked && shouldNormal) {
                            updateHeader(false);
                        }
                    });
                }

                function updateHeader(shrink) {
                    if (shrink) {
                        accTab.shrinked = true;
                        //accTab.fakeTab[0].querySelector('div.scroll').style.cssText = element[0].querySelector('div.scroll').style.cssText;
                        var position = $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll').getScrollPosition();
                        $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll-fake').scrollTo(position.left, 0, false);
                        accTab.fakeTab.css('display', '');
                    }
                    else {
                        accTab.shrinked = false;
                        //element[0].querySelector('div.scroll').style.cssText = accTab.fakeTab[0].querySelector('div.scroll').style.cssText;
                        var position = $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll-fake').getScrollPosition();
                        $ionicScrollDelegate.$getByHandle('scroll-acc-tab-static-scroll').scrollTo(position.left, 0, false);
                        accTab.fakeTab.css('display', 'none');
                    }
                }
                //#endregion

                $rootScope.$on('$ionicView.beforeLeave', function () {
                    if (accTab.url != $location.url()) {
                        if (accTab.fakeTab) {
                            //console.log('beforeLeave ' + accTab.url + '-' + $location.url());
                            accTab.fakeTab.css('display', 'none');
                        }
                    }
                });

                $rootScope.$on('$ionicView.beforeEnter', function () {
                    if (accTab.url == $location.url()) {
                        //console.log('beforeEnter ' + accTab.url + '-' + $location.url());
                        accTab.shrinked = false;
                        $ionicScrollDelegate.scrollBy(0, 0, false);
                    }
                });
            }
        }

    }]);

components.directive('acnTabStatic', ['$http', '$compile', '$state', '$rootScope', '$ionicScrollDelegate', '$timeout', '$location', '$ionicPosition',
    function ($http, $compile, $state, $rootScope, $ionicScrollDelegate, $timeout, $location, $ionicPosition) {

        return {
            restrict: 'E',
            templateUrl: 'lib/harmonizr/components/acn.tab.static.html',
            link: function (scope, element, attrs) {
                var acnTab = {
                    offset: (ionic.Platform.isIOS()) ? attrs.offset : parseInt(attrs.offset) + 20,
                    top: attrs.top,
                    shrinked: false,
                    fakeTabClass: 'fake-header',
                    fakeTab: null,
                    id: attrs.id,
                    fakeId: attrs.id + '_fake',
                    content: element.parent().parent(),
                    state: $state.current.name,
                    url: $location.url()
                };

                scope.tabStyle = { minHeight: (window.innerHeight - 170) + 'px' };

                //#region tab functionality
                function selectDefaultTab() {
                    // check view is cached
                    if ($state.params && $state.params.tab) {
                        scope.selectTab(parseInt($state.params.tab));
                    }
                    else {
                        scope.selectTab(0);
                    }
                }
                scope.$watch(attrs.tabs, function (result) {
                    if (result) {
                        scope.tabs = result;
                        acnTab.shrinked = false;
                        buildTemplate();
                        addScrollEvent();
                        selectDefaultTab();
                    }
                });
                scope.$watch(attrs.offset, function (result) {
                    if (result) {
                        acnTab.offset = (ionic.Platform.isIOS()) ? result : parseInt(result) + 20;
                    }
                });

                scope.selectTab = function (index) {
                    if (index == scope.currentTab) { return; }

                    scope.exit = true;

                    $ionicScrollDelegate.freezeScroll(true);
                    $ionicScrollDelegate.freezeScroll(false);
                    //adjust scroll
                    if (acnTab.shrinked) {
                        $ionicScrollDelegate.scrollTo(0, acnTab.offset, false);
                    }
                    $timeout(function () {
                        scope.exit = false;
                        scope.currentTab = index;
                        scope.$emit('changedTab', { 'tab': scope.currentTab, 'id': acnTab.id });
                        $ionicScrollDelegate.resize();
                    });

                    // Move horizontal scroll to selected tab
                    //if (shouldScroll) {
                    $timeout(function () {
                        // locate item to scroll
                        var left = 0;

                        if (index > 0) {
                            var scroll = angular.element(element.find('ion-scroll'));
                            var items = scroll.find('a');
                            for (var c = 0; c < index - 1; c++) {
                                left += items[c].offsetWidth;
                            }
                        }
                        $ionicScrollDelegate.$getByHandle('scroll-acn-tab-static-scroll').scrollTo(left, 0, true);
                        $ionicScrollDelegate.$getByHandle('scroll-acn-tab-static-scroll-fake').scrollTo(left, 0, true);
                    }, 100);
                    //}
                };

                scope.$on('changeTab', function (event, args) {
                    if (acnTab.url == $location.url()) {
                        scope.selectTab(args.tab);
                    }
                });
                //#endregion

                //#region shrink functionality
                function buildTemplate() {
                    $http.get('lib/harmonizr/components/acn.tab.static.html').success(function (html) {
                        // remove tab content from html
                        var objectHtml = angular.element(html);
                        objectHtml.find('ion-list').remove();

                        // if exists tab -> take it
                        if (document.getElementById(acnTab.fakeId) != null) {
                            angular.element(document.getElementById(acnTab.fakeId)).remove();
                        }

                        // fake tab header
                        var fakeHeader = '<div id="' + acnTab.fakeId + '" class="' + acnTab.fakeTabClass + '" style="display:none; position: absolute; top:' + acnTab.top + 'px; width: 100%;"></div>';
                        var current = element[0];
                        // Find ion-content to add item
                        while (current.tagName != 'ION-CONTENT') {
                            var aux = angular.element(current).parent();
                            if (aux.length > 0) {
                                current = aux[0];
                            }
                            else {
                                current = angular.element(document.getElementsByTagName('body'))[0];
                            }
                            if (current.tagName == 'BODY') { break; }
                        }
                        angular.element(current).prepend(fakeHeader);

                        acnTab.fakeTab = angular.element(document.getElementById(acnTab.fakeId));

                        var html = objectHtml.html().replace('scroll-acn-tab-static-scroll', 'scroll-acn-tab-static-scroll-fake');

                        acnTab.fakeTab.append($compile(html)(scope));
                    });
                }

                function addScrollEvent() {
                    // scroll event
                    acnTab.content.bind('scroll', function (event) {
                        // if we detect that the position exceed the offset the header will change if apply
                        var shouldShrink = (event.detail.scrollTop >= acnTab.offset);
                        var shouldNormal = (event.detail.scrollTop < acnTab.offset);

                        if (!acnTab.shrinked && shouldShrink) {
                            updateHeader(true);
                        }
                        else if (acnTab.shrinked && shouldNormal) {
                            updateHeader(false);
                        }
                    });
                }

                function updateHeader(shrink) {
                    if (shrink) {

                        acnTab.shrinked = true;
                        //acnTab.fakeTab[0].querySelector('div.scroll').style.cssText = element[0].querySelector('div.scroll').style.cssText;
                        var position = $ionicScrollDelegate.$getByHandle('scroll-acn-tab-static-scroll').getScrollPosition();
                        $ionicScrollDelegate.$getByHandle('scroll-acn-tab-static-scroll-fake').scrollTo(position.left, 0, false);
                        acnTab.fakeTab.css('display', '');
                    }
                    else {
                        acnTab.shrinked = false;
                        //element[0].querySelector('div.scroll').style.cssText = acnTab.fakeTab[0].querySelector('div.scroll').style.cssText;
                        var position = $ionicScrollDelegate.$getByHandle('scroll-acn-tab-static-scroll-fake').getScrollPosition();
                        $ionicScrollDelegate.$getByHandle('scroll-acn-tab-static-scroll').scrollTo(position.left, 0, false);
                        acnTab.fakeTab.css('display', 'none');
                    }
                }
                //#endregion

                $rootScope.$on('$ionicView.beforeEnter', function () {
                    if (acnTab.url == $location.url()) {
                        //console.log('beforeEnter ' + acnTab.url + '-' + $location.url());
                        acnTab.shrinked = false;
                        $ionicScrollDelegate.scrollBy(0, 0, false);
                    }
                });
            }
        }

    }]);

components.directive("tabSlideBoxHeader", ["$http", "$compile", "$ionicPosition", "$state", "$document", "$rootScope", "$ionicSlideBoxDelegate", "$ionicScrollDelegate", "$timeout", function ($http, $compile, $ionicPosition, $state, $document, $rootScope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout) {
    /*
     * Functionality: paint an ion-slide-box with a tab control, this control can remains static like a fake header when the vertical scroll exceeds 
     *                a certain point
     * Use: As element, tag, <tab-slide-box-header></tab-slide-box-header>
     * scope:
     *      - tabs: as array that contains information about the tabs saved in an object
     *      - currentTab: as a number indicates the active tab, by default in the beginning is the first tab (0), you can change this value adding 
     *        the parameter "tab" in your URL when you call to the view that contains this directive
     * Attributes:
     *      - tab-slide-box-header-template: not available for use the default template in "templates/tabSlideBoxHeader.html", another valid resource location
     *        for use a different template
     *      - tab-slide-box-header: the values accepted for this attribute are "false" if you don't want use the fake header, not available,
     *        empty or "true" indicates that the change occurs when the vertical scroll exceed the join point into the header (as ion-list) and the content,
     *        use another numeric value for increase or decrease this point, the fake header appears in the position calculated with this value
     *      - tab-slide-box-header-tabs: not available if you defined the tab control in the template, a valid array json value (you can use ' instead of ") 
     *        if you want define the "object" tabs as a parameter, for a template reuse, it will be included in the scope as "tabs"
     * Events:
     *      - changeTab with the new "tab" active value
    */
    return {
        restrict: "E",
        link: function ($scope, $element, attrs) {
            var position = 0;
            var $content = null;
            var firstTime = true;
            var showHeader = true;

            var className = "fake-header";
            var $tabSlideBoxHeader = null;
            var state = $state.current.name;

            var offset = attrs.tabSlideBoxHeader || "0";
            var tabsData = attrs.tabSlideBoxHeaderTabs || "[]";
            var template = attrs.tabSlideBoxHeaderTemplate || "templates/tabSlideBoxHeader.html";
            var id = className + "-" + $document[0].getElementsByClassName(className).length;

            $scope.currentTab = (($state.params && $state.params.tab) ? parseInt($state.params.tab) : 0);
            // booleans values in directive
            if (offset === "true" || offset === "false") { // true if you want show the header, false if you don't want
                showHeader = (offset === "false");
                offset = "0";
            }
            offset = parseInt(offset); // + $document[0].getElementsByClassName("fake-statusbar")[0].offsetHeight; // add fake status bar			
            // get template
            template = $http.get(template);

            function applyTemplate() {
                $element.append($compile(template)($scope));
                // create the fake header
                angular.element($document[0].getElementsByTagName("body")).append('<div id="' + id + '" class="' + className + '" style="position: absolute; display: none; top: 0px; width: 100%;"></div>');
                // save the fake tabs
                $tabSlideBoxHeader = angular.element($document[0].getElementById(id));
                $tabSlideBoxHeader.append($compile(template.replace("on-slide-changed", "data-fake"))($scope));
                $tabSlideBoxHeader.find("ion-slide").remove();
                $tabSlideBoxHeader.css("top", -offset + "px");
            }

            function showTabSlideBoxHeader(show) {

                if (!firstTime && showHeader) {
                    var $in = $tabSlideBoxHeader;
                    var $out = $element;
                    if (show) {
                        $tabSlideBoxHeader.css("display", "");
                    } else {
                        $in = $element;
                        $out = $tabSlideBoxHeader;
                        $tabSlideBoxHeader.css("display", "none");
                    }
                    $in[0].getElementsByTagName("tab-slide-box")[0].getElementsByClassName("scroll")[0].style["-webkit-transform"] = $out[0].getElementsByTagName("tab-slide-box")[0].getElementsByClassName("scroll")[0].style["-webkit-transform"];
                }
            }

            // search active content
            function searchContent(status) {
                var content = null;
                var contents = $document[0].getElementsByTagName("ion-content");

                for (var index = 0; index < contents.length; index++) {
                    if (contents[index].parentNode.getAttribute("nav-view") === status && ($content === null || $content[0] !== contents[index])) {
                        content = angular.element(contents[index]);
                        // calculate startY
                        var startY = $ionicPosition.position(content.find("div").eq(0).find("ion-list").eq(0).next()).top + offset;
                        // scroll event
                        content.on("scroll", function (evt) {
                            var newPosition = +!!(evt.detail.scrollTop >= startY);
                            if (newPosition !== position) {
                                position = newPosition;
                                showTabSlideBoxHeader(position !== 0);
                            }
                        });
                        break;
                    }
                }

                return (content || $content);
            }

            // create the tabs, apply the template
            $scope.tabs = JSON.parse(tabsData.replace(/'/g, '"'));
            $scope.onSlideMove = function (data) {

                // active correct tab
                if (showHeader) {
                    var aFake = $tabSlideBoxHeader.find("a");
                    for (var a = 0; a < aFake.length; a++) {
                        if (a !== data.index) {
                            aFake[a].classList.remove("active");
                        } else {
                            aFake[a].classList.add("active");
                        }
                    }
                    //console.log("You have selected " + data.index + " tab");
                }

                $scope.currentTab = data.index;
                $rootScope.$broadcast("changeTab", { "tab": data.index });
                $rootScope.$broadcast("autoplay");
                $timeout(function () {
                    $ionicScrollDelegate.resize();
                }, 50);
            };

            $scope.$on("$stateChangeSuccess", function (evt, to) {
                if (state === to.name) { // the current status
                    if (firstTime) {
                        if (showHeader) {
                            $content = searchContent("stage");
                        } else {
                            $content = [];
                        }

                        // load the template
                        template.success(function (html) {
                            template = html;
                        }).then(function (response) {
                            applyTemplate(); // insert the template

                            //$scope.onSlideMove({"index": $scope.currentTab, "change": true}); // default tab
                            $rootScope.$broadcast("changeTab", { "tab": $scope.currentTab });
                            firstTime = false;
                        });
                    }
                }
            });

            $rootScope.$on("$ionicView.enter", function () {
                if (state === $state.current.name) {
                    if (!firstTime && showHeader) {
                        var $backup = $content;
                        $content = searchContent("entering");
                        if ($backup !== $content) { // regenerate
                            position = 0;
                        }
                    }
                    showTabSlideBoxHeader(position !== 0);
                }
            });

            $rootScope.$on("$ionicView.beforeEnter", function () {
                if (state !== $state.current.name) {
                    showTabSlideBoxHeader(false);
                } else { // faster but no effect
                    showTabSlideBoxHeader(position !== 0);
                }
            });
        }
    };
}]);
//#endregion

//#region Compile & allow HTML
components.directive('compileTemplate', function ($compile, $parse) {
    return {
        link: function (scope, element, attr) {
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function () {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
});
//#endregion

// z index for modals
components.directive('accModalPriority', function ($ionicScrollDelegate, $ionicPosition) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.parent().parent().css('z-index', attrs.accModalPriority);
        }
    };
});
