/*global controllers, ionic, angular, window*/

controllers.controller('homeController', ['$scope', '$ionicModal', '$ionicHistory', 'recommendationsService', '$rootScope', '$ionicLoading', '$cordovaToast', '$window', 'connectedLearning.constants', 'authService', 'environmentData', 'profileService', 'connectedLearning.methods', '$timeout', 'connectedLearning.messages', 'dateFilter', '$ionicScrollDelegate', 'crittercismService', '$sce',
    function ($scope, $ionicModal, $ionicHistory, recommendationsService, $rootScope, $ionicLoading, $cordovaToast, $window, constants, authService, environmentData, profileService, methods, $timeout, messagesService, dateFilter, $ionicScrollDelegate, crittercismService, $sce) {

        /// <summary>
        /// Controller that manages functionality related to skills functionality
        /// </summary>
        /// <param name="$scope">
        /// scope is an object that refers to the application model. It is an execution context for expressions.
        /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
        /// Scopes can watch expressions and propagate events.
        /// </param>
        /// <param name="$rootScope">Same kind as before but this it's common for all controllers.</param>
        /// <doc>connectedLearning.controllers:skillsController</doc>

        'use strict';

        //#region Properties

        // Recommendations
        $scope.itemsRecommendedModel = recommendationsService.getItemsRecommendedModel();
        $scope.skillsModel = profileService.getSkillsModel();
        $scope.selectedItem = {};

        $scope.userModel = profileService.getUserModel();
        $scope.profile = {};
        $scope.settings = {
            haveSeenTutorial: false,
            haveSeenRecommededSkills: false
        };

        $scope.showLoading = false;  // hide the 'loading...' page
        // $scope.showLoading = true;
        $scope.showSkillsMessage = false;

        $scope.deviceHeight = window.innerHeight;

        $scope.moreRecommendationsType = 0;
        $scope.moreRecommendationsTitle = "";

        $scope.header = '<div><h3 class="title">Learn</h3></div>';

        $scope.initLoader = true;
        $scope.finishLoadActionPlan = false;
        $scope.finishLoadLearnings = false;
        $scope.finishLoadCommunities = false;
        $scope.finishLoadPYMK = false;
        $scope.finishLoadPositions = false;
        $scope.finishLoadAssignments = false;

        //#endregion

        //#region Local Functions

        // Check if all skills in followed skills are invalid
        function checkAllInvalidSkills() {

            var i = 0, allInvalid = true;
            for (i = 0; i < $scope.skillsModel.followSkills.list.length; i++) {

                if ($scope.skillsModel.followSkills.list[i].IsActive) {
                    allInvalid = false;
                }

            }

            return allInvalid;
        }

        //#endregion

        //#region Actions

        $scope.abreWindow = function (type) {

            var url = $scope.selectedItem.URL;

            if (type === constants.recommendations.type.pymk) {
                crittercismService.beginTransaction('User_Activity_Click_Contact_People_Recommendations_Page');
                crittercismService.endTransaction('User_Activity_Click_Contact_People_Recommendations_Page');
                url = environmentData.peopleUrl + $scope.selectedItem.EnterpriseID;
            }
            else if (type === constants.recommendations.type.board) {
                crittercismService.beginTransaction('User_Activity_Click_Follow_Board_Recommendations_Page');
                crittercismService.endTransaction('User_Activity_Click_Follow_Board_Recommendations_Page');                
            }
            else if (type === constants.recommendations.type.learning) {
                crittercismService.beginTransaction('User_Activity_Click_Register_Training_Recommendations_Page');
                crittercismService.endTransaction('User_Activity_Click_Register_Training_Recommendations_Page');
            }
            else if (type === constants.recommendations.type.community) {
                crittercismService.beginTransaction('User_Activity_Click_Join_Community_Recommendations_Page');
                crittercismService.endTransaction('User_Activity_Click_Join_Community_Recommendations_Page');
            }
            window.open(url, '_system'); return false;
        };

        $scope.applyItem = function (type) {

            var url = '';

            if (type === 'position') {
                crittercismService.beginTransaction('User_Activity_Click_Apply_Position_Recommendations_Page');
                crittercismService.endTransaction('User_Activity_Click_Apply_Position_Recommendations_Page');
                url = environmentData.acmURL + $scope.selectedPositionItem.PositionId;
            }
            else if (type === 'assignment') {
                crittercismService.beginTransaction('User_Activity_Click_Apply_Assignment_Recommendations_Page');
                crittercismService.endTransaction('User_Activity_Click_Apply_Assignment_Recommendations_Page');
                url = environmentData.mySchedulingURL + $scope.selectedAssignmentItem.Id;
            }

            window.open(url, '_system'); return false;
        };

        $scope.init = function () {
            /// <summary>
            /// Initializes the home controller.
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#init</doc>

            // get claims
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getClaims }).then(function (data) {

                // store the claims in the model
                $scope.userModel.claims.enterpriseId = methods.getPriorityField(data, 'enterpriseid');
                $scope.userModel.claims.peopleKey = methods.getPriorityField(data, 'peoplekey');

                // set user of crittercism
                crittercismService.setUsername($scope.userModel.claims.enterpriseId);

                if (window.currentEnvironment !== 'PROD') {
                    //#region DEVELOPMENT TEST IDS - From rapidtestcl1 to rapidtestcl11
                    if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl1') {

                        $scope.userModel.claims.enterpriseId = 'vivek.a.arora';
                        $scope.userModel.claims.peopleKey = '672502';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl2') {

                        $scope.userModel.claims.enterpriseId = 'kshitij.sharma';
                        $scope.userModel.claims.peopleKey = '628983';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl3') {

                        $scope.userModel.claims.enterpriseId = 'divya.x.ramachandran';
                        $scope.userModel.claims.peopleKey = '571643';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl4') {

                        $scope.userModel.claims.enterpriseId = 'diego.lopez.simarro';
                        $scope.userModel.claims.peopleKey = '205337';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl5') {

                        $scope.userModel.claims.enterpriseId = 'maria.alarcon.elipe';
                        $scope.userModel.claims.peopleKey = '466521';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl6') {

                        $scope.userModel.claims.enterpriseId = 'jesus.blanco';
                        $scope.userModel.claims.peopleKey = '351206';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl7') {

                        $scope.userModel.claims.enterpriseId = 'pablo.a.hernandez';
                        $scope.userModel.claims.peopleKey = '1135803';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl8') {

                        $scope.userModel.claims.enterpriseId = 'francisco.j.lopez';
                        $scope.userModel.claims.peopleKey = '99032';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl9') {

                        $scope.userModel.claims.enterpriseId = 'ken.corless';
                        $scope.userModel.claims.peopleKey = '77423';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl10') {

                        $scope.userModel.claims.enterpriseId = 'a.comstenla.alvarez';
                        $scope.userModel.claims.peopleKey = '324562';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl11') {

                        $scope.userModel.claims.enterpriseId = 'gabriel.martin';
                        $scope.userModel.claims.peopleKey = '70880';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl12') {

                        $scope.userModel.claims.enterpriseId = 'azam.hashmi';
                        $scope.userModel.claims.peopleKey = '455391';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtest171') {

                        $scope.userModel.claims.enterpriseId = 'jeffrey.t.vinkler';
                        $scope.userModel.claims.peopleKey = '418124';
                    }
                        //#endregion

                     //#region UAT TESTING IDS - From rapidtestcl200  to rapidtestcl211
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl200') {
                        $scope.userModel.claims.enterpriseId = 'henry.pethybridge';
                        $scope.userModel.claims.peopleKey = '965937';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl201') {
                        $scope.userModel.claims.enterpriseId = 'georgina.mcelwee';
                        $scope.userModel.claims.peopleKey = '965941';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl202') {
                        $scope.userModel.claims.enterpriseId = 'Neetu.Rathi';
                        $scope.userModel.claims.peopleKey = '1082899';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl203') {
                        $scope.userModel.claims.enterpriseId = 'puja.udhwani';
                        $scope.userModel.claims.peopleKey = '658584';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl204') {
                        $scope.userModel.claims.enterpriseId = 'shompa.bhattacharya';
                        $scope.userModel.claims.peopleKey = '50955';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl205') {
                        $scope.userModel.claims.enterpriseId = 'lauren.e.carpenter'; //No en People
                        $scope.userModel.claims.peopleKey = '261319';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl206') {
                        $scope.userModel.claims.enterpriseId = 'yasmin.sagadevan';
                        $scope.userModel.claims.peopleKey = '59896';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl207') {
                        $scope.userModel.claims.enterpriseId = 'erik.m.graser';
                        $scope.userModel.claims.peopleKey = '16910';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl208') {
                        $scope.userModel.claims.enterpriseId = 'parin.athota';
                        $scope.userModel.claims.peopleKey = '839763';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl209') {
                        $scope.userModel.claims.enterpriseId = 'sean.m.armstrong';
                        $scope.userModel.claims.peopleKey = '1201627';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl210') {
                        $scope.userModel.claims.enterpriseId = 'travis.bowers';
                        $scope.userModel.claims.peopleKey = '1182987';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl211') {
                        $scope.userModel.claims.enterpriseId = 'andrew.a.wong';
                        $scope.userModel.claims.peopleKey = '795899';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl212') {
                        $scope.userModel.claims.enterpriseId = 'sean.m.armstrong';//No en People
                        $scope.userModel.claims.peopleKey = '1201627';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl213') {
                        $scope.userModel.claims.enterpriseId = 'allison.tilt';//No en People
                        $scope.userModel.claims.peopleKey = '1207586';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl214') {
                        $scope.userModel.claims.enterpriseId = 'traci.f.mcgee';//No en People
                        $scope.userModel.claims.peopleKey = '1198747';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl215') {
                        $scope.userModel.claims.enterpriseId = 'rocio.munoz.garcia';
                        $scope.userModel.claims.peopleKey = '196236';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl216') {
                        $scope.userModel.claims.enterpriseId = 'jean-baptiste.pery';
                        $scope.userModel.claims.peopleKey = '286442';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl217') {
                        $scope.userModel.claims.enterpriseId = 'piet-hein.goossens';
                        $scope.userModel.claims.peopleKey = '296627';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl218') {
                        $scope.userModel.claims.enterpriseId = 'fatma.chader';
                        $scope.userModel.claims.peopleKey = '327891';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl219') {
                        $scope.userModel.claims.enterpriseId = 'anthon.larsson';
                        $scope.userModel.claims.peopleKey = '421484';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl220') {
                        $scope.userModel.claims.enterpriseId = 'adrian.m.vasquez';
                        $scope.userModel.claims.peopleKey = '1260692';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl221') {
                        $scope.userModel.claims.enterpriseId = 'adrian.p.lucio';
                        $scope.userModel.claims.peopleKey = '1236411';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl222') {
                        $scope.userModel.claims.enterpriseId = 'aeron.luc.m.somera';
                        $scope.userModel.claims.peopleKey = '1223285';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl223') {
                        $scope.userModel.claims.enterpriseId = 'aivee.m.o.madrelejos';
                        $scope.userModel.claims.peopleKey = '1243890';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl224') {
                        $scope.userModel.claims.enterpriseId = 'freitzebelle.timbal';
                        $scope.userModel.claims.peopleKey = '1201048';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl225') {
                        $scope.userModel.claims.enterpriseId = 'parag.pandit';
                        $scope.userModel.claims.peopleKey = '419131';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl226') {
                        $scope.userModel.claims.enterpriseId = 'bhaskar.vadakattu';
                        $scope.userModel.claims.peopleKey = '556683';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl227') {
                        $scope.userModel.claims.enterpriseId = 'dibya.susant.neogi';
                        $scope.userModel.claims.peopleKey = '335910';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl228') {
                        $scope.userModel.claims.enterpriseId = 'bejoy.daniel';
                        $scope.userModel.claims.peopleKey = '315223';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl229') {
                        $scope.userModel.claims.enterpriseId = 'j.bhattacharyya';
                        $scope.userModel.claims.peopleKey = '272101';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl230') {
                        $scope.userModel.claims.enterpriseId = 'remi.jullian';
                        $scope.userModel.claims.peopleKey = '648543';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl231') {
                        $scope.userModel.claims.enterpriseId = 'vidhya.sudha';
                        $scope.userModel.claims.peopleKey = '558840';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl232') {
                        $scope.userModel.claims.enterpriseId = 'b.velusamy';
                        $scope.userModel.claims.peopleKey = '1262892';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl233') {
                        $scope.userModel.claims.enterpriseId = 'anusha.niveditha';
                        $scope.userModel.claims.peopleKey = '1282153';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl234') {
                        $scope.userModel.claims.enterpriseId = 'v.vishnu';
                        $scope.userModel.claims.peopleKey = '1208780';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl235') {
                        $scope.userModel.claims.enterpriseId = 'meenakshi.srivastava';
                        $scope.userModel.claims.peopleKey = '724064';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl236') {
                        $scope.userModel.claims.enterpriseId = 'a.sheoprasad.keshri';
                        $scope.userModel.claims.peopleKey = '899720';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl237') {
                        $scope.userModel.claims.enterpriseId = 'mahesh.r.shirure';
                        $scope.userModel.claims.peopleKey = '1206329';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl238') {
                        $scope.userModel.claims.enterpriseId = 'priyanka.s.selukar';
                        $scope.userModel.claims.peopleKey = '963403';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl239') {
                        $scope.userModel.claims.enterpriseId = 'lavesh.khurana';
                        $scope.userModel.claims.peopleKey = '1106153';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl240') {
                        $scope.userModel.claims.enterpriseId = 'sree.s.upadhyayula';
                        $scope.userModel.claims.peopleKey = '1157447';
                    }
                        //#endregion

                     //#region PERFORMANCE TEST IDS - From rapidtestcl300 to rapidtestcl1000
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl300'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl301'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl302'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl303'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl304'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl305'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl306'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl307'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl308'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl309'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl310'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl311'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl312'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl313'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl314'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl315'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl316'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl317'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl318'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl319'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl320'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl321'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl322'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl323') {
                        $scope.userModel.claims.enterpriseId = 'alex.h.irvine';
                        $scope.userModel.claims.peopleKey = '153667';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl324'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl325'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl326'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl327'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl328'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl329'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl330'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl331'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl332'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl333'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl334'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl335'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl336'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl337'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl338'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl339'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl340'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl341'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl342'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl343'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl344'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl345'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl346'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl347') {
                        $scope.userModel.claims.enterpriseId = 'lauren.e.carpenter';
                        $scope.userModel.claims.peopleKey = '261319';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl348'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl349'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl350'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl351'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl352'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl353'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl354'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl355'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl356'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl357'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl358'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl359'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl360'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl361'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl362'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl363'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl364'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl365'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl366'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl367'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl368'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl369'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl370'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl371') {
                        $scope.userModel.claims.enterpriseId = 'colin.a.johnson';
                        $scope.userModel.claims.peopleKey = '153696';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl372'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl373'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl374'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl375'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl376'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl377'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl378'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl379'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl380'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl381'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl382'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl383'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl384'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl385'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl386'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl387'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl388'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl389'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl390'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl391'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl392'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl393'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl394'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl395') {
                        $scope.userModel.claims.enterpriseId = 'stanislava.gmucova';
                        $scope.userModel.claims.peopleKey = '93749';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl396'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl397'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl398'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl399'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl400'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl401'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl402'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl403'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl404'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl405'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl406'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl407'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl408'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl409'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl410'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl411'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl412'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl413'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl414'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl415'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl416'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl417'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl418'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl419') {
                        $scope.userModel.claims.enterpriseId = 'ignacio.r.angeloni';
                        $scope.userModel.claims.peopleKey = '157171';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl420'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl421'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl422'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl423'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl424'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl425'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl426'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl427'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl428'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl429'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl430'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl431'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl432'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl433'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl434'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl435'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl436'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl437'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl438'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl439'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl440'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl441'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl442'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl443') {
                        $scope.userModel.claims.enterpriseId = 'jorge.ivan.moreno';
                        $scope.userModel.claims.peopleKey = '969545';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl444'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl445'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl446'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl447'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl448'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl449'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl450'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl451'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl452'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl453'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl454'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl455'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl456'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl457'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl458'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl459'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl460'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl461'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl462'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl463'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl464'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl465'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl466'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl467') {
                        $scope.userModel.claims.enterpriseId = 'paulo.s.de.franca';
                        $scope.userModel.claims.peopleKey = '1120738';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl468'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl469'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl470'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl471'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl472'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl473'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl474'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl475'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl476'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl477'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl478'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl479'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl480'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl481'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl482'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl483'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl484'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl485'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl486'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl487'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl488'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl489'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl490'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl491') {
                        $scope.userModel.claims.enterpriseId = 'd.ramirez.alcala';
                        $scope.userModel.claims.peopleKey = '1162732';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl492'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl493'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl494'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl495'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl496'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl497'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl498'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl499'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl500'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl501'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl502'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl503'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl504'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl505'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl506'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl507'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl508'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl509'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl510'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl511'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl512'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl513'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl514'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl515') {
                        $scope.userModel.claims.enterpriseId = 'cathy.coleman';
                        $scope.userModel.claims.peopleKey = '965948';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl516'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl517'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl518'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl519'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl520'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl521'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl522'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl523'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl524'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl525'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl526'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl527'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl528'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl529'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl530'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl531'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl532'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl533'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl534'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl535'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl536'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl537'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl538'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl539'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl540'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl541'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl542'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl543'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl544'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl545'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl546'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl547'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl548'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl549'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl550'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl551'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl552'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl553'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl554'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl555'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl556'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl557'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl558'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl559'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl560'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl561'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl562'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl563'){
                        $scope.userModel.claims.enterpriseId = 'jonathan.steel';
                        $scope.userModel.claims.peopleKey = '965974';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl564'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl565'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl566'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl567'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl568'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl569'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl570'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl571'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl572'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl573'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl574'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl575'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl576'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl577'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl578'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl579'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl580'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl581'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl582'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl583'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl584'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl585'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl586'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl587') {
                        $scope.userModel.claims.enterpriseId = 'sreechand.nambiar';
                        $scope.userModel.claims.peopleKey = '504099';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl588'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl589'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl590'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl591'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl592'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl593'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl594'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl595'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl596'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl597'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl598'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl599'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl600'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl601'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl602'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl603'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl604'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl605'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl606'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl607'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl608'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl609'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl610'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl611') {
                        $scope.userModel.claims.enterpriseId = 'gloria.montero';
                        $scope.userModel.claims.peopleKey = '20257';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl612'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl613'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl614'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl615'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl616'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl617'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl618'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl619'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl620'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl621'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl622'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl623'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl624'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl625'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl626'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl627'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl628'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl629'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl630'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl631'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl632'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl633'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl634'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl635') {
                        $scope.userModel.claims.enterpriseId = 'a.bernal.rodriguez';
                        $scope.userModel.claims.peopleKey = '1168627';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl636'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl637'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl638'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl639'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl640'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl641'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl642'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl643'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl644'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl645'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl646'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl647'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl648'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl649'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl650'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl651'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl652'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl653'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl654'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl655'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl656'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl657'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl658'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl659') {
                        $scope.userModel.claims.enterpriseId = 'claudia.cerino';
                        $scope.userModel.claims.peopleKey = '307609';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl660'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl661'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl662'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl663'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl664'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl665'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl666'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl667'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl668'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl669'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl670'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl671'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl672'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl673'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl674'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl675'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl676'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl677'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl678'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl679'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl680'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl681'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl682'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl683') {
                        $scope.userModel.claims.enterpriseId = 'r.vazquez.vilar';
                        $scope.userModel.claims.peopleKey = '325210';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl684'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl685'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl686'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl687'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl688'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl689'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl690'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl691'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl692'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl693'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl694'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl695'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl696'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl697'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl698'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl699'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl700'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl701'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl702'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl703'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl704'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl705'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl706'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl707') {
                        $scope.userModel.claims.enterpriseId = 'tatiele.kist';
                        $scope.userModel.claims.peopleKey = '311274';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl708'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl709'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl710'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl711'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl712'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl713'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl714'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl715'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl716'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl717'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl718'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl719'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl720'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl721'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl722'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl723'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl724'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl725'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl726'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl727'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl728'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl729'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl730'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl731') {
                        $scope.userModel.claims.enterpriseId = 'norbert.sommer';
                        $scope.userModel.claims.peopleKey = '667440';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl732'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl733'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl734'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl735'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl736'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl737'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl738'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl739'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl740'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl741'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl742'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl743'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl744'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl745'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl746'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl747'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl748'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl749'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl750'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl751'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl752'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl753'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl754'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl755') {
                        $scope.userModel.claims.enterpriseId = 'wendie.krauth';
                        $scope.userModel.claims.peopleKey = '647605';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl756'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl757'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl758'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl759'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl760'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl761'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl762'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl763'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl764'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl765'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl766'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl767'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl768'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl769'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl770'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl771'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl772'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl773'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl774'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl775'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl776'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl777'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl778'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl779') {
                        $scope.userModel.claims.enterpriseId = 'mili.chopra';
                        $scope.userModel.claims.peopleKey = '649298';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl780'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl781'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl782'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl783'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl784'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl785'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl786'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl787'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl788'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl789'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl790'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl791'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl792'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl793'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl794'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl795'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl796'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl797'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl798'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl799'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl800'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl801'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl802'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl803') {
                        $scope.userModel.claims.enterpriseId = 'daniel.j.brown';
                        $scope.userModel.claims.peopleKey = '577572';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl804'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl805'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl806'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl807'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl808'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl809'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl810'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl811'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl812'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl813'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl814'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl815'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl816'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl817'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl818'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl819'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl820'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl821'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl822'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl823'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl824'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl825'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl826'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl827') {
                        $scope.userModel.claims.enterpriseId = 'raphael.costa';
                        $scope.userModel.claims.peopleKey = '650406';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl828'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl829'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl830'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl831'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl832'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl833'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl834'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl835'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl836'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl837'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl838'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl839'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl840'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl841'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl842'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl843'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl844'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl845'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl846'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl847'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl848'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl849'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl850'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl851') {
                        $scope.userModel.claims.enterpriseId = 'patricio.cassanelli';
                        $scope.userModel.claims.peopleKey = '969185';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl852'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl853'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl854'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl855'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl856'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl857'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl858'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl859'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl860'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl861'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl862'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl863'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl864'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl865'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl866'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl867'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl868'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl869'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl870'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl871'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl872'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl873'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl874'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl875') {
                        $scope.userModel.claims.enterpriseId = 'pavithra.elangovan';
                        $scope.userModel.claims.peopleKey = '895430';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl876'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl877'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl878'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl879'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl880'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl881'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl882'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl883'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl884'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl885'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl886'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl887'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl888'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl889'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl890'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl891'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl892'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl893'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl894'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl895'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl896'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl897'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl898'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl899') {
                        $scope.userModel.claims.enterpriseId = 'facundo.g.miguel';
                        $scope.userModel.claims.peopleKey = '969210';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl900'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl901'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl902'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl903'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl904'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl905'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl906'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl907'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl908'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl909'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl910'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl911'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl912'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl913'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl914'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl915'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl916'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl917'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl918'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl919'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl920'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl921'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl922'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl923') {
                        $scope.userModel.claims.enterpriseId = 'aravindh.ganapathi';
                        $scope.userModel.claims.peopleKey = '895432';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl924'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl925'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl926'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl927'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl928'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl929'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl930'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl931'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl932'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl933'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl934'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl935'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl936'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl937'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl938'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl939'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl940'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl941'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl942'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl943'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl944'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl945'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl946'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl947') {

                        $scope.userModel.claims.enterpriseId = 'mariano.s.silva';
                        $scope.userModel.claims.peopleKey = '969229';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl948'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl949'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl950'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl951'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl952'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl953'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl954'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl955'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl956'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl957'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl958'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl959'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl960'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl961'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl962'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl963'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl964'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl965'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl966'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl967'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl968'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl969'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl970'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl971') {
                        $scope.userModel.claims.enterpriseId = 'c.nicolas.pablo';
                        $scope.userModel.claims.peopleKey = '969230';
                    }
                    else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl972'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl973'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl974'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl975'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl976'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl977'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl978'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl979'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl980'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl981'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl982'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl983'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl984'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl985'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl986'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl987'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl988'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl989'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl990'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl991'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl992'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl993'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl994'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl995'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl996'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl997'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl998'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl999'
                    || $scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl1000') {
                        $scope.userModel.claims.enterpriseId = 'samara.i.zamora';
                        $scope.userModel.claims.peopleKey = '969447';
                    }
                    //#endregion
                }

                // Get profile from appification service
                authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getUserProfile, params: {peopleKey:profileService.getPeopleKey(), enterpriseId: $scope.userModel.claims.enterpriseId} }).then(function (data) {

                    // store profile in the model
                    $scope.userModel.profile = data;                    

                    if (window.currentEnvironment !== 'PROD') {
                        //#region TEST IDS, REMOVE WHEN GO TO PROD

                        if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman') {

                            $scope.userModel.profile.StandardJobCode = '40001955';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel') {

                            $scope.userModel.profile.StandardJobCode = '40001955';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jeffrey.t.vinkler') {

                            $scope.userModel.profile.StandardJobCode = '40002666';
                        }

                        //#endregion

                        //#region DEVELOPMENT TEST IDS - From rapidtestcl1 to rapidtestcl11
                        if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'vivek.a.arora') {

                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'kshitij.sharma') {

                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'divya.x.ramachandran') {

                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'diego.lopez.simarro') {

                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'maria.alarcon.elipe') {

                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'Jesus.blanco') {

                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'pablo.a.hernandez') {

                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'francisco.j.lopez') {

                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'ken.corless') {

                            $scope.userModel.profile.JobCd = '10000025';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'a.comstenla.alvarez') {

                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'gabriel.martin') {

                            $scope.userModel.profile.JobCd = '10000025';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'azam.hashmi') {

                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jeffrey.t.vinkler') {

                            $scope.userModel.profile.JobCd = '10000060';
                        }
                            //#endregion

                            //#region UAT TESTING IDS - From rapidtestcl200  to rapidtestcl211
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'henry.pethybridge') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'georgina.mcelwee') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'Neetu.Rathi') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'puja.udhwani') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'shompa.bhattacharya') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'yasmin.sagadevan') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'erik.m.graser') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'parin.athota') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'sean.m.armstrong') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'travis.bowers') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'andrew.a.wong') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rapidtestcl212') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'allison.tilt') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'traci.f.mcgee') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'rocio.munoz.garcia') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jean-baptiste.pery') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'piet-hein.goossens') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'fatma.chader') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'anthon.larsson') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'adrian.m.vasquez') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'adrian.p.lucio') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'aeron.luc.m.somera') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'aivee.m.o.madrelejos') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'freitzebelle.timbal') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'parag.pandit') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'bhaskar.vadakattu') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'dibya.susant.neogi') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'bejoy.daniel') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'j.bhattacharyya') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'remi.jullian') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'vidhya.sudha') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'b.velusamy') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'anusha.niveditha') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'v.vishnu') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'meenakshi.srivastava') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'a.sheoprasad.keshri') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'mahesh.r.shirure') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'priyanka.s.selukar') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'lavesh.khurana') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'sree.s.upadhyayula') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                            //#endregion

                            //#region PERFORMANCE TEST IDS - From rapidtestcl300 to rapidtestcl1000
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'alex.h.irvine') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'lauren.e.carpenter') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'colin.a.johnson') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'stanislava.gmucova') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'ignacio.r.angeloni') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jorge.ivan.moreno') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca'
                            || $scope.userModel.claims.enterpriseId.toLowerCase() === 'paulo.s.de.franca') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'd.ramirez.alcala') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'cathy.coleman') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'jonathan.steel') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'sreechand.nambiar') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'gloria.montero') {
                            $scope.userModel.profile.JobCd = '10000080';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'a.bernal.rodriguez') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'claudia.cerino') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'r.vazquez.vilar') {
                            $scope.userModel.profile.JobCd = '10000100';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'tatiele.kist') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'norbert.sommer') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'wendie.krauth') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mili.chopra') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'daniel.j.brown') {
                            $scope.userModel.profile.JobCd = '10000070';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'raphael.costa') {
                            $scope.userModel.profile.JobCd = '10000090';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'patricio.cassanelli') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'pavithra.elangovan') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'facundo.g.miguel') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'aravindh.ganapathi') {
                            $scope.userModel.profile.JobCd = '10000110';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'mariano.s.silva') {

                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'c.nicolas.pablo') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        else if ($scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora'
                        || $scope.userModel.claims.enterpriseId.toLowerCase() === 'samara.i.zamora') {
                            $scope.userModel.profile.JobCd = '10000120';
                        }
                        //#endregion
                    }

                    $scope.profile = $scope.userModel.profile;

                    // Get user settings from connected learning service
                    authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getUserSettings, params: { peopleKey: profileService.getPeopleKey() } }).then(function (data) {

                        $scope.settings.haveSeenTutorial = data.HaveSeenTutorial;
                        $scope.settings.haveSeenRecommededSkills = data.HaveSeenRecommendedSkills;

                        messagesService.broadcast(constants.broadcast.updateBaseController, { profile: $scope.profile, haveSeenTutorial: $scope.settings.haveSeenTutorial, haveSeenRecommededSkills: $scope.settings.haveSeenRecommededSkills });

                        $scope.getActionPlan();

                        // once loaded, go to tutorial, skills recommended or stay in home page
                        $timeout(function () {

                            // Start loading data
                            $scope.initLoader = true;
                            $ionicLoading.show();

                            var params = {
                                peopleKey: profileService.getPeopleKey(),
                                roleId: profileService.getRoleId(),
                                careerLevel: profileService.getCareerLevel()
                            };

                            // get top skills
                            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: profileService.getTopSkills, params: params }).then(function (data) {

                                // Set data
                                $scope.skillsModel.followSkills.list = data.FollowSkillList;
                                $scope.skillsModel.topSkills.list = data.RecSkillList;

                                // $scope.recom

                                $scope.getRecommendations(false, false);

                            }, function (error) {
                                console.log(error);
                                
                                $scope.getRecommendations(false, false);
                            });                            

                            if (!$scope.settings.haveSeenTutorial) {
                                $scope.navigateToState('app.tutorial');
                            }
                            else if (!$scope.settings.haveSeenRecommededSkills) {
                                $scope.navigateToState('app.skillsRecommended');
                            }

                        });

                        $scope.showLoading = false;

                    }, function (error) {
                        console.log(error);
                        $scope.showLoading = false;
                    });

                }, function (error) {
                    console.log(error);
                    $scope.showLoading = false;
                });

            }, function (error) {
                console.log(error);
                $scope.showLoading = false;
            });

        };

        $scope.getActionPlan = function () {

            // Get users action plan
            authService.callService({ serviceName: environmentData.services.actionPlanService.serviceName, action: profileService.getActionPlan, params: { peopleKey: profileService.getPeopleKey() } }).then(function (data) {

                // set action plan data
                $scope.userModel.actionPlan = data.value;

                $scope.finishLoadActionPlan = true;

                $scope.checkRecommendationsInActionPlan();

            }, function (error) {
                console.log(error);
                $scope.showLoading = false;
            });
        };

        $scope.checkRecommendationsInActionPlan = function () {
            /// <summary>
            /// Once action plan is loaded, check if the recommendations are loaded and update "inActionPlan" field
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#checkRecommendationsInActionPlan</doc>

            var i = 0;

            // if learnings are loaded, then check if items are in action plan
            if ($scope.finishLoadLearnings) {                
                for (i = 0; i < $scope.itemsRecommendedModel.learnings.list.length; i++) {
                    $scope.itemsRecommendedModel.learnings.list[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, $scope.itemsRecommendedModel.learnings.list[i].ID);
                }

                for (i = 0; i < $scope.itemsRecommendedModel.learningBoards.list.length; i++) {
                    $scope.itemsRecommendedModel.learningBoards.list[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, $scope.itemsRecommendedModel.learningBoards.list[i].ID);
                }
            }
            // if communities are loaded, then check if items are in action plan
            if ($scope.finishLoadCommunities) {
                for (i = 0; i < $scope.itemsRecommendedModel.communities.list.length; i++) {
                    $scope.itemsRecommendedModel.communities.list[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, $scope.itemsRecommendedModel.communities.list[i].ID);
                }
            }
            // if pymk are loaded, then check if items are in action plan
            if ($scope.finishLoadPYMK) {
                for (i = 0; i < $scope.itemsRecommendedModel.pymk.list.length; i++) {
                    $scope.itemsRecommendedModel.pymk.list[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, $scope.itemsRecommendedModel.pymk.list[i].PeopleKey.toString());
                }
            }
            // if assignments are loaded, then check if items are in action plan
            if ($scope.finishLoadAssignments) {
                for (i = 0; i < $scope.itemsRecommendedModel.mySchedulingAssignments.list.length; i++) {
                    $scope.itemsRecommendedModel.mySchedulingAssignments.list[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, $scope.itemsRecommendedModel.mySchedulingAssignments.list[i].Id.toString());
                }
            }
            // if positions are loaded, then check if items are in action plan
            if ($scope.finishLoadPositions) {
                for (i = 0; i < $scope.itemsRecommendedModel.acmPositions.list.length; i++) {
                    $scope.itemsRecommendedModel.acmPositions.list[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, $scope.itemsRecommendedModel.acmPositions.list[i].PositionId);
                }
            }
        };
        

        $scope.getRecommendations = function (loadMore, killCache) {
            /// <summary>
            /// Get recommended items (trainings, communities, pymk, assignments and positions)
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getRecommendations</doc>

            $scope.showSkillsMessage = $scope.skillsModel.followSkills.list.length === 0;

            // get learnings
            $scope.getRecommendedLearnings(loadMore, killCache);
            // get communities
            $scope.getRecommendedCommunities(loadMore, killCache);
            // get pymk
            $scope.getRecommendedPYMK(loadMore, killCache);
            // get open assignments
            $scope.getMySchedulingAssignments(loadMore, killCache);
            // get open positions
            $scope.getACMPositions(loadMore, killCache);
        };

        //#region Recommended Items

        $scope.getRecommendedLearnings = function (loadMore, killCache) {
            /// <summary>
            /// Get the list of recommended items - LEARNINGS
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getRecommendedLearnings</doc>

            if (!loadMore) {
                // clean recommendations list                
                $scope.itemsRecommendedModel.learnings.size = constants.recommendations.size * 2;
            }
            else {
                // Start loading data
                $ionicLoading.show();
            }

            var params = {
                peopleKey: profileService.getPeopleKey(),
                size: $scope.itemsRecommendedModel.learnings.size,
                killCache: killCache,
                skillsList: ($scope.skillsModel.followSkills.list.length > 0 && !checkAllInvalidSkills()) ? $scope.skillsModel.followSkills.list : $scope.skillsModel.topSkills.list
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getRecommendedLearnings, params: params }).then(function (data) {

                // Set data
                if (data.LearningList !== null) {

                    // clean list always
                    $scope.itemsRecommendedModel.learnings.list = [];
                    $scope.itemsRecommendedModel.learningBoards.list = [];

                    var i = 0, result = [];
                    for (i = 0; i < data.LearningList.length; i++) {

                        // check if item is in action plan
                        if ($scope.finishLoadActionPlan) {
                            data.LearningList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.LearningList[i].ID);
                        }

                        if (data.LearningList[i].MatchingSkillsNames !== undefined &&
                            data.LearningList[i].MatchingSkillsNames !== null &&
                            data.LearningList[i].MatchingSkillsNames !== "") {

                            // remove duplicated values before continue
                            var list = data.LearningList[i].MatchingSkillsNames.split(',');
                            result = [];

                            $.each(list, function (i, e) {
                                if ($.inArray(e, result) === -1) {
                                    result.push(e);
                                }
                            });

                            data.LearningList[i].MatchingSkillsNames = result;

                        }

                        if (data.LearningList[i].CourseType !== 'board') {
                            $scope.itemsRecommendedModel.learnings.list.push(data.LearningList[i]);
                        }
                        else {
                            $scope.itemsRecommendedModel.learningBoards.list.push(data.LearningList[i]);
                        }
                    }
                }

                $scope.finishLoadLearnings = true;

                if (!loadMore) {
                    // Check if there is more data
                    if ($scope.itemsRecommendedModel.learnings.list.length > 0) {
                        $scope.itemsRecommendedModel.learnings.endPaging = ($scope.itemsRecommendedModel.learnings.list.length <= constants.recommendations.size);
                    }

                    // Check if there is more data
                    if ($scope.itemsRecommendedModel.learningBoards.list.length > 0) {
                        $scope.itemsRecommendedModel.learningBoards.endPaging = ($scope.itemsRecommendedModel.learningBoards.list.length <= constants.recommendations.size);
                    }

                    // on initial load, hide loading spinner when first call finishes
                    if ($scope.initLoader) {
                        $scope.initLoader = false;
                        // End loading data
                        $ionicLoading.hide();
                    }
                }
                else {
                    // End loading data
                    $ionicLoading.hide();
                }

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });

        };

        $scope.getRecommendedCommunities = function (loadMore, killCache) {
            /// <summary>
            /// Get the list of recommended items - COMMUNITIES
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getRecommendedCommunities</doc>

            if (!loadMore) {
                // clean recommendations list
                $scope.itemsRecommendedModel.communities.size = constants.recommendations.size * 2;
            }
            else {
                // Start loading data
                $ionicLoading.show();
            }

            var params = {
                peopleKey: profileService.getPeopleKey(),
                size: $scope.itemsRecommendedModel.communities.size,
                killCache: killCache,
                skillsList: ($scope.skillsModel.followSkills.list.length > 0 && !checkAllInvalidSkills()) ? $scope.skillsModel.followSkills.list : $scope.skillsModel.topSkills.list
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getRecommendedCommunities, params: params }).then(function (data) {

                if (!loadMore) {
                    // Check if there is more data
                    if (data.CommunityList.length > 0) {
                        $scope.itemsRecommendedModel.communities.endPaging = (data.CommunityList.length <= constants.recommendations.size);
                    }

                    // on initial load, hide loading spinner when first call finishes
                    if ($scope.initLoader) {
                        $scope.initLoader = false;
                        // End loading data
                        $ionicLoading.hide();
                    }
                }
                else {
                    // End loading data
                    $ionicLoading.hide();
                }

                // Set data
                if (data.CommunityList !== null) {

                    // clear list always
                    $scope.itemsRecommendedModel.communities.list = [];

                    var i = 0;
                    for (i = 0; i < data.CommunityList.length; i++) {

                        // check if item is in action plan
                        if ($scope.finishLoadActionPlan) {
                            data.CommunityList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.CommunityList[i].ID);
                        }

                        $scope.itemsRecommendedModel.communities.list.push(data.CommunityList[i]);
                    }
                }

                $scope.finishLoadCommunities = true;

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });

        };

        $scope.getRecommendedPYMK = function (loadMore, killCache) {
            /// <summary>
            /// Get the list of recommended items - PYMK
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getRecommendedPYMK</doc>

            if (!loadMore) {
                // clean recommendations list
                $scope.itemsRecommendedModel.pymk.size = constants.recommendations.size * 2;
            }
            else {
                // Start loading data
                $ionicLoading.show();
            }

            var params = {
                peopleKey: profileService.getPeopleKey(),
                careerLevelCd: profileService.getCareerLevel(),
                size: $scope.itemsRecommendedModel.pymk.size,
                killCache: killCache,
                skillsList: ($scope.skillsModel.followSkills.list.length > 0 && !checkAllInvalidSkills()) ? $scope.skillsModel.followSkills.list : $scope.skillsModel.topSkills.list
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getRecommendedPYMK, params: params }).then(function (data) {

                if (!loadMore) {
                    // Check if there is more data
                    if (data.PeopleList.length > 0) {
                        $scope.itemsRecommendedModel.pymk.endPaging = (data.PeopleList.length <= constants.recommendations.size);
                    }

                    // on initial load, hide loading spinner when first call finishes
                    if ($scope.initLoader) {
                        $scope.initLoader = false;
                        // End loading data
                        $ionicLoading.hide();
                    }
                }
                else {
                    // End loading data
                    $ionicLoading.hide();
                }

                // Set data
                if (data.PeopleList !== null) {

                    // clear list always
                    $scope.itemsRecommendedModel.pymk.list = [];

                    var i = 0;
                    for (i = 0; i < data.PeopleList.length; i++) {

                        // check if item is in action plan
                        if ($scope.finishLoadActionPlan) {
                            data.PeopleList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.PeopleList[i].PeopleKey.toString());
                        }

                        $scope.itemsRecommendedModel.pymk.list.push(data.PeopleList[i]);
                    }
                }

                $scope.finishLoadPYMK = true;

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });

        };

        $scope.getLearningDetails = function (fromActionPlan) {
            /// <summary>
            /// Get the details of a learning item
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getLearningDetails</doc>

            // Start loading data
            $ionicLoading.show();

            var params = {
                peopleKey: profileService.getPeopleKey(),
                learningId: $scope.selectedItem.ID
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getLearningDetails, params: params }).then(function (data) {

                // End loading data
                $ionicLoading.hide();                

                var result = [];

                if (data[0] !== null && data[0] !== undefined && data[0].SkillNm !== undefined && data[0].SkillNm !== null && data[0].SkillNm !== "") {
                    // remove duplicated values before continue
                    var list = data[0].SkillNm.split(',');


                    $.each(list, function (i, e) {
                        if ($.inArray(e, result) === -1) {
                            result.push(e);
                        }
                    });

                    $scope.selectedItem.Title = data[0].Title;
                    $scope.selectedItem.CourseType = data[0].CourseType;
                    $scope.selectedItem.CourseDuration = data[0].CourseDuration;
                    $scope.selectedItem.Description = $sce.trustAsHtml(data[0].Description);
                    $scope.selectedItem.URL = data[0].URL;
                }

                $scope.selectedItem.MatchingSkills = result;

                if (fromActionPlan) {
                    messagesService.broadcast(constants.broadcast.setLearningDetail, { item: $scope.selectedItem });
                }

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });

        };

        $scope.selectItem = function (item) {
            /// <summary>
            /// Make a selection of a recommended item
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#selectItem</doc>

            $scope.selectedItem = item;
            $scope.selectedItem.MatchingSkills = [];
        };

        //#endregion

        //#region Assignments

        $scope.getMySchedulingAssignments = function (loadMore, killCache) {
            /// <summary>
            /// Get the list of my scheduling assignments
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getMySchedulingAssignments</doc>

            if (!loadMore) {
                $scope.itemsRecommendedModel.mySchedulingAssignments.size = constants.recommendations.size * 2;
            }
            else {
                // Start loading data
                $ionicLoading.show();
            }

            var params = {
                peopleKey: profileService.getPeopleKey(),
                enterpriseid: profileService.getEnterpriseId(),
                careerLevelCd: profileService.getCareerLevel(),
                size: $scope.itemsRecommendedModel.mySchedulingAssignments.size,
                skillsList: ($scope.skillsModel.followSkills.list.length > 0 && !checkAllInvalidSkills()) ? $scope.skillsModel.followSkills.list : $scope.skillsModel.topSkills.list,
                killCache: killCache
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getMySchedulingAssignments, params: params }).then(function (data) {

                if (!loadMore) {
                    // Check if there is more data
                    if (data.AssignmentList.length > 0) {
                        $scope.itemsRecommendedModel.mySchedulingAssignments.endPaging = (data.AssignmentList.length <= constants.recommendations.size);
                    }

                    // on initial load, hide loading spinner when first call finishes
                    if ($scope.initLoader) {
                        $scope.initLoader = false;
                        // End loading data
                        $ionicLoading.hide();
                    }
                }
                else {
                    // End loading data
                    $ionicLoading.hide();
                }

                // Set data
                if (data.AssignmentList !== null) {

                    // clean assignment list
                    $scope.itemsRecommendedModel.mySchedulingAssignments.list = [];

                    var i = 0;
                    for (i = 0; i < data.AssignmentList.length; i++) {

                        // check if item is in action plan
                        if ($scope.finishLoadActionPlan) {
                            data.AssignmentList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.AssignmentList[i].Id.toString());
                        }

                        $scope.itemsRecommendedModel.mySchedulingAssignments.list.push(data.AssignmentList[i]);
                    }
                }

                $scope.finishLoadAssignments = true;

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });
        };

        //#endregion

        //#region Positions

        $scope.getACMPositions = function (loadMore, killCache) {
            /// <summary>
            /// Get the list of my acm positions
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getACMPositions</doc>

            if (!loadMore) {
                $scope.itemsRecommendedModel.acmPositions.size = constants.recommendations.size * 2;
            }
            else {
                // Start loading data
                $ionicLoading.show();
            }

            var params = {
                peopleKey: profileService.getPeopleKey(),
                careerLevelCd: profileService.getCareerLevel(),
                size: $scope.itemsRecommendedModel.acmPositions.size,
                killCache: killCache,
                skillsList: ($scope.skillsModel.followSkills.list.length > 0 && !checkAllInvalidSkills()) ? $scope.skillsModel.followSkills.list : $scope.skillsModel.topSkills.list
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getACMPositions, params: params }).then(function (data) {

                if (!loadMore) {
                    // Check if there is more data
                    if (data.OpportunityList.length > 0) {
                        $scope.itemsRecommendedModel.acmPositions.endPaging = (data.OpportunityList.length <= constants.recommendations.size);
                    }

                    // on initial load, hide loading spinner when first call finishes
                    if ($scope.initLoader) {
                        $scope.initLoader = false;
                        // End loading data
                        $ionicLoading.hide();
                    }
                }
                else {
                    // End loading data
                    $ionicLoading.hide();
                }

                // Set data
                if (data.OpportunityList !== null) {

                    // clean position list
                    $scope.itemsRecommendedModel.acmPositions.list = [];

                    var i = 0;
                    for (i = 0; i < data.OpportunityList.length; i++) {

                        // check if item is in action plan
                        if ($scope.finishLoadActionPlan) {
                            data.OpportunityList[i].InActionPlan = methods.inActionPlan($scope.userModel.actionPlan, data.OpportunityList[i].PositionId);
                        }

                        $scope.itemsRecommendedModel.acmPositions.list.push(data.OpportunityList[i]);
                    }
                }

                $scope.finishLoadPositions = true;

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });
        };

        $scope.getPositionDetails = function (fromActionPlan) {
            /// <summary>
            /// Get the details of a position item
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getPositionDetails</doc>

            // Start loading data
            $ionicLoading.show();

            var params = {
                peopleKey: profileService.getPeopleKey(),
                positionId: $scope.selectedPositionItem.PositionId
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getPositionDetails, params: params }).then(function (data) {

                // End loading data
                $ionicLoading.hide();

                $scope.selectedPositionItem.Skills = data.OpportunitySkills;
                $scope.selectedPositionItem.Description = $sce.trustAsHtml(data.OpportunityDescription);
                $scope.selectedPositionItem.PositionTitle = data.PositionTitle;
                $scope.selectedPositionItem.RoleDesc = data.RoleDesc;
                $scope.selectedPositionItem.TalentSegment = data.TalentSegment;
                $scope.selectedPositionItem.Workforce = data.Workforce;
                $scope.selectedPositionItem.Locations = data.Locations;
                $scope.selectedPositionItem.CapabSpecialty = data.CapabSpecialty;
                $scope.selectedPositionItem.CareerLevel = data.CareerLevel;
                $scope.selectedPositionItem.PositionId = data.PositionId;

                if (fromActionPlan) {
                    messagesService.broadcast(constants.broadcast.setPositionDetail, { item: $scope.selectedPositionItem });
                }

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });

        };

        $scope.getAssignmentDetail = function (fromActionPlan) {
            /// <summary>
            /// Get the details of an assignment item
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#getAssignmentDetail</doc>

            // Start loading data
            $ionicLoading.show();

            var params = {
                peopleKey: profileService.getPeopleKey(),
                assignmentId: $scope.selectedAssignmentItem.Id
            };

            // get recommended items
            authService.callService({ serviceName: environmentData.services.conlearningService.serviceName, action: recommendationsService.getAssignmentDetail, params: params }).then(function (data) {

                // End loading data
                $ionicLoading.hide();

                $scope.selectedAssignmentItem.Id = data.Id;
                $scope.selectedAssignmentItem.Description = $sce.trustAsHtml(data.Description);
                $scope.selectedAssignmentItem.AssignmentTitle = data.AssignmentTitle;
                $scope.selectedAssignmentItem.Location = data.Location;
                $scope.selectedAssignmentItem.Specialty = data.Specialty;
                $scope.selectedAssignmentItem.TalentSegment = data.TalentSegment;
                $scope.selectedAssignmentItem.ResourcePool = data.ResourcePool;

                if (fromActionPlan) {
                    messagesService.broadcast(constants.broadcast.setAssignmentDetail, { item: $scope.selectedAssignmentItem });
                }

            }, function (error) {
                console.log(error);
                // End loading data
                $ionicLoading.hide();
            });

        };

        $scope.selectPositionItem = function (item) {
            /// <summary>
            /// Make a selection of a position item
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#selectPositionItem</doc>

            $scope.selectedPositionItem = item;
            $scope.selectedPositionItem.Skills = [];
            $scope.selectedPositionItem.Description = "";
        };

        $scope.selectAssignmentItem = function (item) {
            /// <summary>
            /// Make a selection of a assignmet item
            /// </summary>
            /// <doc>connectedLearning.controllers:homeController#selectAssignmentItem</doc>

            $scope.selectedAssignmentItem = item;
        };

        //#endregion

        $scope.showMoreRecommendations = function (recommendationType) {

            switch (recommendationType) {
                case 'positions':
                    // get the full list only if not obtained before
                    if ($scope.itemsRecommendedModel.acmPositions.list.length < constants.recommendations.maxSizePositions) {

                        $scope.itemsRecommendedModel.acmPositions.size = constants.recommendations.maxSizePositions;
                        $scope.getACMPositions(true, true);
                    }

                    crittercismService.beginTransaction('User_Activity_View_Show_More_Recommendations_Positions');
                    crittercismService.endTransaction('User_Activity_View_Show_More_Recommendations_Positions');

                    $scope.moreRecommendationsType = constants.recommendations.type.position;
                    $scope.moreRecommendationsTitle = "Open Positions";

                    break;
                case 'assignments':
                    // get the full list only if not obtained before
                    if ($scope.itemsRecommendedModel.mySchedulingAssignments.list.length < constants.recommendations.maxSizeAssignments) {

                        $scope.itemsRecommendedModel.mySchedulingAssignments.size = constants.recommendations.maxSizeAssignments;
                        $scope.getMySchedulingAssignments(true, true);
                    }

                    crittercismService.beginTransaction('User_Activity_View_Show_More_Recommendations_Assignments');
                    crittercismService.endTransaction('User_Activity_View_Show_More_Recommendations_Assignments');

                    $scope.moreRecommendationsType = constants.recommendations.type.assignment;
                    $scope.moreRecommendationsTitle = "Open Scheduling Assignments";
                    break;
                case 'trainings':
                    // get the full list only if not obtained before
                    if ($scope.itemsRecommendedModel.learnings.list.length < constants.recommendations.maxSizeLearnings) {

                        $scope.itemsRecommendedModel.learnings.size = constants.recommendations.maxSizeLearnings;
                        $scope.getRecommendedLearnings(true, true);
                    }

                    crittercismService.beginTransaction('User_Activity_View_Show_More_Recommendations_Trainings');
                    crittercismService.endTransaction('User_Activity_View_Show_More_Recommendations_Trainings');

                    $scope.moreRecommendationsType = constants.recommendations.type.learning;
                    $scope.moreRecommendationsTitle = "Trainings";
                    break;
                case 'boards':
                    // get the full list only if not obtained before
                    if ($scope.itemsRecommendedModel.learningBoards.list.length < constants.recommendations.maxSizeLearnings) {

                        $scope.itemsRecommendedModel.learningBoards.size = constants.recommendations.maxSizeLearnings;
                        $scope.getRecommendedLearnings(true, true);
                    }

                    crittercismService.beginTransaction('User_Activity_View_Show_More_Recommendations_Boards');
                    crittercismService.endTransaction('User_Activity_View_Show_More_Recommendations_Boards');

                    $scope.moreRecommendationsType = constants.recommendations.type.board;
                    $scope.moreRecommendationsTitle = "Learning Boards";
                    break;
                case 'communities':
                    // get the full list only if not obtained before
                    if ($scope.itemsRecommendedModel.communities.list.length < constants.recommendations.maxSizeCommunities) {

                        $scope.itemsRecommendedModel.communities.size = constants.recommendations.maxSizeCommunities;
                        $scope.getRecommendedCommunities(true, true);
                    }

                    crittercismService.beginTransaction('User_Activity_View_Show_More_Recommendations_Communities');
                    crittercismService.endTransaction('User_Activity_View_Show_More_Recommendations_Communities');

                    $scope.moreRecommendationsType = constants.recommendations.type.community;
                    $scope.moreRecommendationsTitle = "Communities";
                    break;
                case 'pymk':
                    // get the full list only if not obtained before
                    if ($scope.itemsRecommendedModel.pymk.list.length < constants.recommendations.maxSizePYMK) {

                        $scope.itemsRecommendedModel.pymk.size = constants.recommendations.maxSizePYMK;
                        $scope.getRecommendedPYMK(true, true);
                    }

                    crittercismService.beginTransaction('User_Activity_View_Show_More_Recommendations_PYMK');
                    crittercismService.endTransaction('User_Activity_View_Show_More_Recommendations_PYMK');

                    $scope.moreRecommendationsType = constants.recommendations.type.pymk;
                    $scope.moreRecommendationsTitle = "PYMK";
                    break;
            }

            $scope.openModal('moreRecommendations');
        };

        //#endregion

        //#region init

        $scope.init();

        //#endregion

        //#region Modal
        // to do -> change the html file to use the recommended item.

        $ionicModal.fromTemplateUrl('conLearning/home/learning.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.learningDetail_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/community.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.communityDetail_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/skills.improve.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.skillsImprove_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/more.recommendations.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.moreRecommendations_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/position.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.position_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/position.skills.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.positionSkills_modal = modal;
        });
        $ionicModal.fromTemplateUrl('conLearning/home/assignment.detail.html', {
            scope: $scope,
            animation: "slide-in-right",
            hardwareBackButtonClose: false
        }).then(function (modal) {
            $scope.assignment_modal = modal;
        });

        $scope.openModal = function (whichModal, $event) {
            switch (whichModal) {
                case 'community':
                    crittercismService.beginTransaction('User_Activity_View_Community_Detail');
                    crittercismService.endTransaction('User_Activity_View_Community_Detail');
                    $scope.communityDetail_modal.show();
                    $scope.moveScrollTop('communityDetail');
                    break;
                case 'learning':
                    
                    $scope.selectedItem.MatchingSkills = [];
                    $scope.getLearningDetails();
                    crittercismService.beginTransaction('User_Activity_View_Learning_Detail');
                    crittercismService.endTransaction('User_Activity_View_Learning_Detail');
                    $scope.learningDetail_modal.show();
                    $scope.moveScrollTop('learningDetail');
                    break;
                case 'skillsImprove':
                    crittercismService.beginTransaction('User_Activity_View_Training_Skills_You_Will_Improve');
                    crittercismService.endTransaction('User_Activity_View_Training_Skills_You_Will_Improve');
                    $scope.skillsImprove_modal.show();
                    $scope.moveScrollTop('skillsImprove');
                    break;
                case 'moreRecommendations':
                    
                    $scope.moreRecommendations_modal.show();
                    $scope.moveScrollTop('moreRecommendations');
                    break;
                case 'position':
                    if (!$($event.target).hasClass('button')) {
                        
                        $scope.selectedPositionItem.Skills = [];
                        $scope.selectedPositionItem.Description = "";
                        $scope.getPositionDetails();
                        crittercismService.beginTransaction('User_Activity_View_Position_Detail');
                        crittercismService.endTransaction('User_Activity_View_Position_Detail');
                        $scope.position_modal.show();
                        $scope.moveScrollTop('positionDetail');
                    }
                    break;
                case 'positionSkills':
                    crittercismService.beginTransaction('User_Activity_View_Position_Skills');
                    crittercismService.endTransaction('User_Activity_View_Position_Skills');
                    $scope.positionSkills_modal.show();
                    $scope.moveScrollTop('positionSkills');
                    break;
                case 'assignment':
                    if (!$($event.target).hasClass('button')) {
                        
                        $scope.selectedAssignmentItem.Description = "";
                        $scope.getAssignmentDetail();
                        crittercismService.beginTransaction('User_Activity_View_Assignment_Detail');
                        crittercismService.endTransaction('User_Activity_View_Assignment_Detail');
                        $scope.assignment_modal.show();
                        $scope.moveScrollTop('assignmentDetail');
                    }
                    break;
            }
        };

        $scope.closeModal = function (whichModal) {
            switch (whichModal) {
                case 'community':
                    $scope.communityDetail_modal.hide();
                    break;
                case 'learning':
                    $scope.learningDetail_modal.hide();
                    break;
                case 'skillsImprove':
                    $scope.skillsImprove_modal.hide();
                    break;
                case 'moreRecommendations':
                    $scope.moreRecommendations_modal.hide();
                    break;
                case 'position':
                    $scope.position_modal.hide();
                    break;
                case 'positionSkills':
                    $scope.positionSkills_modal.hide();
                    break;
                case 'assignment':
                    $scope.assignment_modal.hide();
                    break;
            }
        };

        $rootScope.$on(constants.broadcast.getLearningDetail, function (event, args) {

            if (args.message !== undefined) {

                $scope.selectedItem = {};
                $scope.selectedItem.ID = args.message.id;
                $scope.getLearningDetails(true);
            }
        });

        $rootScope.$on(constants.broadcast.getPositionDetail, function (event, args) {

            if (args.message !== undefined) {

                $scope.selectedPositionItem = {};
                $scope.selectedPositionItem.PositionId = args.message.id;
                $scope.getPositionDetails(true);
            }
        });

        $rootScope.$on(constants.broadcast.getAssignmentDetail, function (event, args) {

            if (args.message !== undefined) {

                $scope.selectedAssignmentItem = {};
                $scope.selectedAssignmentItem.Id = args.message.id;
                $scope.getAssignmentDetail(true);
            }
        });

        //#endregion

        $scope.$on('$ionicView.enter', function () {

            // if user has followed/unfollowed one skill, reload recommended items
            if ($scope.itemsRecommendedModel.reloadRecommendations) {

                crittercismService.leaveBreadcrumb('Recommendations Page');

                $scope.moveScrollTop('homePage');

                // clean recommendations list
                $scope.itemsRecommendedModel.learnings.list = [];
                $scope.itemsRecommendedModel.learnings.size = constants.recommendations.size;

                $scope.itemsRecommendedModel.learningBoards.list = [];
                $scope.itemsRecommendedModel.learningBoards.size = constants.recommendations.size;

                $scope.itemsRecommendedModel.communities.list = [];
                $scope.itemsRecommendedModel.communities.size = constants.recommendations.size;

                $scope.itemsRecommendedModel.pymk.list = [];
                $scope.itemsRecommendedModel.pymk.size = constants.recommendations.size;

                $scope.itemsRecommendedModel.mySchedulingAssignments.list = [];
                $scope.itemsRecommendedModel.mySchedulingAssignments.size = constants.recommendations.size;

                $scope.itemsRecommendedModel.acmPositions.list = [];
                $scope.itemsRecommendedModel.acmPositions.size = constants.recommendations.size;

                // reload action plan
                $scope.finishLoadActionPlan = false;
                $scope.getActionPlan();

                // reload recommendations list
                $scope.getRecommendations(false, true);

                recommendationsService.setReloadRecommendations(false);
            }

        });

    }]);