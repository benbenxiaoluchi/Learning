controllers.controller('newPostController',
    ['$scope', '$rootScope', '$ionicModal', '$timeout', '$ionicLoading', '$ionicPopup', '$cordovaCamera', '$filter', 'streamService', 'connectedLearning.methods', 'environmentData',
    function ($scope, $rootScope, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $cordovaCamera, $filter, streamService, methods, environment) {
        //#region Properties
        $scope.article = {
            comment: '',
            people: [],
            hashtag: '',
            image: ''
        };
        //#endregion

        //#region Actions
        $scope.init = function () {
            $scope.clear();
        };
        $scope.postArticle = function () {
            // validate at least comment or image is filled
            if (methods.isEmptyOrNull($scope.article.comment) && methods.isEmptyOrNull($scope.article.image)) {
                return;
            }
            
            $ionicLoading.show();

            // Add discussion hashtag
            //$scope.article.hashtag += ' ';

            // upload image
            if (!methods.isEmptyOrNull($scope.article.image)) {
                streamService.upload($scope.article.image).then(
                    function (data) {
                        // Fill comment
                        article = $scope.article.comment + ' ' + managePeople($scope.article.people) + ' ' + manageHashtag($scope.article.hashtag) + ' ' + data;
                        $scope.post(article);
                    },
                    function (error) {
                        $ionicLoading.hide();
                        console.log(error);
                    }
                );
            }
            else {
                // Fill comment
                article = $scope.article.comment + ' ' + managePeople($scope.article.people) + ' ' + manageHashtag($scope.article.hashtag);
                $scope.post(article);
            }
        };

        $scope.post = function(article) {
            streamService.post($rootScope.circleId, article).then(
                function (data) {
                    $ionicLoading.hide();
                    $scope.closeNewPost();
                    $scope.$emit('post-created');
                    $scope.showConfirmPostPopup();
                },
                function (error) {
                    $ionicLoading.hide();
                    console.log(error);
                }
            );
        };
        $scope.clear = function () {
            $scope.article.comment = '';
            $scope.article.people = [];
            $scope.article.hashtag = '';
            $scope.article.image = '';
        }
        $scope.closeNewPost = function () {
            $scope.clear();
            $scope.closeNewArticle();
        };
        $scope.showConfirmPostPopup = function(){
            var myPopup = $ionicPopup.show({
                cssClass: 'publish-popup',
                template: '<div class="published-popup"><i class="acc-check"></i><h2 class="title">Published</h1></div>'
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 1500);
        };
        //#endregion

        //#region People Picker
        $scope.peoplePicker = {
            all: [],
            selected: [],
            search: '',
            loading: false
        };

        $ionicModal.fromTemplateUrl('conLearning/event/trainingDetail/tabs/stream/people-picker/people-picker-modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function (modal) {
            $scope.peoplepicker_modal = modal;
        });
        $scope.openPeoplePicker = function () {
            $scope.peoplePicker.selected = $scope.article.people;

            $scope.peoplePicker.all = [];
            $scope.peoplePicker.search = '';

            $scope.peoplepicker_modal.show();
        };
        $scope.closePeoplePicker = function () {
            $scope.peoplepicker_modal.hide();
        };
        $scope.setItemPeoplePicker = function (item) {
            item.isSelected = !item.isSelected;
            (item.isSelected) ? $scope.addItemtoList(item) : $scope.removeItemFromList(item);
        };
        $scope.addItemtoList = function (item) {
            $scope.peoplePicker.selected.push(item);
        };
        $scope.removeItemFromList = function (item) {
            index = -1;
            for (var c = 0; c < $scope.peoplePicker.selected.length; c++) {
                if ($scope.peoplePicker.selected[c].PeopleKey == item.PeopleKey) {
                    index = c;
                    break;
                }
            }
            if (index >= 0) {
                $scope.peoplePicker.selected.splice(index, 1);
            }
        };

        $scope.getSuggestions = function () {
            $scope.peoplePicker.loading = false;
            $ionicLoading.hide();
            $scope.peoplePicker.all = [];
            var params = { keyword: $scope.peoplePicker.search };
            if ($scope.peoplePicker.search.length > 2) {
                $ionicLoading.show({
                    templateUrl: 'popup.html', noBackdrop: true, hideOnStateChange: true, duration: 15000
                });
                $scope.peoplePicker.loading = true;
                streamService.getSuggestions(params.keyword).then(function (data) {
                    if (params.keyword === $scope.peoplePicker.search) {
                        $ionicLoading.hide();
                        $scope.peoplePicker.loading = false;
                        $scope.peoplePicker.all = data;
                        angular.forEach($scope.peoplePicker.all, function (person) {
                            var isSelected = ($filter('filter')($scope.peoplePicker.selected, { 'EnterpriseId': person.EnterpriseId })).length > 0;
                            person.isSelected = isSelected;
                        });
                    }
                }, function (error) {
                    $ionicLoading.hide();
                    $scope.peoplePicker.loading = false;
                });
            }
        };
        //#endregion

        //#region Init
        $scope.init();
        //#endregion

        //#region Private methods
        function managePeople(people) {
            var result = '';
            for (var c = 0; c < people.length; c++) {
                result += ' ' + '@' + people[c].EnterpriseId;
            }
            return result;
        }
        function manageHashtag(hashtag) {
            var result = '';
            var partial = [];

            // 1 replace '#'
            hashtag = hashtag.replace(/#/g, '*');
            // 2 replace 'bb' x 'b'
            hashtag = hashtag.replace(/  /g, '*');
            // split
            partial = hashtag.split('*');
            // Add hashtag
            for (var c = 0; c < partial.length; c++) {
                var trimmed = partial[c].trim();
                if (trimmed != '') {
                    if (trimmed.split(' ').length > 1) {
                        partial[c] = '#[' + partial[c] + ']';
                    } else {
                        partial[c] = '#' + partial[c];
                    }
                }
            }
            // merge
            result = partial.join(' ');

            return result;
        }
        //#endregion

        //#region Camera management
        $scope.takePicture = function (isPhotoFromCamera) {
            var options = {
                quality: '100',
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: (isPhotoFromCamera) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: '800',
                targetHeight: '500',
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.article.image = imageData;
            }, function (err) {
            });
        };
        //#endregion
    }]);