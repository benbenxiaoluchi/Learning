/*global factories, angular, FileUploadOptions */

'use strict';

factories.factory('trainingService',
    ['$q', '$http', 'connectedLearning.constants', 'environmentData', 'connectedLearning.methods', '$cordovaFile', 'authService', 'localStorageService','$log','$ionicLoading', 'connectedLearning.constants.environments', 'securityService',
function ($q, $http, constants, services, methods, $cordovaFile, authService, localStorageService, $log, $ionicLoading, envs, securityService) {
    /// <summary>
    /// Service created to manage http calls needed to provide functionality to manage training 
    ///  training with invoinces into the application
    /// </summary>
    /// <param name="$q">
    /// Service in module ng: 
    /// A promise/deferred implementation inspired by Kris Kowal's Q.
    /// The CommonJS Promise proposal describes a promise as an interface for interacting with an object that represents 
    /// the result of an action that is performed asynchronously, and may or may not be finished at any given point in time.
    /// From the perspective of dealing with error handling, deferred and promise APIs are to asynchronous programming what try, 
    /// catch and throw keywords are to synchronous programming.
    /// </param>
    /// <param name="$http">
    /// Service in module ng:
    /// The $http service is a core Angular service that facilitates communication with the remote HTTP servers via 
    /// the browser's XMLHttpRequest object or via JSONP.
    /// </param>        
    /// <param name="constants">Application constants.</param>
    /// <param name="services">Application constants services.</param>
    /// <param name="methods">Application common methods injection.</param>
    /// <returns type="object">Service object.</returns>
    /// <doc>myExpenses.services:trainingService</doc>

    //#region Model
    /// <summary>
    ///  Model to manage training Information.
    /// </summary>
    /// <doc>myExpenses.services:trainingService!trainingModel</doc>
    var trainingModel = {
        list: [],
        currList: [],
        pastList:[]
    };



    //#region Common WS Retry functionality
    function doGetQuery(deferred, url, counter) {
        /// <summary>
        ///  Function to do retrys on get queries
        /// <param name="deferred">defer constant.</param>
        /// <param name="url">complete url where the post service is located</param>
        /// <param name="counter">An initial counter.</param>
        /// <param name="optionalParameters">Optional input parameters.</param>
        /// </summary>

        //$ionicLoading.show({ template: 'Loading ...' });

        $http.get(url, { cache: false })
            .success(function (data) {

                deferred.resolve(data);
                //$ionicLoading.hide();
            })
            .error(function (data, status) {
                if (counter < 3) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                    //$ionicLoading.hide();
                }

            });
    }

    function doPostQuery(url, data, config, refresh) {
        var deferred = $q.defer();
        $http.post(url, data, config)
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject({ data: data, status: status, headers: headers, config: config });
            });
        return deferred.promise;
    }

    var httpService = {
        fetchData: function (url, method, config, data, refresh) {
            var deferred = $q.defer();
            if (method == 'GET') {
                return httpService.get(url, config, refresh);
            }
            else if (method == 'POST') {
                return httpService.post(url, data, config, refresh);
            }
            else {
                console.error('method error');
                deferred.reject('method error, please check if method is "GET" or "POST"');
            }
            return deferred.promise;
        },
        get: function (url, config, refresh) {
            var deferred = $q.defer();
            $http.get(url, config).success(function (data) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject({
                    data: data, status: status, headers: headers, config: config
                });
            });
            return deferred.promise;
        },
        post: function (url, data, config, refresh) {
            var deferred = $q.defer();
            $http.post(url, data, config)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject({ data: data, status: status, headers: headers, config: config });
                });
            return deferred.promise;
        }
    };

    function sha256Encrypt() {
        var keyToBeEncrypted = services.services.myLearningService.apiKey + services.services.myLearningService.secretKey + Date.now().toString().substr(0, 10);
        var sigValue = CryptoJS.SHA256(keyToBeEncrypted);

        return String(sigValue);
    }

    //#endregion

    return {
        getTrainingModel: function (jwt, params) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getTraining</doc>
            var baseUrl = services.services.myLearningService.url.training.getTraining,
                url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';
            $log.debug("i am the very first to run", jwt);
            $log.debug("Get Training List URL: " + baseUrl);
            return authService.get(url, authorization, 'getTrainingModel');
        },

        getUpcomingSessions: function (startDt,EndDt,authorIDType,FacilityID, TabCategory) {

            /// <summary>
            /// Get Upcoming Sessions
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getUpcomingSessions</doc>
            //return deferred.promise;

            var deferred = $q.defer();
            if (services.environment === envs.MOCK) {
                var baseUrl = services.services.myLearningService.url.training.getUpcomingSessions,
                    wsUrl = methods.urlFormat(baseUrl),
                    counter = 1;
                $log.debug("Get Upcoming Sessions List URL: " + baseUrl);

                doGetQuery(deferred, wsUrl, counter);
            }
            else {
                authService.callService({
                    serviceName: services.services.myLearningService.serviceName,
                    action: this.getUpcomingSessionsSecured,
                    params: { startDt: startDt, endDt:EndDt, authorIDType: authorIDType ,facilityID :FacilityID, tabCategory:TabCategory}
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;

        },

        getUpcomingSessionsSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.getUpcomingSessions,
                url = methods.urlFormat(baseUrl, params.startDt,params.endDt, params.authorIDType,params.facilityID,params.tabCategory, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'GET', {
                cache: false,
                headers: {
                    'Authorization': authorization
                }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        searchPeopleNew: function (activityId,RecordCount,ReturnSetFlag, SearchStr,DemogCategory,DemogKey) {

            /// <summary>
            /// Get Upcoming Sessions
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getUpcomingSessions</doc>
            //return deferred.promise;

            var deferred = $q.defer();
            if (services.environment === envs.MOCK) {
                var baseUrl = services.services.myLearningService.url.training.searchPeople,
                    wsUrl = methods.urlFormat(baseUrl),
                    counter = 1;
                //$log.debug("Get Upcoming Sessions List URL: " + baseUrl);

                doGetQuery(deferred, wsUrl, counter);
            }
            else {
                authService.callService({
                    serviceName: services.services.myLearningService.serviceName,
                    action: this.searchPeople,
                    params: { 
                        activityId: activityId, 
                        ReturnSetFlag: ReturnSetFlag,
                        RecordCount:RecordCount,
                        SearchStr:SearchStr,
                        DemogCategory:DemogCategory,
                        DemogKey:DemogKey }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;

        },

        searchPeople: function (jwt, parameters) {
            if (methods.isEmptyOrNull(parameters.activityId)) { parameters.activityId = ''; }
            if (methods.isEmptyOrNull(parameters.ReturnSetFlag)) { parameters.ReturnSetFlag = ''; }
            if (methods.isEmptyOrNull(parameters.RecordCount)) { parameters.RecordCount = ''; }
            if (methods.isEmptyOrNull(parameters.SearchStr)) { parameters.SearchStr = ''; }
            if (methods.isEmptyOrNull(parameters.DemogCategory)) { parameters.DemogCategory = ''; }
            if (methods.isEmptyOrNull(parameters.DemogKey)) { parameters.DemogKey = ''; }

            var baseUrl = services.services.myLearningService.url.training.searchPeople,
                url = methods.urlFormat(baseUrl, parameters.activityId, parameters.RecordCount, parameters.ReturnSetFlag,parameters.SearchStr, parameters.DemogCategory, parameters.DemogKey, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.get(url, authorization, 'searchPeople');
        },

        getPeopleLikeMe: function (peopleKey, activityId, source) {
            /// <summary>
            /// Get people like me 
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getPeopleLikeMe</doc>
            var baseUrl = services.services.myLearningService.url.training.getPeopleLikeMe,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, peopleKey, activityId, source, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, peopleKey, activityId, source),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get item (" + activityId + ") PeopleLikeMe URL: " + wsUrl);

            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },

        getDemographicType: function (source) {
            /// <summary>
            /// Get data list of Demographic Type
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getDemographicType</doc>
            var baseUrl = services.services.myLearningService.url.training.getDemographicType,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, source, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, source),
                deferred = $q.defer(),
                counter = 1;
            //$log.debug("Get item (" + activityId + ") DemographicType URL: " + wsUrl);

            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },

        getDemographics: function (activityId, source, demogTypeLabel) {
            /// <summary>
            /// Get people like me 
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getPeopleLikeMe</doc>
            var baseUrl = services.services.myLearningService.url.training.getDemographics,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, source, demogTypeLabel, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId, source, demogTypeLabel),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get item (" + activityId + ") Demographics URL: " + wsUrl);

            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },


        getPeopleOnSite: function (jwt, parameters) {

            if (methods.isEmptyOrNull(parameters.activityId)) { parameters.activityId = ''; }
            if (methods.isEmptyOrNull(parameters.SearchStr)) { parameters.SearchStr = ''; }
            if (methods.isEmptyOrNull(parameters.RecordCount)) { parameters.RecordCount = ''; }
            if (methods.isEmptyOrNull(parameters.DemogCategory)) { parameters.DemogCategory = ''; }
            if (methods.isEmptyOrNull(parameters.DemogKey)) { parameters.DemogKey = ''; }

            var baseUrl = services.services.myLearningService.url.training.getPeopleOnSite,
                url = methods.urlFormat(baseUrl, parameters.activityId, parameters.SearchStr, parameters.RecordCount, parameters.DemogCategory, parameters.DemogKey, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.get(url, authorization, 'getPeopleOnSite');
            /*
            /// <summary>
            /// Get people on site
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getPeopleOnSite</doc>
            var baseUrl = services.services.myLearningService.url.training.getPeopleOnSite,
                //wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, SearchStr, RecordCount, DemogCategory, Dem, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId, SearchStr, RecordCount, DemogCategory, Dem),
                wsUrl = methods.urlFormat(baseUrl, activityId, SearchStr, RecordCount, DemogCategory, Dem),
                deferred = $q.defer(),
                counter = 1;

            $log.debug("Get item (" + activityId + ") PeopleOnSite URL: " + wsUrl);
            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
            */
        },

        getSingleFacility: function (activityId, facilityId) {
            var deferred = $q.defer();
            if (services.environment === envs.MOCK) {
                var baseUrl = services.services.myLearningService.url.apis.getSingleFacility,
                    wsUrl = methods.urlFormat(baseUrl),
                    counter = 1;
                $log.debug("Get Single Facility URL: " + baseUrl);

                doGetQuery(deferred, wsUrl, counter);
            }
            else {
                authService.callService({
                    serviceName: services.services.myLearningService.serviceName,
                    action: this.getSingleFacilitySecured,
                    params: { activityId: activityId, facilityId: facilityId}
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        },

        getSingleFacilitySecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.apis.getSingleFacility,
                url = methods.urlFormat(baseUrl, params.activityId,params.facilityId, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'GET', {
                cache: false,
                headers: {
                    'Authorization': authorization
                }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getWeatherInfo: function (searchCondition) {
            var baseUrl = services.services.myLearningService.url.weather.getCurrentObservation,
                wsUrl = methods.urlFormat(baseUrl, searchCondition),
                deferred = $q.defer(),
                counter = 1;

            $log.debug("Get weather info.");
            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },

        getTrainingDetails: function (activityId, count, set) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getTraining</doc>
            var baseUrl = services.services.myLearningService.url.training.getTrainingDetails,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, count, set, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId, count, set),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get Training (" + activityId + ") Details URL: " + wsUrl);
            if (trainingModel.list.length == 0) {
                doGetQuery(deferred, wsUrl, counter);
            } else {
                deferred.resolve(trainingModel.list);
            }
            return deferred.promise;
        },

        // getTrainingDesc: function (activityId) {
        //     /// <summary>
        //     /// Get Training
        //     /// </summary>
        //     /// <returns type="object">Result in a promise object.</returns>
        //     /// <doc>myEvents.services:trainingService#getTraining</doc>
        //     var baseUrl = services.services.myLearningService.url.training.getTrainingDesc,
        //         wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId),
        //         deferred = $q.defer(),
        //         counter = 1;
        //     $log.debug("Get Training (" + activityId + ") DESC URL: " + wsUrl);
        //     doGetQuery(deferred, wsUrl, counter);
        //
        //     return deferred.promise;
        // },

        getTrainingDesc: function (jwt, activityID) {

            var baseUrl = services.services.myLearningService.url.training.getTrainingDesc,
                url = methods.urlFormat(baseUrl, activityID, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.get(url, authorization, 'getTrainingDesc');
        },

        getCourseCode: function (activityId) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getTraining</doc>
            var baseUrl = services.services.myLearningService.url.training.getCourseCode,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get Course Code (" + activityId + ") URL: " + wsUrl);
            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },

        //getScheduleDetails: function (CourseCode) {
        //    /// <summary>
        //    /// Get Schedule Details
        //    /// </summary>
        //    /// <returns type="object">Result in a promise object.</returns>
        //    /// <doc>myEvents.services:trainingService#getScheduleDetails</doc>
        //    var baseUrl = services.services.myLearningService.url.training.getCourseSchedule,
        //        wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, CourseCode, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, CourseCode),
        //        deferred = $q.defer(),
        //        counter = 1;
        //    $log.debug("Get Schedule Details URL: " + baseUrl);
        //    if (scheduleDetailsModel.length == 0) {
        //        doGetQuery(deferred, wsUrl, counter);
        //    } else {
        //        deferred.resolve(scheduleDetailsModel);
        //    }
        //
        //    return deferred.promise;
        //},

        getScheduleDetails: function (jwt, activityID) {

            var baseUrl = services.services.myLearningService.url.training.getCourseSchedule,
                url = methods.urlFormat(baseUrl, activityID, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.get(url, authorization, 'getScheduleDetails');
        },

        getMaterialDetails: function (CourseCode) {
            var baseUrl = services.services.myLearningService.url.training.getCourseMeterial,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, CourseCode, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, CourseCode),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get Material Details URL: " + baseUrl);

            doGetQuery(deferred, wsUrl, counter);
            return deferred.promise;
        },

        getAttendanceStatus: function (eid, activityId, sessionId) {

            var baseUrl = services.services.myLearningService.url.training.getAttendanceStatus,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, eid, activityId, sessionId, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, eid, activityId, sessionId),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get AttendanceStatus (" + activityId + ") URL: " + wsUrl);

            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },

        //getRollCall: function (authorId, authorIDType, activityID, statusTS) {
        //    var baseUrl = services.services.myLearningService.url.training.getRollCall,
        //        wsUrl = methods.urlFormat(baseUrl, authorId, authorIDType, activityID, statusTS, services.services.myLearningService.apiKey, sha256Encrypt()),
        //        deferred = $q.defer(),
        //        counter = 1;
        //    $log.debug("Get RollCall (" + authorId + "," + authorIDType + "," + activityID + "," + statusTS + ") URL: " + wsUrl);

        //    doGetQuery(deferred, wsUrl, counter);

        //    return deferred.promise;
        //},

        getRollCall: function (authorId, authorIDType, activityID, statusTS) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.myLearningService.serviceName,
                action: this.getRollCallSecured,
                params: { authorId: authorId, authorIDType: authorIDType, activityID: activityID, statusTS: statusTS }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getRollCallSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.getRollCall,
                url = methods.urlFormat(baseUrl, params.authorId, params.authorIDType, params.activityID, params.statusTS, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'GET', {
                cache: false,
                headers: {
                    'Authorization': authorization
                }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        parseMetreialFromHTML: function (data) {
            var baseURL = data.url;
            baseURL = baseURL.replace('index.html','');
            var htmlBody = data.html;

            var element = angular.element(htmlBody);
            var aTags = element.find('a');
            var Links = [];
            angular.forEach(aTags, function (item, key) {
                var file = item.innerText;

                var link = item.attributes["href"].nodeValue;
                //var role = item.attributes["media"].nodeValue; disable the admin for material since api not ready by Booker
                var fileType =link.substring(link.lastIndexOf('.') + 1).toUpperCase();
                while (link.indexOf('https://') == -1) {
                    link = baseURL + link;
                }

                var temp = {
                    file: file,
                    link: link,
                    type: fileType,
                    //role: role
                };

                this.push(temp);
            }, Links);

            return Links;
        },
        getRegion: function () {
            var baseUrl = 'http://api.ipinfodb.com/v3/ip-country/?key=c9dcc88453e33a9e63ebad8d65f91583e87abd8185dd95f09fbeef6c62264f7d',
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get Region URL: " +baseUrl);

            doGetQuery(deferred, baseUrl, counter);
            return deferred.promise;
        },
        getSurveyForSession: function (activityId) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getTraining</doc>
            var baseUrl = services.services.myLearningService.url.training.getSurveyForSession,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get survey for session (" + activityId + ") URL: " + wsUrl);
            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },
        getSurveyForFaculty: function (activityId) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:trainingService#getTraining</doc>
            var baseUrl = services.services.myLearningService.url.training.getSurveyForFaculty,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId),
                deferred = $q.defer(),
                counter = 1;
            $log.debug("Get survey for faculty (" + activityId + ") URL: " + wsUrl);
            doGetQuery(deferred, wsUrl, counter);

            return deferred.promise;
        },
        //getActivityTabs: function (activityId) {
        //    var baseUrl = services.services.myLearningService.url.training.getActivityTabs,
        //       wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, activityId, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, activityId),
        //       deferred = $q.defer(),
        //       counter = 1;
        //    $log.debug("Get ActivityTabs (" + activityId + ") URL: " + wsUrl);
        //    doGetQuery(deferred, wsUrl, counter);
        //
        //    return deferred.promise;
        //},
        getActivityTabs: function (jwt, activityID) {

            var baseUrl = services.services.myLearningService.url.training.getActivityTabs,
                url = methods.urlFormat(baseUrl, activityID, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.get(url, authorization, 'getActivityTabs');
        },
        modifyDefaultCircle: function (jwt, parameters) {
            var baseUrl = services.services.myLearningService.url.training.modifyDefaultCircle,
                url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.put(url, authorization, parameters, 'modifyDefaultCircle');
        },
        getCircles: function (jwt, parameters) {
            if (methods.isEmptyOrNull(parameters.authorID)) { parameters.authorID = ''; }
            if (methods.isEmptyOrNull(parameters.authorIDType)) { parameters.authorIDType = ''; }
            if (methods.isEmptyOrNull(parameters.activityID)) { parameters.activityID = ''; }

            var baseUrl = services.services.myLearningService.url.training.getCircles,
                url = methods.urlFormat(baseUrl, parameters.authorID, parameters.authorIDType, parameters.activityID, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            return authService.get(url, authorization, 'getCircles');
        },

        //getLearnerByStatus: function (authorId, authorIDType, activityID, attendanceStatus, statusTS) {
        //    var baseUrl = services.services.myLearningService.url.training.getLearnerByStatus,
        //        wsUrl = methods.urlFormat(baseUrl, authorId, authorIDType, activityID, attendanceStatus, statusTS, services.services.myLearningService.apiKey, sha256Encrypt()),
        //        deferred = $q.defer(),
        //        counter = 1;
        //    $log.debug("getLearnerByStatus (" + authorId + "," + authorIDType + "," + activityID + "," + attendanceStatus + "," + statusTS + ") URL: " + wsUrl);
        //    doGetQuery(deferred, wsUrl, counter);

        //    return deferred.promise;
        //},

        getLearnerByStatus: function (authorId, authorIDType, activityID, attendanceStatus, statusTS) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.myLearningService.serviceName,
                action: this.getLearnerByStatusSecured,
                params: { authorId: authorId, authorIDType: authorIDType, activityID: activityID, attendanceStatus: attendanceStatus, statusTS: statusTS }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getLearnerByStatusSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.getLearnerByStatus,
                url = methods.urlFormat(baseUrl, params.authorId, params.authorIDType, params.activityID, params.attendanceStatus, params.statusTS, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'GET', {
                cache: false,
                headers: {
                    'Authorization': authorization
                }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        //getAttendanceInfo: function (authorID, authorIDType, learnerID, activityID, statusTS) {
        //    var baseUrl = services.services.myLearningService.url.training.getAttendanceInfo,
        //        wsUrl = methods.urlFormat(baseUrl, learnerId, authorID, sessionId, services.services.myLearningService.apiKey, sha256Encrypt()),
        //       deferred = $q.defer(),
        //       counter = 1;
        //    $log.debug("getAttendanceInfo (" + authorID + "," + authorIDType + "," + learnerID + "," + activityID + "," + statusTS + ") URL: " + wsUrl);
        //    doGetQuery(deferred, wsUrl, counter);

        //    return deferred.promise;
        //},

        getAttendanceInfo: function (authorId, authorIDType, learnerID, activityID, statusTS) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.myLearningService.serviceName,
                action: this.getAttendanceInfoSecured,
                params: { authorId: authorId, authorIDType: authorIDType, learnerID: learnerID, activityID: activityID, statusTS: statusTS }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getAttendanceInfoSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.getAttendanceInfo,
                url = methods.urlFormat(baseUrl, params.authorId, params.authorIDType, params.learnerID, params.activityID, params.statusTS, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'GET', {
                cache: false,
                headers: {
                    'Authorization': authorization
                }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        //postCheckIn: function (authorID, authorIDType, learnerID, activityID, roomID, statusTS) {
        //    var baseUrl = services.services.myLearningService.url.training.postCheckIn,
        //        url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
        //        deferred = $q.defer(),
        //        authorization = jwt || '',
        //        parameters = { AuthorID: authorID, AuthorIDType: authorIDType, LearnerID: learnerID, ActivityID: activityID, RoomID: roomID, StatusTS: statusTS };
        //    $log.debug("postCheckIn (" + authorID + "," + authorIDType + "," + learnerID + "," + activityID + "," + roomID + "," + statusTS + ") URL: " + wsUrl);
        //    doPostQuery(url, parameters, {
        //        cache: false,
        //        headers: {
        //            'Authorization': authorization,
        //            'Content-Type': 'application/json'
        //        }
        //    }).then(function (data) {
        //        deferred.resolve(data);
        //    }, function (error) {
        //        deferred.reject(error);
        //    });
        //    return deferred.promise;
        //},

        postCheckIn: function (authorID, authorIDType, learnerID, activityID, roomID, statusTS) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.myLearningService.serviceName,
                action: this.postCheckInSecured,
                params: { authorID: authorID, authorIDType: authorIDType, learnerID: learnerID, activityID: activityID, roomID: roomID, statusTS: statusTS }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        postCheckInSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.postCheckIn,
                url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'POST', {
                cache: false,
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json'
                }
            }, params).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        postCheckOut: function (authorID, authorIDType, learnerID, activityID, statusTS) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.myLearningService.serviceName,
                action: this.postCheckOutSecured,
                params: { authorID: authorID, authorIDType: authorIDType, learnerID: learnerID, activityID: activityID, statusTS: statusTS }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        postCheckOutSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.postCheckOut,
                url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'POST', {
                cache: false,
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json'
                }
            }, params).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        //postAttendanceInfo: function (authorID, authorIDType, learnerID, activityID, participation, comments, statusTS) {
        //    var baseUrl = services.services.myLearningService.url.training.postAttendanceInfo,
        //        url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
        //        deferred = $q.defer(), authorization = jwt || '',
        //        parameters = { AuthorID: authorID, AuthorIDType: authorIDType, LearnerID: learnerID, ActivityID: activityID, Participation: participation, Comments: comments, StatusTS: statusTS };
        //    $log.debug("postAttendanceInfo (" + authorID + "," + authorIDType + "," + learnerID + "," + activityID + "," + participation + "," + comments + "," + statusTS + ") URL: " + wsUrl);
        //    doPostQuery(url, parameters, {
        //        cache: false,
        //        headers: {
        //            'Authorization': authorization,
        //            'Content-Type': 'application/json'
        //        }
        //    }).then(function (data) {
        //        deferred.resolve(data);
        //    }, function (error) {
        //        deferred.reject(error);
        //    });
        //    return deferred.promise;
        //}

        postAttendanceInfo: function (authorID, authorIDType, learnerID, activityID, participation, comments, statusTS) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.myLearningService.serviceName,
                action: this.postAttendanceInfoSecured,
                params: { authorID: authorID, authorIDType: authorIDType, learnerID: learnerID, activityID: activityID, participation: participation, comments: comments, statusTS: statusTS }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        postAttendanceInfoSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.postAttendanceInfo,
                url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'POST', {
                cache: false,
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json'
                }
            }, params).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        //strip_tags:  function(input, allowed) {
        //        allowed = (((allowed || '') + '')
        //          .toLowerCase()
        //          .match(/<[a-z][a-z0-9]*>/g) || [])
        //          .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        //        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        //          commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        //        return input.replace(commentsAndPhpTags, '')
        //          .replace(tags, function($0, $1) {
        //              return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        //          });
        //    },

        getVenue: function (facilityID) {
            var deferred = $q.defer();
            if (services.environment === envs.MOCK) {
                var baseUrl = services.services.myLearningService.url.training.getVenue,
                    wsUrl = methods.urlFormat(baseUrl),
                    counter = 1;
                $log.debug("Get Ongoing Events List URL: " + baseUrl);
                doGetQuery(deferred, wsUrl, counter);
            }
            else {
                authService.callService({
                    serviceName: services.services.myLearningService.serviceName,
                    action: this.getVenueSecured,
                    params: { facilityID: facilityID }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        },

        getVenueSecured: function (jwt, params) {
            var baseUrl = services.services.myLearningService.url.training.getVenue,
                url = methods.urlFormat(baseUrl, params.facilityID, services.services.myLearningService.apiKey, sha256Encrypt()),
                deferred = $q.defer(),
                authorization = jwt || '';
            httpService.fetchData(url, 'GET', {
                cache: false,
                headers: {
                    'Authorization': authorization
                }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }



    };
}
    ]
);