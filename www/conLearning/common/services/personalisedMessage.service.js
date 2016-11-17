/**
 * Created by booker on 2016/10/24.
 */
'use strict';

factories.factory('personalisedMessageService',
    ['$q', '$http', 'connectedLearning.constants', 'environmentData', 'connectedLearning.methods', '$cordovaFile', 'authService', 'localStorageService','$log','$ionicLoading', 'connectedLearning.constants.environments', 'securityService',
        function ($q, $http, constants, services, methods, $cordovaFile, authService, localStorageService, $log, $ionicLoading, envs, securityService) {
            var personalisedMessage = {
                    list: []
                },
                personalisedMessageModel = []

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
            //     POST
            //     ParameterName	DataType	Length	    Type-POST	DefaultValue	    SampleValue	        Notes
            //     SenderID	        String	       30	    Mandatory		                john.x.doe
            //     ActivityID	    Int	        default	    Mandatory	 1153993
            //     AuthorIDType	    Int	        default	    Mandatory	 2 or 4
            //     MessageBody	    String	    max	        Mandatory	                    Faculty has been changed to qing.he
            //     RecipientsList	String	    max	        Mandatory
            //     ListType	        int	        default	    Mandatory		2	                                "Possible Values :1 For 'ALL';2 for 'INCLUDE';3 for 'EXCLUDE'
            //     messageSendDate	DateTime	default	    Optional	GetUTCDateTime()    3-14-2017 12:05:00	MM-DD-YYYY HH:MM:SS (in 24HRs format)
            //     messageExpiryDays   Int	    default	    Optional	    30	                30	            "In backend MessageExpiryDate will be stored by adding expiry days to messageSendDate parameter.
            //                                                                                                  Default days will be added in mylearning Code-Decode table."

                postPersonalisedMessage: function (senderID, activityID, authorIDType, messageBody, recipientsList, listType, messageSendDate, messageExpiryDays) {
                    var deferred = $q.defer();
                    authService.callService({
                        serviceName: services.services.myLearningService.serviceName,
                        action: this.postPersonalisedMessageSecured,
                        params: {
                                 senderID: senderID,
                                 activityID: activityID,
                                 authorIDType: authorIDType,
                                 messageBody: messageBody,
                                 recipientsList: recipientsList,
                                 listType: listType,
                                 messageSendDate: messageSendDate,     //optional
                                 messageExpiryDays: messageExpiryDays  //optional
                        }
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },

                postPersonalisedMessageSecured: function (jwt, params) {
                    var baseUrl = services.services.myLearningService.url.personalisedMessage.postPersonalisedMessage,
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

                getNotificationList: function (authorID, activityID) {
                    var deferred = $q.defer();
                    authService.callService({
                        serviceName: services.services.myLearningService.serviceName,
                        action: this.getNotificationListSecured,
                        params: {
                            authorID: authorID,
                            activityID: activityID
                }
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },

                getNotificationListSecured: function (jwt, params) {
                    var baseUrl = services.services.myLearningService.url.personalisedMessage.getPersonalisedMessage,
                    url = methods.urlFormat(baseUrl, params.authorID, params.activityID ,services.services.myLearningService.apiKey, sha256Encrypt()),
                    deferred = $q.defer(), authorization = jwt || '';
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

                putPersonalisedMessage:function(jwt, params){

                    var baseUrl = services.services.myLearningService.url.personalisedMessage.putPersonalisedMessage,
                        url = methods.urlFormat(baseUrl, services.services.myLearningService.apiKey, sha256Encrypt()),
                        authorization = jwt || '';

                    return authService.put(url, authorization, params, 'putPersonalisedMessage');
                }
            };
        }
    ]
);