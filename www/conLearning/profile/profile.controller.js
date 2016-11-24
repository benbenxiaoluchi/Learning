/*global controllers, ionic, angular, window*/

controllers.controller('profileController', ['$timeout', '$scope', '$ionicHistory', '$ionicModal', '$rootScope', 'profileService', '$ionicLoading', '$cordovaToast', '$window', 'connectedLearning.constants', '$stateParams', 'authService', 'environmentData', 'connectedLearning.methods','crittercismService','streamService', 'menuService','localStorageService', '$sce',
    function ($timeout, $scope, $ionicHistory, $ionicModal, $rootScope, profileService, $ionicLoading, $cordovaToast, $window, constants, $stateParams, authService, environmentData, methods, crittercismService, streamService, menuService, localStorageService, $sce) {

        $scope.peopleKey = $stateParams.peopleKey;
        $scope.enterpriseId = $stateParams.enterpriseId;

        $scope.getUserProfileInfo = function () {

            $scope.profilebase64 = undefined;

            $ionicLoading.show();

            $scope.profileInfo = {};
            $scope.professionalbio = '';
            $scope.title = $stateParams.title;
            $scope.date = $stateParams.date;
            if ($scope.date.length != 0 && $stateParams.location.length != 0) {
                if ($stateParams.location == 'USA - Q Center') {
                    $scope.secondTitle = 'St. Charles, From ' + $scope.date;
                } else if ($stateParams.location == 'Kuala Lumpur - Sheraton Imperial') {
                    $scope.secondTitle = 'Kuala Lumpur, From ' + $scope.date;
                } else if ($stateParams.location == 'SPP - Madrid High Performance Center') {
                    $scope.secondTitle = 'Madrid, From ' + $scope.date;
                } else if ($stateParams.location == 'India Learning Center - Bengaluru Marriott Hotel') {
                    $scope.secondTitle = 'Bengaluru, From ' + $scope.date;
                } else if ($stateParams.location == 'UIX - Wokefield Park') {
                    $scope.secondTitle = 'London, From ' + $scope.date;
                }
            }
            $scope.eidUseToFollow = $stateParams.enterpriseId;
            //Set the begaining status for the following button
            streamService.getFollowStatusModel($scope.eidUseToFollow).then(function (data) {
                if (data[0].isFollowing == 1) {
                    $scope.FollowIcon = {
                        "color": "#ff9900"
                    };
                } else {
                    $scope.FollowIcon = {
                    };
                };
                $scope.getFollowingStatus = data[0].isFollowing;
            }, function (data) {
                console.log("streamService.getFollowStatusModel:" + data);
            });

            //Get profile image
            var cached = localStorageService.get("ACLMOBILE_IMAGE_" + $stateParams.enterpriseId);
            if (cached == null || cached == "") {
                menuService.getProfileImageModel($stateParams.enterpriseId).then(function (data) {
                    $scope.imgReady = true;

                    $scope.profilebase64 = data[0].m_Uri;
                    localStorageService.set("ACLMOBILE_IMAGE_" + $stateParams.enterpriseId, data[0].m_Uri);
                    //$log.debug(data[0].m_Uri);
                    if ($scope.infoReady) {
                        $ionicLoading.hide();
                    }
                }, function (data) {
                    $scope.imgReady = true;
                    if ($scope.infoReady) {
                        $ionicLoading.hide();
                    }
                })
            }
            else {
                $scope.profilebase64 = cached;
                $scope.imgReady = true;
                if ($scope.infoReady) {
                    $ionicLoading.hide();
                }
            }
            //Get profile infomation
            var cachedInfo = localStorageService.get("ACLMOBILE_INFO_" + $stateParams.enterpriseId);
            if (cachedInfo == null || cachedInfo == "") {
                menuService.getProfileInfoModel($stateParams.enterpriseId, true).then(function (data) {
                    $scope.infoReady = true;
                    localStorageService.set("ACLMOBILE_INFO_" + $stateParams.enterpriseId, data);
                    parseUserInfo(data);
                    if ($scope.imgReady) {
                        $ionicLoading.hide();
                    }

                }, function (data, status) {
                    $scope.infoReady = true;
                    if ($scope.imgReady) {
                        $ionicLoading.hide();
                    }
                })
            }
            else {
                parseUserInfo(cachedInfo);
                $scope.infoReady = true;
                if ($scope.imgReady) {
                    $ionicLoading.hide();
                }
            }

        };

        var parseUserInfo = function (data) {

            $scope.infoReady = true;

            $scope.professionalbio = data["CupsProfile"][0].professionalbio;
            $scope.workemail = data["CupsProfile"][0].workemail;
            var sptr3 = "'";
            while ($scope.professionalbio.indexOf(sptr3) >= 0) {
                $scope.professionalbio = $scope.professionalbio.replace(sptr3, '"');
            }

            $scope.deliberatelyTrustDangerousSnippet = function () {
                return $sce.trustAsHtml($scope.professionalbio);
            };

            data["CupsProfile"][0].professionalbio = '';
            var out = JSON.stringify(data["CupsProfile"][0]);
            out = out.replace('sps-jobtitle', 'spsjobtitle');
            $scope.profileInfo = JSON.parse(out);
        };
        /// <summary>
        /// Controller that manages functionality related to profile and skills
        /// </summary>
        /// <param name="$scope">
        /// scope is an object that refers to the application model. It is an execution context for expressions.
        /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
        /// Scopes can watch expressions and propagate events.
        /// </param>
        /// <param name="$rootScope">Same kind as before but this it's common for all controllers.</param>
        /// <doc>connectedLearning.controllers:peopleProfileController</doc>

        'use strict';

        //#region Properties

        // Profile of user
        //$scope.userModel = profileService.getUserModel();
        //$scope.userData = $scope.userModel.profile;
        //$scope.userSkillsList=[];
        //$scope.userData;
        //$scope.peopleKey = $stateParams.peopleKey;
        //$scope.enterpriseId=$stateParams.enterpriseId
        //$scope.title = $stateParams.title;

        //$scope.offsetTab = 197;
        //$scope.offsetHeader = 197;

        //// Skills
        ////$scope.skillsModel = profileService.getSkillsModel();

        ////#region Actions

        //$scope.init = function () {
        //    /// <summary>
        //    /// Initializes the skills controller.
        //    /// </summary>
        //    /// <doc>connectedLearning.controllers:profileController#init</doc>

        //    authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getUserProfile, params: {peopleKey:$scope.peopleKey, enterpriseId: $scope.enterpriseId} }).then(function (data) {

        //        // store profile in the model
        //        $scope.userData = data;

        //        $scope.header = '<div><h3 class="title">' + $scope.userData.FirstName + ' ' + $scope.userData.LastName + '</h3></div>';

        //        if (window.currentEnvironment !== 'PROD') {
        //            //#region TEST IDS, REMOVE WHEN GO TO PROD

        //            if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman') {

        //                $scope.userModel.profile.StandardJobCode = '40001955';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel') {

        //                $scope.userModel.profile.StandardJobCode = '40001955';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jeffrey.t.vinkler') {

        //                $scope.userModel.profile.StandardJobCode = '40002666';
        //            }

        //            //#endregion

        //            //#region DEVELOPMENT TEST IDS - From rapidtestcl1 to rapidtestcl11
        //            if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'vivek.a.arora') {

        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'kshitij.sharma') {

        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'divya.x.ramachandran') {

        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'diego.lopez.simarro') {

        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'maria.alarcon.elipe') {

        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'Jesus.blanco') {

        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'pablo.a.hernandez') {

        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'francisco.j.lopez') {

        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'ken.corless') {

        //                $scope.userModel.profile.JobCd = '10000025';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'a.comstenla.alvarez') {

        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'gabriel.martin') {

        //                $scope.userModel.profile.JobCd = '10000025';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'azam.hashmi') {

        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jeffrey.t.vinkler') {

        //                $scope.userModel.profile.JobCd = '10000060';
        //            }
        //            //#endregion

        //            //#region UAT TESTING IDS - From rapidtestcl200  to rapidtestcl211
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'henry.pethybridge') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'georgina.mcelwee') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'Neetu.Rathi') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'puja.udhwani') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'shompa.bhattacharya') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'yasmin.sagadevan') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'erik.m.graser') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'parin.athota') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'sean.m.armstrong') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'travis.bowers') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'andrew.a.wong') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl212') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'allison.tilt') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'traci.f.mcgee') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rocio.munoz.garcia') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jean-baptiste.pery') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'piet-hein.goossens') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'fatma.chader') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'anthon.larsson') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'adrian.m.vasquez') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'adrian.p.lucio') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'aeron.luc.m.somera') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'aivee.m.o.madrelejos') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'freitzebelle.timbal') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'parag.pandit') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'bhaskar.vadakattu') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'dibya.susant.neogi') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'bejoy.daniel') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'j.bhattacharyya') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'remi.jullian') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'vidhya.sudha') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'b.velusamy') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'anusha.niveditha') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'v.vishnu') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'meenakshi.srivastava') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'a.sheoprasad.keshri') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'mahesh.r.shirure') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'priyanka.s.selukar') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'lavesh.khurana') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'sree.s.upadhyayula') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            //#endregion

        //            //#region PERFORMANCE TEST IDS - From rapidtestcl300 to rapidtestcl1000
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero') {
        //                $scope.userModel.profile.JobCd = '10000080';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar') {
        //                $scope.userModel.profile.JobCd = '10000100';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown') {
        //                $scope.userModel.profile.JobCd = '10000070';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa') {
        //                $scope.userModel.profile.JobCd = '10000090';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi') {
        //                $scope.userModel.profile.JobCd = '10000110';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva') {

        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
        //                || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora') {
        //                $scope.userModel.profile.JobCd = '10000120';
        //            }
        //            //#endregion
        //        }

        //        $scope.profile = $scope.userData.profile;

        //    }, function (error) {
        //        console.log(error);
        //        $scope.showLoading = false;
        //    });
        //    // get skills
        //    $scope.getUserSkills();
        //    // Set data
        //    //$scope.skillsModel.userSkills.list = $scope.userData.MyCVSkills;
        //};

        //$scope.getUserSkills = function () {
        //    /// <summary>
        //    /// Get the list of skills of the user.
        //    /// </summary>
        //    /// <doc>connectedLearning.controllers:profileController#getUserSkills</doc>

        //    // Start loading data
        //    $ionicLoading.show();

        //    var params = {
        //        peopleKey: $scope.peopleKey
        //    };

        //    // get the user skills
        //    authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getUserSkills, params: params }).then(function (data) {

        //        // End loading data
        //        $ionicLoading.hide();

        //        // Set data
        //        $scope.userSkillsList = data;

        //    }, function (error) {
        //        console.log(error);
        //        // End loading data
        //        $ionicLoading.hide();
        //    });
        //};

        //$scope.getProficiency = function (userProficiency) {

        //    var prof = 0;

        //    if (userProficiency.indexOf('P0 -') >= 0) {
        //        prof = 1;
        //    }
        //    else if (userProficiency.indexOf('P1 -') >= 0) {
        //        prof = 2;
        //    }
        //    else if (userProficiency.indexOf('P2 -') >= 0) {
        //        prof = 3;
        //    }
        //    else if (userProficiency.indexOf('P3 -') >= 0) {
        //        prof = 4;
        //    }
        //    else if (userProficiency.indexOf('P4 -') >= 0) {
        //        prof = 5;
        //    }

        //    return prof;
        //};

        //#endregion





        

        ////#region New Tabs Management
        //$timeout(function () {
        //    $scope.myTabs = [
        //        { text: 'Profile', icon: 'acc-user2-o', template: 'conLearning/profile/profile/tab.profile.html' },
        //        { text: 'Skills', icon: 'acc-skill', template: 'conLearning/profile/skills/tab.skills.html' }
        //    ];
        //}, 300);

        ////#endregion

        ////#region init

        //$scope.init();

        ////#endregion

    }]);