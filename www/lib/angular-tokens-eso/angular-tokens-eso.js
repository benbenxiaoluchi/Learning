/*
 * angular-tokens-eso.js
 *
 * An Angular module that gives access to the eso bootstrap and service tokens. Tokens are stored
 * in local storage in the browser. Service calls are separate and when 401 errors occurs,
 *
 * @version v0.0.1 - 2014-11-22
 * @author chidave <david.cornelson@accenture.com>
 *
 */

var tokensEsoProviderModule = angular.module('tokensEsoProviderModule', []);

tokensEsoProviderModule.provider('tokensEsoData', function() {

    var config = {
        clientId: '',
        realm: '',
        hostName: ''
    };

    this.setClientId = function(clientId) {
        config.clientId = clientId;
    };

    this.setRealm = function(realm) {
        config.realm = realm;
    };

    this.setHostName = function(hostName) {
        config.hostName = hostName;
    };

    this.$get = function() {
        return config;
    };

});

var tokensEsoServiceModule = angular.module('tokensEsoService',['LocalStorageModule','tokensEsoProviderModule']);

tokensEsoServiceModule.factory('tokensEso', ['localStorageService','$q','$log','$http','tokensEsoData', function(localStorageService,$q,$log,$http,tokensEsoData) {

    var internal = {

        win: null,
        storeBootstrapToken: null,
        timeoutCounter: 15,

        getServiceToken: function (serviceName, serviceIdentifier, force) {
            deferred: $q.defer();

            internal._getBootstrapToken(force).then(function (bootstrapToken) {
                internal._getJWTFromBootstrapToken(bootstrapToken, serviceName, serviceIdentifier).then(function (serviceJWT) {
                    return deferred.resolve(serviceJWT);
                }, function() { deferred.reject(); });
            }, function() { deferred.reject();});

            return deferred.promise;
        },

        _checkConfiguration: function() {
            if (tokensEsoData.clientId == null || tokensEsoData.clientId == "") {
                $log.error("Invalid clientId. Use tokensEsoDataProvider in .Config() of your app.js.");
                return false;
            }
            if (tokensEsoData.realm == null || tokensEsoData.realm == "") {
                $log.error("Invalid realm. Use tokensEsoDataProvider in .Config() of your app.js.");
                return false;
            }
            if (tokensEsoData.hostName == null || tokensEsoData.hostName == "") {
                $log.error("Invalid hostName. Use tokensEsoDataProvider in .Config() of your app.js.");
                return false;
            }

            return true;
        },

        _getBootstrapToken: function (force) {
            var deferred = $q.defer();
            var bootstrapToken = null;
            
            if (!force) {
                bootstrapToken = localStorageService.get('rebar.bootstrapToken');
            }
           
            if (bootstrapToken == null || bootstrapToken == "") {
                internal._popLogin().then(function (token) {
                    bootstrapToken = token;
                    localStorageService.set('rebar.bootstrapToken', bootstrapToken);
                    deferred.resolve(bootstrapToken);
                }, function (message) {
                    deferred.reject(message);
                });
            } else {
                deferred.resolve(bootstrapToken);
            }

            return deferred.promise;
        },

        //
        // This is the same code used by the stream service...when we have the new RP ready, it will be
        // updated accordingly.
        //
        _popLogin: function() {

            var deferred = $q.defer();

            internal.storeBootstrapToken = null;

            console.log('online???' + navigator.onLine);
            //if (navigator.onLine) {
                //
                // Open Cordova popup to login URL.
                //
                var login_url = 'https://' + tokensEsoData.hostName + '/adfs/ls?' + 'wa=wsignin1.0' + '&wtrealm=' + encodeURIComponent('https://' + tokensEsoData.hostName + tokensEsoData.realm) + '&wctx=' + encodeURIComponent('rm=0&id=passive&ru=' + encodeURIComponent(tokensEsoData.realm + '?ClientId=' + tokensEsoData.clientId));
                internal.win = window.open(login_url, '_blank', 'location=no,toolbar=no');
                //
                // Since Cordova does not support window to window messaging, we need to use this somewhat hacky method
                // to catch the results of the popup window every time the page is done loading.
                //

                internal.win.addEventListener('loadstop', function (e) {
                    //
                    // Page is loaded. Check if the URL is what we expect.
                    //
                    if (e.url.toLowerCase().indexOf(tokensEsoData.realm) > -1) {
                        $log.debug("Found realm form post...");
                        //
                        // Grab the bootstrapToken Token by executing a script on the popup window.
                        //
                        internal.win.executeScript({code: "if (document.getElementById('Token') != null) { document.getElementById('Token').getAttribute('value');}"},
                            function (values) {
                                //
                                // Get token from hidden field.
                                //
                                var bootstrapToken = decodeURIComponent(values[0]);
                                $log.debug("Got token: " + values[0]);
                                //
                                // Close pop up window.
                                //
                                internal.win.close();

                                //
                                // Write the token to the console for debugging purposes.
                                //
                                $log.debug("Bootstrap Token: " + bootstrapToken);

                                //
                                // If we have a non null value, send it to the provided callback function.
                                //
                                if (bootstrapToken !== null && bootstrapToken != "") {
                                    $log.debug("Bootstrap Token received: " + bootstrapToken);
                                    internal.storeBootstrapToken = bootstrapToken;
                                    deferred.resolve(internal.storeBootstrapToken);

                                } else {
                                    $log.error("Bootstrap Token not found.");
                                    deferred.reject("Failed to retrieve token.");
                                }
                            });
                    }

                });
            //}
            //else {
            //    //
            //    // Call the provided offline function.
            //    //
            //    deferred.reject("offline");
            //}

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

            var serviceToken = localStorageService.get('rebar.' + serviceName + '.JWT_access_token');

            if (serviceToken == null || serviceToken == '') {

                var ajaxUrl = "https://" + tokensEsoData.hostName + "/services/jwt/issue/adfs";
                var postData = "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + encodeURIComponent(bootstrapToken) + "&scope=" + encodeURIComponent(serviceIdentity);
                $http({
                    method: 'POST',
                    url: ajaxUrl,
                    data: postData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data, status, headers, config) {
                    $log.debug("Received JWT Access Token: " + data.access_token);
                    console.log('set jwt into localstorage - ' + data.access_token);
                    localStorageService.set('rebar.' + serviceName + '.JWT_access_token', data);
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    $log.error("Received JWT Error: " + data);
                    deferred.reject(data);
                });
            } else {
                deferred.resolve(serviceToken);
            }
            return deferred.promise;
        },

        //
        // Clear out all tokens and logout from sts.
        //
        // Wait for 'wa=wsignoutcleanup1.0'
        //
        _logout: function() {
            var deferred = $q.defer();
            internal.win = window.open('https://' + tokensEsoData.hostName + '/adfs/ls/?wa=wsignout1.0', '_blank', 'location=no,toolbar=no');
            internal.win.addEventListener('loadstop', function (e) {
                internal.win.close();
                localStorageService.clearAll();
                deferred.resolve();
            });

            return deferred.promise;
        }
    };

    return {
        getServiceToken: internal.getServiceToken,
        getBootstrapToken: internal._getBootstrapToken,
        getJWTFromBootstrapToken: internal._getJWTFromBootstrapToken,
        logout: internal._logout
    };

}]);
