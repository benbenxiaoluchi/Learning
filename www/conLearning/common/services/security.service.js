/// <reference path="../../../typings/tsd.d.ts" />
(function (angular) {
    "use strict";
    factories.factory('securityService', ['$http', '$q', '$log', '$ionicPlatform', '$ionicHistory', '$state', 'tokensEso', 'environmentData',
        function ($http, $q, $log, $ionicPlatform, $ionicHistory, $state, tokensEso, constants) {
            var dataFactory = (function () {
                function dataFactory() {
                    this.data = null;
                    this.status = null;
                    this.headers = null;
                    this.config = null;
                    this.accessTokens = [];
                    this.accessTokenPromise = null;
                }
                dataFactory.prototype.setOutput = function (data, status, headers, config) {
                    this.data = data;
                    this.status = status;
                    this.headers = headers;
                    this.config = config;
                };
                //#region Service Calls
                //
                // Proxy method that gets ESO tokens (logs in as needed) and calls named service...
                //
                // ServiceParameters: { serviceName: '', action: '', params: '', postData: '', accessToken: '' }
                //
                dataFactory.prototype.callService = function (serviceParameters) {
                    //var deferred = $q.defer();
                    var _this = this;
                    return this.getToken(serviceParameters.serviceName).then(function (jwt) {
                        // set jwt in the access token
                        serviceParameters.accessToken = jwt;
                        return _this._serviceFactory(serviceParameters);
                    });
                    //return deferred.promise;
                };
                /*
                 *
                 * */
                dataFactory.prototype.addToken = function (serviceName, access_token) {
                    this.accessTokens.push({
                        serviceName: serviceName,
                        accessToken: access_token
                    });
                };
                dataFactory.prototype.getToken = function (serviceName) {
                    var _this = this;
                    var deferred = $q.defer();
                    try {
                        var serviceToken = this._findServiceToken(serviceName);
                        if (serviceToken != null && typeof serviceToken.accessToken == 'string') {
                            deferred.resolve(serviceToken.accessToken);
                        }
                        else if (serviceToken == null) {
                            //$ionicPlatform.ready(function () {
                                tokensEso.getAccessToken(serviceName).then(function (jwt) {
                                    _this._updateToken(serviceName, jwt.access_token);
                                    deferred.resolve(jwt.access_token);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            //});
                            /*$ionicPlatform.ready(function () {
                                methods.isOffline().then(function (isOffline) {
                                    if (isOffline == true) {
                                        deferred.reject();
                                    }
                                    else {
                                        tokensEso.getAccessToken(serviceName).then(function (jwt) {
                                            _this._updateToken(serviceName, jwt.access_token);
                                            deferred.resolve(jwt.access_token);
                                        }, function (error) {
                                            deferred.reject(error);
                                        });
                                    }
                                });
                            });*/
                            this.accessTokens.push({
                                serviceName: serviceName,
                                accessToken: deferred.promise
                            });
                        }
                        else {
                            return serviceToken.accessToken;
                        }
                    }
                    catch (error) {
                        deferred.reject(error);
                    }
                    return deferred.promise;
                };
                dataFactory.prototype._updateToken = function (serviceName, token) {
                    for (var i = 0; i < this.accessTokens.length; i++) {
                        if (this.accessTokens[i].serviceName == serviceName) {
                            this.accessTokens[i].accessToken = token;
                            break;
                        }
                    }
                };
                dataFactory.prototype.logout = function () {
                    tokensEso.logout();
                };
                //
                // Factory method that provides calls to data services...
                //
                // ServiceParameters: { serviceName: '', action: '', params: '', postData: '', access_token: '' }
                //
                dataFactory.prototype._serviceFactory = function (serviceParameters) {
                    var _this = this;
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
                    serviceParameters.action(jwt, serviceParameters.params).then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        /*if (error.status == constants.status.offline) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $state.go('app.offline', null, { location: "replace" });
                            return;
                        }
                        if ((error.status == constants.status.serviceunavailable404) || (error.status == constants.status.serviceunavailable500)) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $state.go('app.serviceunavailable', null, { location: "replace" });
                            return;
                        }*/
                        $log.error(error.data);
                        _this.setOutput(error.data, error.status, error.headers, error.config);
                        if ((error.status != 401) && (error.status != 403)) {
                            $log.debug('Error found. not retrying due is not 401 and 403.');
                            deferred.reject(error);
                        }
                        else {
                            // manage recursive calls due 401 or 403 errors
                            serviceParameters.notAuthorizedCounter++;
                            if (serviceParameters.notAuthorizedCounter > 2) {
                                $log.debug('401 or 403 received. Max attemps reached.');
                                deferred.reject(error);
                            }
                            else {
                                $log.debug('401 or 403 received. Retrying service call.');
                                _this._clearAccessToken(serviceParameters.serviceName);
                                _this.callService(serviceParameters).then(function (data) {
                                    deferred.resolve(data);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                        }
                    });
                    return deferred.promise;
                };
                dataFactory.prototype._findServiceToken = function (serviceName) {
                    var serviceToken = null;
                    for (var i = 0; i < this.accessTokens.length; i++) {
                        if (this.accessTokens[i].serviceName == serviceName) {
                            serviceToken = this.accessTokens[i];
                            break;
                        }
                    }
                    return serviceToken;
                };
                dataFactory.prototype._clearAccessToken = function (serviceName) {
                    var index = -1;
                    for (var i = 0; i < this.accessTokens.length; i++) {
                        if (this.accessTokens[i].serviceName == serviceName) {
                            index = i;
                            break;
                        }
                    }
                    if (index > -1) {
                        this.accessTokens.splice(index, 1);
                    }
                };
                return dataFactory;
            })();
            var factory = new dataFactory();
            return factory;
        }
    ]);
})(angular);
//# sourceMappingURL=security.service.js.map