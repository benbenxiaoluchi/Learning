/*global factories, angular, FileUploadOptions */

'use strict';

factories.factory('impersonateService',
    ['$q', '$http', 'connectedLearning.constants', 'environmentData', 'connectedLearning.methods', '$cordovaFile', 'authService', 'localStorageService', '$log', '$ionicLoading', 'connectedLearning.constants.environments',
function ($q, $http, constants, services, methods, $cordovaFile, authService, localStorageService, $log, $ionicLoading, envs) {
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

       
    //#region Common WS Retry functionality
    function doGetQuery(deferred, url, counter) {
        /// <summary>
        ///  Function to do retrys on get queries
        /// <param name="deferred">defer constant.</param>
        /// <param name="url">complete url where the post service is located</param>
        /// <param name="counter">An initial counter.</param>
        /// <param name="optionalParameters">Optional input parameters.</param>
        /// </summary>
        
        $http.get(url, { cache: true })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data, status) {
                if (counter < 3) {
                    counter++;
                    doGetQuery(deferred, url, counter);
                } else {
                    deferred.reject({ data: data, status: status });
                }
            });
    }

    function sha256Encrypt() {
        var keyToBeEncrypted = services.services.myLearningService.apiKey + services.services.myLearningService.secretKey + Date.now().toString().substr(0, 10);
        var sigValue = CryptoJS.SHA256(keyToBeEncrypted);

        return String(sigValue);
    }
    
    //#endregion

    return {
        getACLWhitelistUser: function (jwt, params) {
            /// <summary>
            /// Get login user role
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:impersonateService#getACLWhitelistUser</doc>
            var baseUrl = services.services.myLearningService.url.impersonation.getACLWhitelistUser,
                url = methods.urlFormat(baseUrl, params.eid, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            $log.debug("Check login user access: " + url);

            return authService.get(url, authorization, 'getACLWhitelistUser');
        },

        getManageModePermission: function (jwt, params) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:impersonateService#getACLWhitelistUser</doc>
            var baseUrl = services.services.myLearningService.url.impersonation.getManageModePermission,
                url = methods.urlFormat(baseUrl, params.impersonationEid, params.impersonationPeopleKey, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            $log.debug("Get impersonation token: " + url);

            return authService.get(url, authorization, 'getManageModePermission');
        },

        getSampleSessions: function (jwt, params) {
            /// <summary>
            /// Get Training
            /// </summary>
            /// <returns type="object">Result in a promise object.</returns>
            /// <doc>myEvents.services:impersonateService#getSampleSessions</doc>
            var baseUrl = services.services.myLearningService.url.impersonation.getSampleSessions,
                url = methods.urlFormat(baseUrl, params.courseCode, services.services.myLearningService.apiKey, sha256Encrypt()),
                authorization = jwt || '';

            $log.debug("Get activity id by course code: " + url);

            return authService.get(url, authorization, 'getSampleSessions');
        }

    };
}
    ]
);