/*global angular, factories */

factories.factory('authService', ['$http', '$q', '$log', '$ionicPlatform', 'tokensEso', 'profileService', 'recommendationsService', 'crittercismService', '$rootScope', 'connectedLearning.methods',
    function ($http, $q, $log, $ionicPlatform, tokensEso, profileService, recommendationsService, crittercismService, $rootScope, methods) {

        'use strict';

        var dataFactory = {};

        var accessTokens = [];

        // #region login management
        dataFactory.data = null;
        dataFactory.status = null;
        dataFactory.headers = null;
        dataFactory.config = null;
        dataFactory.jwt = null;
        //
        // Store "last" returned data in factory globals...
        //
        dataFactory.setOutput = function (data, status, headers, config) {
            dataFactory.data = data;
            dataFactory.status = status;
            dataFactory.headers = headers;
            dataFactory.config = config;
        };
        //#endregion

        //#region Service Calls
        //
        // Proxy method that gets ESO tokens (logs in as needed) and calls named service...
        //
        // ServiceParameters: { serviceName: '', action: '', params: '', postData: '', accessToken: '' }
        //
        dataFactory.callService = function (serviceParameters) {
            var deferred = $q.defer();

            dataFactory.getToken(serviceParameters.serviceName).then(function (jwt) {
                // set jwt in the access token
                serviceParameters.accessToken = jwt;
                dataFactory.jwt = jwt;
                // only in a call that needs mylearning jwt (get recommended items , get learning details and get skills details)
                //Fix Bug#306423: Bug - [API] - Recommended Learning - No trainings and Learning boards are coming from service
                if (serviceParameters.action === recommendationsService.getLearningDetails ||
                    serviceParameters.action === recommendationsService.getRecommendedLearnings ||
                    serviceParameters.action === profileService.getSkillRecommendedLearnings) {
                    //Fix Bug#306423: Bug - [API] - Recommended Learning - No trainings and Learning boards are coming from service
                    dataFactory.getToken('myLearningService').then(function (myLjwt) {
                        // set jwt in the access token
                        serviceParameters.myLearningToken = myLjwt;

                        dataFactory._serviceFactory(serviceParameters).then(function (data) {
                            deferred.resolve(data);
                        }, function (error) {
                            $log.error(error);
                            deferred.reject(error);
                        });

                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });

                }
                else if (serviceParameters.action === profileService.getFutureSkills) {

                    dataFactory.getToken('careerPlanningService').then(function (cpjwt) {
                        // set jwt in the access token
                        serviceParameters.careerPlanningToken = cpjwt;

                        dataFactory._serviceFactory(serviceParameters).then(function (data) {
                            deferred.resolve(data);
                        }, function (error) {
                            $log.error(error);
                            deferred.reject(error);
                        });

                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });

                }
                // only in a call that needs my scheduling jwt (get my scheduling assignments)
                else if (serviceParameters.action === recommendationsService.getMySchedulingAssignments ||
                    serviceParameters.action === recommendationsService.getAssignmentDetail) {

                    dataFactory.getToken('mySchedulingService').then(function (mySjwt) {
                        // set jwt in the access token
                        serviceParameters.mySchedulingToken = mySjwt;

                        dataFactory._serviceFactory(serviceParameters).then(function (data) {
                            deferred.resolve(data);
                        }, function (error) {
                            $log.error(error);
                            deferred.reject(error);
                        });

                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });

                }
                // only in a call that needs acm jwt (get positions)
                else if (serviceParameters.action === recommendationsService.getPositionDetails ||
                    serviceParameters.action === recommendationsService.getACMPositions) {

                    dataFactory.getToken('acmService').then(function (acmjwt) {
                        // set jwt in the access token
                        serviceParameters.ACMToken = acmjwt;

                        dataFactory._serviceFactory(serviceParameters).then(function (data) {
                            deferred.resolve(data);
                        }, function (error) {
                            $log.error(error);
                            deferred.reject(error);
                        });

                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });

                }
                else {
                    dataFactory._serviceFactory(serviceParameters).then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });
                }

            }, function (error) {
                $log.error(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
        //
        // Factory method that provides calls to data services...
        //
        // ServiceParameters: { serviceName: '', action: '', params: '', postData: '', access_token: '' }
        //
        dataFactory._serviceFactory = function (serviceParameters) {
            // initialize error counter
            if (serviceParameters.notAuthorizedCounter === undefined) {
                serviceParameters.notAuthorizedCounter = 0;
            }
            var deferred = $q.defer();

            //$log.debug('Calling service...');
            //$log.debug(serviceParameters);
            //
            // Call named service with retry capabilities...
            //
            var jwt = 'Bearer ' + serviceParameters.accessToken;

            //  if my learning token is needed, send in parameters
            if (serviceParameters.myLearningToken !== undefined) {
                serviceParameters.params.myLToken = 'Bearer ' + serviceParameters.myLearningToken;
            }
            //  if career planning token is needed, send in parameters
            if (serviceParameters.careerPlanningToken !== undefined) {
                serviceParameters.params.cpToken = 'Bearer ' + serviceParameters.careerPlanningToken;
            }
            //  if my scheduling token is needed, send in parameters
            if (serviceParameters.mySchedulingToken !== undefined) {
                serviceParameters.params.mySToken = 'Bearer ' + serviceParameters.mySchedulingToken;
            }
            //  if my scheduling token is needed, send in parameters
            if (serviceParameters.mySchedulingToken !== undefined) {
                serviceParameters.params.acmToken = 'Bearer ' + serviceParameters.ACMToken;
            }

            serviceParameters.action(jwt, serviceParameters.params).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                $log.error(error.data);
                dataFactory.setOutput(error.data, error.status, error.headers, error.config);
                if (error.status !== 401) {
                    $log.debug('Error found. not retrying due is not 401.');
                    deferred.reject(error);
                } else {
                    // manage recursive calls due 401 errors
                    if (error.status === 401) {
                        serviceParameters.notAuthorizedCounter++;
                        if (serviceParameters.notAuthorizedCounter >= 2) {
                            $log.debug('401 received. Max attemps reached.');
                            deferred.reject(error);
                        }
                        else {
                            $log.debug('401 received. Retrying service call.');
                            dataFactory._clearAccessToken(serviceParameters.serviceName);
                            dataFactory.callService(serviceParameters).then(function (data) {
                                deferred.resolve(data);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    }
                }
            });

            return deferred.promise;
        };
        //#endregion

        //#region Token Management
        //
        // Get token from our cache or from ESO...
        //
        dataFactory.getToken = function (serviceName) {
            var deferred = $q.defer();
            var serviceToken = null;

            try {
                serviceToken = dataFactory._findServiceToken(serviceName);

                if (serviceToken !== null) {
                    deferred.resolve(serviceToken.accessToken);
                }
                else {
                    $ionicPlatform.ready(function () {
                        tokensEso.getAccessToken(serviceName)
                            .then(function (jwt) {
                                    accessTokens.push({
                                        serviceName: serviceName,
                                        accessToken: jwt.access_token
                                    });
                                    deferred.resolve(jwt.access_token);

                                }, function (error) {
                                    deferred.reject(error);
                                }
                            );
                    });
                }
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise;
        };
        dataFactory._clearAccessToken = function (serviceName) {
            var index = -1;
            for (var i = 0; i < accessTokens.length; i++) {
                if (accessTokens[i].serviceName === serviceName) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                accessTokens.splice(index, 1);
            }
        };
        dataFactory._findServiceToken = function (serviceName) {
            var serviceToken = null;
            for (var i = 0; i < accessTokens.length; i++) {
                if (accessTokens[i].serviceName === serviceName) {
                    serviceToken = accessTokens[i];
                    break;
                }
            }

            return serviceToken;
        };
        dataFactory.addToken = function (serviceName, access_token) {
            accessTokens.push({
                serviceName: serviceName,
                accessToken: access_token
            });
        };

        //#endregion

        dataFactory.logout = function () {
            tokensEso.logout();
        };

        dataFactory.get = function (url, authorization, transactionTag) {
            crittercismService.beginTransaction(transactionTag);
            var deferred = $q.defer();
            var header;
            if ($rootScope.ImpersonateStatus == true && !methods.isEmptyOrNull($rootScope.impersonationToken)) {
                $log.debug('Impersonate getting...');
                header = {'Authorization': authorization, 'ImpersonatedToken': $rootScope.impersonationToken}
            } else {
                header = {'Authorization': authorization}
            }

            $http.get(url, {
                cache: false,
                headers: header
            })
                .success(function (data) {
                    crittercismService.endTransaction(transactionTag);
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    crittercismService.failTransaction(transactionTag);
                    deferred.reject({ data: data, status: status, headers: headers, config: config });
                });
            return deferred.promise;
        };

        dataFactory.post = function (url, authorization, data, transactionTag) {
            crittercismService.beginTransaction(transactionTag);
            var deferred = $q.defer();
            $http.post(url, data,
                {
                    cache: false,
                    headers: {
                        'Authorization': authorization
                    }
                })
                .success(function (data) {
                    crittercismService.endTransaction(transactionTag);
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    crittercismService.failTransaction(transactionTag);
                    deferred.reject({ data: data, status: status, headers: headers, config: config });
                });
            return deferred.promise;
        };

        dataFactory.put = function (url, authorization, data, transactionTag) {
            crittercismService.beginTransaction(transactionTag);
            var deferred = $q.defer();
            $http.put(url, data,
                {
                    cache: false,
                    headers: {
                        'Authorization': authorization
                    }
                })
                .success(function (data) {
                    crittercismService.endTransaction(transactionTag);
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    crittercismService.failTransaction(transactionTag);
                    deferred.reject({ data: data, status: status, headers: headers, config: config });
                });
            return deferred.promise;
        };

        return dataFactory;

    }]);
