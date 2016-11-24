/*global angular, factories */

'use strict';

factories.factory('aclAuthService',
    ['$q', '$injector', 'connectedLearning.constants', 'connectedLearning.methods', 'environmentData', 'localStorageService', 'connectedLearning.constants.environments', 'cache', '$ionicPlatform', '$rootScope', 'esoAutomation',
        function ($q, $injector, constants, methods, environmentData, localStorageService, environments, cache, $ionicPlatform, $rootScope, esoAutomation) {
            /// <summary>
            /// Service created to manage myExpenses JWT.
            /// </summary>
            /// <param name="constants">Application constants.</param>
            /// <param name="methods">Application common methods injection.</param>
            /// <returns type="object">Service object.</returns>
            /// <doc>myExpenses.services:authService</doc>

            //#region Model
            /// <summary>
            ///  Model to manage expenses Information.
            /// </summary>
            /// <doc>myExpenses.services:authService!authModel</doc>
            var authModel = {
                jwt: '',
                claims: {
                    enterpriseId: '',
                    countryCode: '',
                    orgUnit: ''
                },
                isLogging: false
            },

            //#endregion

            //#region Constants
                claimEnterpriseId = 'enterpriseid',
                claimCountryCode = 'countrycode',
                claimOrgUnit = 'businessorgcode',
                base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
            //#endregion

            function getJWT() {
                /// <summary>
                /// Get the JWT from the model to be used and shared by injection.
                /// </summary>
                /// <returns type="object">Model.</returns>
                /// <doc>myExpenses.services:authService#getJWT</doc>
                if (!authModel.jwt) {
                    var cacheJWT = cache.getAccessToken();
                    if (cacheJWT) {
                        authModel.jwt = cacheJWT;
                    }
                }

                return authModel.jwt;
            }

            function setJWT(jwt) {
                /// <summary>
                /// Set the JWT into the model.
                /// </summary>
                /// <returns type="object">Model.</returns>
                /// <doc>myExpenses.services:authService#setJWT</doc>

                cache.setAccessToken(jwt);
                authModel.jwt = jwt;
            }

            function getAccessToken() {
                if (constants.isBrowser) {
                    return getAccessTokenWithESOWS();
                } else {
                    return getAccessTokenWithESOPopup();
                }
            }

            function getAccessTokenWithESOPopup() {
                var tokensEso = $injector.get('tokensEso'); // Added here to avoid circular dependency problem
                return tokensEso.getAccessToken(environmentData.services.myLearningService.appName)
                    .then(function (jwt) {
                        console.log('jwt PROVIDED by service!!');
                        // Store JWT
                        if (!methods.isEmptyOrNull(jwt) && !methods.isEmptyOrNull(jwt.access_token)) {
                            setJWT(jwt.access_token);
                            //authModel.jwt = jwt.access_token;
                        }
                        return jwt;
                        //deferred.resolve(jwt);
                    }, function (data) {
                        return $q.reject({ data: data, status: 500 });
                        //deferred.reject({ data: data, status: 500 });
                    }
                );
            }

            /**
             * Show the login form, hide it when the login is validated and return the JWT promise.
             * @return {Promise} of the JWT
             */
            function getAccessTokenWithESOWS() {
                $rootScope.showLogin = true;
                return esoAutomation.getAccessTokenByForm().then(function (jwt) {
                    setJWT(jwt.access_token);
                    $rootScope.showLogin = false;
                });
            }

            //base64 decode
            function base64decode(str) {
                var c1, c2, c3, c4;
                var i, len, out;
                len = str.length;
                i = 0;
                out = "";
                while (i < len) {
                    /* c1 */
                    do {
                        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    }
                    while (i < len && c1 == -1);
                    if (c1 == -1)
                        break;
                    /* c2 */
                    do {
                        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    }
                    while (i < len && c2 == -1);
                    if (c2 == -1)
                        break;
                    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                    /* c3 */
                    do {
                        c3 = str.charCodeAt(i++) & 0xff;
                        if (c3 == 61)
                            return out;
                        c3 = base64DecodeChars[c3];
                    }
                    while (i < len && c3 == -1);
                    if (c3 == -1)
                        break;
                    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                    /* c4 */
                    do {
                        c4 = str.charCodeAt(i++) & 0xff;
                        if (c4 == 61)
                            return out;
                        c4 = base64DecodeChars[c4];
                    }
                    while (i < len && c4 == -1);
                    if (c4 == -1)
                        break;
                    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
                }
                return out;
            }


            var getClaimsPromise = null;

            return {
                // Model Management
                getJWT: getJWT,
                setJWT: setJWT,
                getClaims: function () {
                    /// <summary>
                    /// Get the claims from the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>myExpenses.services:authService#getClaims</doc>
                    if (getClaimsPromise) {
                        return getClaimsPromise;
                    }

                    //var deferred = $q.defer();
                    var self = this;

                    var isDomReady = document.readyState === 'complete';

                    // Devices is ready
                    var resultPromise;
                    if (isDomReady) {
                        resultPromise = _getToken();
                    } else {
                        // devices is not ready, meanwhile JS package are not loaded. we can add litener into ready queue.
                        resultPromise = $q(getTokenPromiseWrapper);
                    }
                    // The same promise is returned as long as it is not resolved, to avoid conflicts between multiple pop-ups
                    // With asynchronous calls, it may happen sometimes that 2 calls of getClaims are done on the same time,
                    // and 2 separate promises are returned (check if we can fix it). In this case, conflict will happen
                    // if login is required with ESO pop-up window.
                    return getClaimsPromise = resultPromise.then(function (result) {
                        getClaimsPromise = null;
                        return result;
                    }, function (error) {
                        getClaimsPromise = null;
                        return $q.reject(error);
                    });
                    //return deferred.promise;

                    function getTokenPromiseWrapper(resolve, reject) {
                        $ionicPlatform.ready(function () { _getToken().then(resolve, reject) });
                    }
                    function _getToken() {
                        isDomReady = true;
                        return self.getTokens().then(function (jwt) { // getToken first
                            // Claims is empty
                            if (authModel.claims.enterpriseId === '') {
                                // Get Claims from service
                                return self.getProfileInformation();
                            } else {
                                return authModel.claims;
                            }
                        });
                    }
                },
                setClaims: function (claims) {
                    /// <summary>
                    /// Set the claims into the model.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>myExpenses.services:authService#setClaims</doc>

                    authModel.claims = claims;
                },
                getEnterpriseId: function () {
                    /// <summary>
                    /// Get the EnterpriseId from the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>myExpenses.services:authService#getEnterpriseId</doc>

                    return authModel.claims.enterpriseId;
                },

                getProfileInformation: function (jwt) {
                    var claims = { enterpriseId: '' },
						//usersService = $injector.get('usersService'),
						data = base64decode(jwt);//decodeURIComponent(escape($base64.decode(jwt)));											
                    return data;
                },


                // Service calls
                getTokens: function (refresh) {
                    /// <summary>
                    /// Get myExpenses JWT Tokens.
                    /// </summary>
                    /// <doc>myExpenses.controllers:authService#getTokens</doc>

                    //var deferred = $q.defer();
                    var jwt = getJWT();

                    if ((refresh || jwt === '') && environmentData.environment != environments.MOCK) {
                        // Get token
                        return getAccessToken();

                    } else {
                        return $q.when(jwt);
                        //deferred.resolve(jwt);
                    }

                    //return deferred.promise;
                }

            };
        }
    ]
);
    


factories.factory('authHttpInterceptor', ['$rootScope', 'connectedLearning.constants', 'connectedLearning.methods', 'environmentData', 'aclAuthService', '$location', '$q', '$cordovaToast',
    function ($rootScope, constants, methods, services, authService, $location, $q, $cordovaToast) {

            // If we want to have a list of ignored domains here. Should update the usage of 'indexOf' in the rest of the code.
            //var ignoredDomains = ['googleapis.com', 'azurewebsites.net'];
            //
            //function isErrorIgnored(url) {
            //    for (var i = 0; i < ignoredDomains.length; i++) {
            //        //rejection.config.url.indexOf('azurewebsites.net') === -1
            //        if (url.indexOf(ignoredDomains[i]) !== -1) {
            //            return true;
            //        }
            //    }
            //    return false;
            //}
            function manageError($rootScope, rejection){
                $rootScope.errorInfo.counter = 1;
                $rootScope.errorInfo.status = rejection.status;
                $rootScope.errorInfo.message = JSON.stringify(rejection.data);
                $rootScope.showSplash = false;
                console.log($rootScope.errorInfo.message);

                if (!constants.isBrowser) { // Cordova plugin
                    var msg = 'There was an issue while processing your request, please try again.';
                    $cordovaToast.showShortBottom(msg);
                    //$Crittercism.failTransaction(msg);
                    //$Crittercism.logHandledException(rejection);
                }

                if (rejection.status === 503) { // We redirect to the error page when there is a maintenance on back-end
                    $location.path('/error');
                }
            }

            return {
                'request': function (config) {
                    /// <summary>
                    /// This function will manage the request adding token to the headers.
                    /// </summary>
                    /// <param name="config">Contains interception data for the request.</param>
                    /// <returns type="obj">Configuration object.</returns>
                    /// <doc>myExpenses.factory:httpInterceptorToken#request</doc>

                    // application should use JWT for services
                    console.log('-------------------------> URL = ' + config.url);

                    if (config.url.indexOf(services.services.myLearningService.url.myExpenses) === 0) {
                        var jwt = authService.getJWT();
                        // Add JWT Token to header
                        if (!methods.isEmptyOrNull(jwt)) {
                            config.headers.Authorization = "Bearer " + jwt;
                        }
                        if ($rootScope.ImpersonateStatus == true && !methods.isEmptyOrNull($rootScope.impersonationToken)) {
                            //var impersonatedToken = 'ImpersonatedToken';
                            config.headers.ImpersonatedToken = $rootScope.impersonationToken;
                        }
                    }

                    return config;
                },
            'requestError': function (rejection) {
                /// <summary>
                /// This function will manage the requestError to get the JWT.
                /// </summary>
                /// <param name="config">Contains interception data for the request.</param>
                /// <returns type="obj">Configuration object.</returns>
                /// <doc>myExpenses.factory:httpInterceptorToken#requestError</doc>

                    if (rejection.status === 503) {
                        manageError($rootScope, rejection);
                    } else if (rejection.status === 401) {
                        console.log("Error 401 - Unauthorized (responseError)");
                        // SetUp new promise
                        var newPromise = $q.defer();

                        authService.getTokens().then(
                            function () {
                                console.log('getTokens - OK');
                                newPromise.reject(rejection);
                            },
                            function (data, status) {
                                console.log('getTokens - Error');
                                newPromise.reject(rejection);
                            }
                        );

                        // Return new promise
                        return newPromise.promise;

                    } else if (rejection.config.url.indexOf('azurewebsites.net') === -1 && !($rootScope.errorInfo.loading)) {

                        if ($rootScope.errorInfo.counter === 3) {
                            $rootScope.errorInfo.loading = true;
                            manageError($rootScope, rejection);
                        }

                        $rootScope.errorInfo.counter = $rootScope.errorInfo.counter + 1;
                    }

                    // Reject
                    return $q.reject(rejection);
                },
                'responseError': function (rejection) {
                    /// <summary>
                    /// This function will manage the responseError to get the JWT.
                    /// </summary>
                    /// <param name="config">Contains interception data for the request.</param>
                    /// <returns type="obj">Configuration object.</returns>
                    /// <doc>myExpenses.factory:httpInterceptorToken#responseError</doc>

                    if (rejection.status === 503) {
                        manageError($rootScope, rejection);
                    } else if (rejection.status === 401) {
                        console.log("Error 401 - Unauthorized (responseError)");
                        // SetUp new promise
                        var newPromise = $q.defer();

                        authService.getTokens(true).then(
                            function () {
                                console.log('getTokens - OK');
                                newPromise.reject(rejection);
                            },
                            function (data, status) {
                                console.log('getTokens - Error');
                                newPromise.reject(rejection);
                            }
                        );

                        // Return new promise
                        return newPromise.promise;
                    } else if (rejection.config.url.indexOf('azurewebsites.net') === -1 && !($rootScope.errorInfo.loading)) {

                        if ($rootScope.errorInfo.counter === 3) {
                            $rootScope.errorInfo.loading = true;
                            manageError($rootScope, rejection);
                        }

                        $rootScope.errorInfo.counter = $rootScope.errorInfo.counter + 1;
                    }

                    // Reject
                    return $q.reject(rejection);
                }
            };
        }]
);