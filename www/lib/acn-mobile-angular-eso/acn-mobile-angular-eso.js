/*
 * acn-mobile-angular-eso.js
 *
 * An Angular module that gives access to the eso bootstrap and service tokens. Tokens are stored
 * in local storage in the browser. Service calls are separate and when 401 errors occurs,
 *
 * @version v1.0.0 - 27-Jan-2015
 * @author <david.cornelson@accenture.com>
 *
 */

//
// Module for constants...
//
angular.module('esoSettingsModule', [])
    .constant('ESO_SETTINGS', {
        'ENVIRONMENT_PROD': 1,
        'ENVIRONMENT_STAGE': 2,
        'AUTH_METHOD_PASSWORD': 1,
        'AUTH_METHOD_VIP': 2
    });

var tokensEsoProviderModule = angular.module('tokensEsoProviderModule', []);

//
// Provider for eso token library configuration...
//
tokensEsoProviderModule.provider('tokensEsoData', function () {

    var config = {
        clientIds: [],
        services: [],
        authMethod: '',
        esoEnvironment: '',
        useTest: false
    };

    this.addClientId = function (environment, clientId) {
        config.clientIds.push(
            {
                environment: environment,
                clientId: clientId
            }
        );
    };

    this.addService = function (serviceName, serviceIdentifier) {
        config.services.push(
            {
                name: serviceName,
                identifier: serviceIdentifier
            }
        );
    };

    this.setAuthMethod = function (authMethod) {
        config.authMethod = authMethod;
    };

    this.useTestEnvironment = function (useTest) {
        config.useTest = useTest;
    };

    this.setESOEnvironment = function (esoEnvironment) {
        config.esoEnvironment = esoEnvironment;
    };

    this.$get = function () {
        return {
            config: config
        };

    };

});

var tokensEsoServiceModule = angular.module('tokensEsoService', ['LocalStorageModule', 'tokensEsoProviderModule', 'esoSettingsModule']);

tokensEsoServiceModule.factory('tokensEso', ['localStorageService', '$q', '$log', '$http', 'tokensEsoData', 'ESO_SETTINGS', function (localStorageService, $q, $log, $http, tokensEsoData, ESO_SETTINGS) {

    var internal = {

        win: null,
        loginInProgress: false,

        constants: {
            ESO_ENVIRONMENT_PROD: 'federation-sts.accenture.com',
            ESO_ENVIRONMENT_STAGE: 'federation-sts-stage.accenture.com',
            AUTH_METHOD_PASSWORD: '/mobile/signon/enterprise/',
            AUTH_METHOD_VIP: '/mobile/signon/vip/',
            BOOTSTRAP_TOKEN_NAME: 'bootstrapToken',
            ACCESS_TOKEN_SUFFIX: '.access_token'
        },

        _loginTimeout: function () {
            if (!internal.loginInProgress) return;

            //
            // Delay for 1 second before trying again...
            //
            setTimeout(internal._loginTimeout, 1000);
        },

        getAccessToken: function (serviceName) {
            internal._loginTimeout();
            internal.loginInProgress = true;
            var deferred = $q.defer();

            //
            // Validate the application ESO configuration requirements...
            //
            try {
                if (!internal._checkConfiguration()) {
                    internal.loginInProgress = false;
                    deferred.reject('Invalid configuration. Check output log for details.');
                }
            } catch (error) {
                internal.loginInProgress = false;
                deferred.reject(error);
            }

            var serviceIdentifier = internal._getServiceIdentifier(serviceName);

            internal._getBootstrapToken().then(function (bootstrapToken) {
                internal._getJWTFromBootstrapToken(bootstrapToken, serviceName, serviceIdentifier).then(function (serviceJWT) {
                    internal.loginInProgress = false;
                    deferred.resolve(serviceJWT);
                }, function (error) {
                    internal.loginInProgress = false;
                    deferred.reject(error);
                });
            }, function (error) {
                internal.loginInProgress = false;
                deferred.reject(error);
            });

            return deferred.promise;
        },

        //
        // TO DO - Rewrite and integrate...
        //
        _checkConfiguration: function () {

            //
            // Force our LocalStorage to start with our environment clientId...
            //
            localStorageService.changePrefix(internal._getClientId());

            //if (tokensEsoData.clientId == null || tokensEsoData.clientId == "") {
            //    $log.error("Invalid clientId. Use tokensEsoDataProvider in .Config() of your app.js.");
            //    return false;
            //}
            //if (tokensEsoData.realm == null || tokensEsoData.realm == "") {
            //    $log.error("Invalid realm. Use tokensEsoDataProvider in .Config() of your app.js.");
            //    return false;
            //}
            //if (tokensEsoData.hostName == null || tokensEsoData.hostName == "") {
            //    $log.error("Invalid hostName. Use tokensEsoDataProvider in .Config() of your app.js.");
            //    return false;
            //}

            return true;
        },

        _getClientId: function () {
            for (var i = 0; i < tokensEsoData.config.clientIds.length; i++) {
                if (tokensEsoData.config.clientIds[i].environment == tokensEsoData.config.esoEnvironment) {
                    return tokensEsoData.config.clientIds[i].clientId;
                }
            }

            throw new Error('ClientId not configured for selected environment.');
        },

        _getServiceIdentifier: function (serviceName) {
            for (var i = 0; i < tokensEsoData.config.services.length; i++) {
                if (tokensEsoData.config.services[i].name == serviceName) {
                    return tokensEsoData.config.services[i].identifier;
                }
            }

            throw new Error('Service not configured.');
        },

        _mungeBootstrap: function () {
            localStorageService.set(internal.constants.BOOTSTRAP_TOKEN_NAME, 'mickey mouse');
        },

        _getBootstrapToken: function () {
            var deferred = $q.defer();
            var bootstrapToken = null;

            try {
                bootstrapToken = localStorageService.get(internal.constants.BOOTSTRAP_TOKEN_NAME);
            } catch (error) {
                deferred.reject(error);
            }

            try {
                if (bootstrapToken == null || bootstrapToken == "") {
                    internal._popLogin().then(function (token) {
                        if (token == null) {
                            deferred.reject('Login returned a NULL token.');
                        } else {
                            localStorageService.set(internal.constants.BOOTSTRAP_TOKEN_NAME, token);
                            deferred.resolve(token);
                        }
                    }, function (message) {
                        deferred.reject(message);
                    });
                } else {
                    deferred.resolve(bootstrapToken);
                }
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise;
        },

        //
        // This pops up the InAppBrowser to log in using the ESO...
        //
        _popLogin: function () {

            var deferred = $q.defer();

            if (navigator.onLine) {
                //
                // Open Cordova popup to login URL.
                //

                //
                // Get configured auth method and eso environment...
                //
                var authMethod = tokensEsoData.config.authMethod == ESO_SETTINGS.AUTH_METHOD_PASSWORD ? internal.constants.AUTH_METHOD_PASSWORD : internal.constants.AUTH_METHOD_VIP;
                var esoEnvironment = tokensEsoData.config.esoEnvironment == ESO_SETTINGS.ENVIRONMENT_PROD ? internal.constants.ESO_ENVIRONMENT_PROD : internal.constants.ESO_ENVIRONMENT_STAGE;

                //
                // Check if using test environment...
                //
                authMethod = tokensEsoData.config.useTest ? '/test' + authMethod : authMethod;

                var login_url = 'https://' + esoEnvironment + '/adfs/ls?' + 'wa=wsignin1.0' + '&wtrealm=' + encodeURIComponent('https://' + esoEnvironment + authMethod) + '&wctx=' + encodeURIComponent('rm=0&id=passive&ru=' + encodeURIComponent(authMethod + '?ClientId=' + internal._getClientId()));
                internal.win = window.open(login_url, '_blank', 'location=no,toolbar=no');
                //
                // Since Cordova does not support window to window messaging, we need to use this somewhat hacky method
                // to catch the results of the popup window every time the page is done loading.
                //

                internal.win.addEventListener('loadstop', function (e) {
                    //
                    // Page is loaded. Check if the URL is what we expect.
                    //
                    if (e.url.toLowerCase().indexOf(authMethod) > -1) {
                        $log.debug("Found auth method form post...");
                        //
                        // Grab the bootstrapToken Token by executing a script on the popup window.
                        //
                        internal.win.executeScript({ code: "if (document.getElementById('Token') != null) { document.getElementById('Token').getAttribute('value');}" },
                            function (value) {
                                //
                                // Get token from hidden field.
                                //
                                var bootstrapToken = '';

                                //
                                // There's a bug in the WP8 plugin that returns a string and not an array.
                                //
                                if (Array.isArray(value)) {
                                    bootstrapToken = decodeURIComponent(value[0]);
                                } else {
                                    bootstrapToken = decodeURIComponent(value);
                                }
                                $log.debug("Got token: " + bootstrapToken);

                                //
                                // Close pop up window.
                                //
                                internal.win.close();

                                // Write the token to the console for debugging purposes.
                                //
                                $log.debug("Bootstrap Token: " + bootstrapToken);

                                //
                                // If we have a non null value, send it to the provided callback function.
                                //
                                if (bootstrapToken !== null && bootstrapToken != "") {
                                    $log.debug("Bootstrap Token received: " + bootstrapToken);
                                    deferred.resolve(bootstrapToken);

                                } else {
                                    $log.error("Bootstrap Token not found.");
                                    deferred.reject("Failed to retrieve token.");
                                }
                            });
                    }

                });
            }
            else {
                //
                // Call the provided offline function.
                //
                deferred.reject("offline");
            }

            return deferred.promise;
        },

        //
        // We've either logged in or have a stored bootstrapToken. Now we want a JWT
        // for a specific service.
        //
        // Returns { access_token: '...', expires_in: '60', refresh_token: null, token_type: null }
        //
        _getJWTFromBootstrapToken: function (bootstrapToken, serviceName, serviceIdentity) {

            var deferred = $q.defer();

            $log.debug("Getting JWT from bootstrap token...");

            var esoEnvironment = tokensEsoData.config.esoEnvironment == ESO_SETTINGS.ENVIRONMENT_PROD ? internal.constants.ESO_ENVIRONMENT_PROD : internal.constants.ESO_ENVIRONMENT_STAGE;
            var ajaxUrl = "https://" + esoEnvironment + "/services/jwt/issue/adfs";
            var postData = "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + encodeURIComponent(bootstrapToken) + "&scope=" + encodeURIComponent(serviceIdentity);
            $log.debug(esoEnvironment)
            $log.debug(postData)
            try {
                $http({
                    method: 'POST',
                    url: ajaxUrl,
                    data: postData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data, status, headers, config) {
                    $log.debug("Received JWT Access Token: " + data.access_token);
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    //
                    // Bootstrap token is no longer valid...
                    // Clear local storage...
                    //

                    // added check for 400 errors because STS is handling bootstrap time outs weirdly
                    if (status == 401 || status == 400) {
                        localStorageService.clearAll();

                        //
                        // Retry...
                        //
                        internal.getAccessToken(serviceName)
                            .then(function (jwt) {
                                deferred.resolve(jwt);
                            }, function (error) {
                                $log.error(error);
                                deferred.reject(error);
                            }
                        );
                    } else {
                        deferred.reject(data);
                    }
                });
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise;
        },

        //
        // Clear out all tokens and logout from sts.
        //
        // Wait for 'wa=wsignoutcleanup1.0'
        //
        _logout: function () {
            var deferred = $q.defer();

            var esoEnvironment = tokensEsoData.config.esoEnvironment == ESO_SETTINGS.ENVIRONMENT_PROD ? internal.constants.ESO_ENVIRONMENT_PROD : internal.constants.ESO_ENVIRONMENT_STAGE;
            internal.win = window.open('https://' + esoEnvironment + '/adfs/ls/?wa=wsignout1.0', '_blank', 'location=no,toolbar=no');
            internal.win.addEventListener('loadstop', function (e) {
                internal.win.close();
                localStorageService.clearAll();
                deferred.resolve();
            });

            return deferred.promise;
        }
    };

    return {
        getAccessToken: internal.getAccessToken,
        mungeBootstrap: internal._mungeBootstrap,
        logout: internal._logout
    };

}]);
