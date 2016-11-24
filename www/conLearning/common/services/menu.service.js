/*global factories, angular, FileUploadOptions */

'use strict';

factories.factory('menuService',
    ['$q', '$http', '$log', 'connectedLearning.constants', 'environmentData', 'connectedLearning.methods', '$cordovaFile', 'authService', 'localStorageService', '$ionicLoading', 'connectedLearning.constants.environments','securityService',
function ($q, $http, $log, constants, services, methods, $cordovaFile, authService, localStorageService, $ionicLoading, envs, securityService) {
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
    /// <doc>myExpenses.services:menuService</doc>

    //#region Model
    /// <summary>
    ///  Model to manage training Information.
    /// </summary>
    /// <doc>myExpenses.services:menuService!menuModel</doc>
    var menuModel = [],

     /// <summary>
    ///  Model to manage Activity Information.
    /// </summary>
    /// <doc>myExpenses.services:menuService!activityModel</doc>
    activityModel = [],

    /// <summary>
    ///  Model to manage Profile Information.
    /// </summary>
    /// <doc>myExpenses.services:menuService!profileinfoModel</doc>
    profileinfoModel = [],

    // Current observation.
    currentObservation = []

    //#region Common WS Retry functionality
    function doGetQuery(deferred, url, counter) {
        /// <summary>
        ///  Function to do retrys on get queries
        /// <param name="deferred">defer constant.</param>
        /// <param name="url">complete url where the post service is located</param>
        /// <param name="counter">An initial counter.</param>
        /// <param name="optionalParameters">Optional input parameters.</param>
        /// </summary>
        //debugger

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

    function sha256Encrypt() {
        var keyToBeEncrypted = services.services.myLearningService.apiKey + services.services.myLearningService.secretKey + Date.now().toString().substr(0, 10);
        var sigValue = CryptoJS.SHA256(keyToBeEncrypted);

        return String(sigValue);
    }

    function followEmployee(jwt, params) {
        var baseUrl = services.services.circleService.url.stream.follow,
            url = methods.urlFormat(baseUrl, params.eid),
            deferred = $q.defer(), authorization = jwt || '',
            //2
            parameters = { EIDOfPersonToFollow: params.eid };
        doPostQuery(url, parameters, {
            cache: false,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            }
        }).then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    //#endregion

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

    return {
        getProfileImageModel: function (eID) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myExpenses.services:menuService#getProfileImage</doc>
            var baseUrl = services.services.myLearningService.url.menu.getProfilePicture,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, eID, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, eID),
                deferred = $q.defer(),
                counter = 1;

            if (menuModel.length == 0) {
                doGetQuery(deferred, wsUrl, counter);
            } else {
                deferred.resolve(menuModel);
            }

            return deferred.promise;
        },

        getFullNameModel: function (eID) {
            /// <summary>
            /// Get activity
            /// </summary>
            /// <param name="activityID">Facility is looked up from users' actiivity.</param>
            /// <param name="RecordCount">1- returns all; positive will returned configured number of records par request for infinite scroll (20 records).</param>
            /// <param name="ReturnSetFlag">1 - participants.</param>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myExpenses.services:menuService#getFullName</doc>
            
            var baseUrl = services.services.myLearningService.url.menu.getFullName,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, eID, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, eID),
                deferred = $q.defer(),
                counter = 1;
            // alert(activityID);alert(RecordCount);alert(ReturnSetFlag);alert(baseUrl);alert(wsUrl);
            //alert(wsUrl);
            if (activityModel.length == 0) {
                doGetQuery(deferred, wsUrl, counter);
            } else {
                deferred.resolve(activityModel);
            }
            
            return deferred.promise;
        },


        getProfileInfoModel: function (eID) {
            /// <summary>
            /// Get user profile information
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myExpenses.services:menuService#getProfileInfo</doc>
            var baseUrl = services.services.myLearningService.url.menu.getProfileInfo,
                wsUrl = services.environment === envs.STAGE || services.environment === envs.PROD ? methods.urlFormat(baseUrl, eID, services.services.myLearningService.apiKey, sha256Encrypt()) : methods.urlFormat(baseUrl, eID),
                deferred = $q.defer(),
                counter = 1;

            if (menuModel.length == 0) {
                doGetQuery(deferred, wsUrl, counter);
            } else {
                deferred.resolve(menuModel);
            }

            return deferred.promise;
        },

        getCurrentObservation: function (zip) {
            ///
            var baseUrl = services.services.myLearningService.url.weather.getCurrentObservation,
                wsUrl = methods.urlFormat(baseUrl, zip),
                deferred = $q.defer(),
                counter = 1;

            if (currentObservation.length == 0) {
                doGetQuery(deferred, wsUrl, counter);
            } else {
                deferred.resolve(currentObservation);
            }

            return deferred.promise;
        },

        follow: function (eid) {
            var deferred = $q.defer();
            authService.callService({
                serviceName: services.services.circleService.serviceName,
                //1
                action: followEmployee,
                params: { eid: eid }
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getFacilityList: function () {
            var deferred = $q.defer();
            if (services.environment === envs.MOCK) {
                var baseUrl = services.services.myLearningService.url.apis.getFacilityList,
                    wsUrl = methods.urlFormat(baseUrl),
                    counter = 1;
                $log.debug("Get Single Facility URL: " + baseUrl);

                doGetQuery(deferred, wsUrl, counter);
            }
            else {
                authService.callService({
                    serviceName: services.services.myLearningService.serviceName,
                    action: this.getFacilityListSecured,
                    params: {}
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        },

        getFacilityListSecured: function (jwt) {
            var baseUrl = services.services.myLearningService.url.apis.getFacilityList,
                url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
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
}]
);