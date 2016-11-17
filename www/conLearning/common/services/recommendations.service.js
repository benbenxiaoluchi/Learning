/*global factories, angular */

factories.factory('recommendationsService',
    ['$q', '$http', 'connectedLearning.constants', 'environmentData', 'connectedLearning.methods', '$cordovaPush', 'crittercismService',
        function ($q, $http, constants, environmentData, methods, $cordovaPush, crittercismService) {
            /// <summary>
            /// Service created to manage http calls needed to provide functionality to manage the recommendations in connectedLearning application.
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
            /// <doc>connectedLearning.services:usersService</doc>

            'use strict';

            //#region Models

            /// <summary>
            ///  Model to manage recommendations Information.
            /// </summary>
            /// <doc>connectedLearning.services:recommendationsService!itemsRecommendedModel</doc>
            var itemsRecommendedModel = {
                reloadRecommendations: false,
                learnings: {
                    list: [],
                    itemSelected: {},
                    endPaging: true,
                    size: constants.recommendations.size
                },
                learningBoards: {
                    list: [],
                    itemSelected: {},
                    endPaging: true,
                    size: constants.recommendations.size
                },
                communities: {
                    list: [],
                    itemSelected: {},
                    endPaging: true,
                    size: constants.recommendations.size
                },
                pymk: {
                    list: [],
                    itemSelected: {},
                    endPaging: true,
                    size: constants.recommendations.size
                },
                mySchedulingAssignments: {
                    list: [],
                    itemSelected: {},
                    endPaging: true,
                    size: constants.recommendations.size
                },
                acmPositions: {
                    list: [],
                    itemSelected: {},
                    endPaging: true,
                    size: constants.recommendations.size
                }
            };

            //#endregion

            return {
                // Model Management
                setReloadRecommendations: function (value) {
                    itemsRecommendedModel.reloadRecommendations = value;
                },
                getItemsRecommendedModel: function () {
                    /// <summary>
                    /// Get the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getItemsRecommendedModel</doc>

                    return itemsRecommendedModel;
                },                
                // Service calls
                getRecommendedLearnings: function (jwt, parameters) {
                    /// <summary>
                    /// Get the recommended items from myLearning, KX.
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getItemsRecommended</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.recommendations.size; }
                    if (methods.isEmptyOrNull(parameters.killCache)) { parameters.killCache = false; }
                    if (methods.isEmptyOrNull(parameters.skillsList)) { parameters.skillsList = []; }

                    var skillList = [];
                    var i = 0;
                    for (i = 0; i < parameters.skillsList.length; i++) {
                        if (parameters.skillsList[i].IsActive || parameters.skillsList[i].IsActive === undefined) {
                            skillList.push({ key: parameters.skillsList[i].SkillId, value: (parameters.skillsList[i].UserProficiency === "" || parameters.skillsList[i].UserProficiency === null || parameters.skillsList[i].UserProficiency === undefined) ? "0" : parameters.skillsList[i].UserProficiency.toString() });
                        }
                    }

                    var baseUrl = environmentData.services.conlearningService.url.recommendations.getRecommendedLearnings,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.size, parameters.killCache),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        myLearningAuthorization = parameters.myLToken || '';

                    var currentAction = 'GET';
                    if (environmentData.environment !== "MOCK") {
                        currentAction = 'POST';
                    }

                    crittercismService.beginTransaction('Get_Recommended_Learnings');
                    
                    $http({
                        method: currentAction,
                        url: url,
                        data: skillList,
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MyLearningAuthorization': myLearningAuthorization
                        }
                    })                    
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Recommended_Learnings');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Recommended_Learnings');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });                    

                    return deferred.promise;
                },
                getRecommendedCommunities: function (jwt, parameters) {
                    /// <summary>
                    /// Get the recommended items from myLearning, KX.
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getItemsRecommended</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }                    
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.recommendations.size; }
                    if (methods.isEmptyOrNull(parameters.killCache)) { parameters.killCache = false; }
                    if (methods.isEmptyOrNull(parameters.skillsList)) { parameters.skillsList = []; }

                    // build the list of names of skills
                    var skillList = "";
                    var i = 0;
                    for (i = 0; i < parameters.skillsList.length; i++) {
                        if (parameters.skillsList[i].IsActive || parameters.skillsList[i].IsActive === undefined) {
                            skillList += parameters.skillsList[i].SkillName;
                            if (i !== parameters.skillsList.length - 1) {
                                skillList += ",";
                            }
                        }
                    }

                    var baseUrl = environmentData.services.conlearningService.url.recommendations.getRecommendedCommunities,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, skillList, parameters.size, parameters.killCache),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Recommended_Communities');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Recommended_Communities');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Recommended_Communities');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getRecommendedPYMK: function (jwt, parameters) {
                    /// <summary>
                    /// Get the recommended items from myLearning, KX.
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getItemsRecommended</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevelCd)) { parameters.careerLevelCd = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.recommendations.size; }
                    if (methods.isEmptyOrNull(parameters.killCache)) { parameters.killCache = false; }
                    if (methods.isEmptyOrNull(parameters.skillsList)) { parameters.skillsList = []; }

                    var skillList = [];
                    var i = 0;
                    for (i = 0; i < parameters.skillsList.length; i++) {
                        if (parameters.skillsList[i].IsActive || parameters.skillsList[i].IsActive === undefined) {
                            skillList.push({ key: parameters.skillsList[i].SkillName, value: (parameters.skillsList[i].UserProficiency === "" || parameters.skillsList[i].UserProficiency === null || parameters.skillsList[i].UserProficiency === undefined) ? "0" : parameters.skillsList[i].UserProficiency.toString() });
                        }
                    }

                    var baseUrl = environmentData.services.conlearningService.url.recommendations.getRecommendedPYMK,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.careerLevelCd, parameters.size, parameters.killCache),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    var currentAction = 'GET';
                    if (environmentData.environment !== "MOCK") {
                        currentAction = 'POST';
                    }

                    crittercismService.beginTransaction('Get_Recommended_PYMK');

                    $http({
                        method: currentAction,
                        url: url,
                        data: skillList,
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })                    
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Recommended_PYMK');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Recommended_PYMK');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getLearningDetails: function (jwt, parameters) {
                    /// <summary>
                    /// Get the details of a learning item
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getLearningDetails</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.learningId)) { parameters.learningId = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.recommendations.getLearningDetail,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.learningId),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        myLearningAuthorization = parameters.myLToken || '';

                    crittercismService.beginTransaction('Get_Learning_Details');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MyLearningAuthorization': myLearningAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Learning_Details');
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        crittercismService.failTransaction('Get_Learning_Details');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getMySchedulingAssignments: function (jwt, parameters) {
                    /// <summary>
                    /// Get the recommended items from my scheduling service.
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getMySchedulingAssignments</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.enterpriseid)) { parameters.enterpriseid = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevelCd)) { parameters.careerLevelCd = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.recommendations.size; }
                    if (methods.isEmptyOrNull(parameters.killCache)) { parameters.killCache = false; }
                    if (methods.isEmptyOrNull(parameters.skillsList)) { parameters.skillsList = []; }

                    // build the list of names of skills
                    var skillList = "";
                    var i = 0;
                    for (i = 0; i < parameters.skillsList.length; i++) {
                        if (parameters.skillsList[i].IsActive || parameters.skillsList[i].IsActive === undefined) {
                            skillList += parameters.skillsList[i].SkillName;
                            if (i !== parameters.skillsList.length - 1) {
                                skillList += ",";
                            }
                        }
                    }

                    var baseUrl = environmentData.services.mySchedulingService.url.assignments.getMySchedulingAssignments,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.enterpriseid,parameters.size, skillList, parameters.careerLevelCd, parameters.killCache),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        mySchedulingAuthorization = parameters.mySToken || '';

                    crittercismService.beginTransaction('Get_Recommended_Assignments');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MySchedulingAuthorization': mySchedulingAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Recommended_Assignments');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Recommended_Assignments');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getAssignmentDetail: function (jwt, parameters) {
                    /// <summary>
                    /// Get the details of an assignment item
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getAssignmentDetails</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.assignmentId)) { parameters.assignmentId = ''; }

                    var baseUrl = environmentData.services.mySchedulingService.url.assignments.getAssignmentDetail,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.assignmentId),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        mySchedulingAuthorization = parameters.mySToken || '';

                    crittercismService.beginTransaction('Get_Assignment_Detail');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MySchedulingAuthorization': mySchedulingAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Assignment_Detail');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Assignment_Detail');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getACMPositions: function (jwt, parameters) {
                    /// <summary>
                    /// Get the recommended positions from my acm.
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getACMPositions</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevelCd)) { parameters.careerLevelCd = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.recommendations.size; }
                    if (methods.isEmptyOrNull(parameters.killCache)) { parameters.killCache = false; }
                    if (methods.isEmptyOrNull(parameters.skillsList)) { parameters.skillsList = []; }

                    // build the list of names of skills
                    var skillList = "";
                    var i = 0;
                    for (i = 0; i < parameters.skillsList.length; i++) {
                        if (parameters.skillsList[i].IsActive || parameters.skillsList[i].IsActive === undefined) {
                            skillList += parameters.skillsList[i].SkillName;
                            if (i !== parameters.skillsList.length - 1) {
                                skillList += ",";
                            }
                        }
                    }

                    var baseUrl = environmentData.services.acmService.url.positions.getACMPositions,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, skillList, parameters.careerLevelCd, parameters.size, parameters.killCache),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        acmAuthorization = parameters.acmToken || '';

                    crittercismService.beginTransaction('Get_Recommended_Positions');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MarketPlaceAuthorization': acmAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Recommended_Positions');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Recommended_Positions');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getPositionDetails: function (jwt, parameters) {
                    /// <summary>
                    /// Get the details of a position item
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getPositionDetails</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.positionId)) { parameters.positionId = ''; }

                    var baseUrl = environmentData.services.acmService.url.positions.getPositionDetails,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.positionId),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        acmAuthorization = parameters.acmToken || '';

                    crittercismService.beginTransaction('Get_Position_Details');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MarketPlaceAuthorization': acmAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Position_Details');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Position_Details');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                setRecommendedItemInActionPlan: function (id, inActionPlan, type) {
                    /// <summary>
                    /// updates the inActionPlan property of a recommended item
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#setRecommendedItemInActionPlan</doc>

                    var index = 0;

                    switch (type) {
                        case constants.actionPlan.type.learning:
                            for (index = 0; index < itemsRecommendedModel.learnings.list.length; index++) {
                                if (itemsRecommendedModel.learnings.list[index].ID === id) {
                                    itemsRecommendedModel.learnings.list[index].InActionPlan = inActionPlan;
                                    break;
                                }
                            }
                            break;
                        case constants.actionPlan.type.board:
                            for (index = 0; index < itemsRecommendedModel.learningBoards.list.length; index++) {
                                if (itemsRecommendedModel.learningBoards.list[index].ID === id) {
                                    itemsRecommendedModel.learningBoards.list[index].InActionPlan = inActionPlan;
                                    break;
                                }
                            }
                            break;
                        case constants.actionPlan.type.community:
                            for (index = 0; index < itemsRecommendedModel.communities.list.length; index++) {
                                if (itemsRecommendedModel.communities.list[index].ID === id) {
                                    itemsRecommendedModel.communities.list[index].InActionPlan = inActionPlan;
                                    break;
                                }
                            }
                            break;
                        case constants.actionPlan.type.pymk:
                            for (index = 0; index < itemsRecommendedModel.pymk.list.length; index++) {
                                if (itemsRecommendedModel.pymk.list[index].PeopleKey.toString() === id) {
                                    itemsRecommendedModel.pymk.list[index].InActionPlan = inActionPlan;
                                    break;
                                }
                            }
                            break;
                        case constants.actionPlan.type.position:
                            for (index = 0; index < itemsRecommendedModel.acmPositions.list.length; index++) {
                                if (itemsRecommendedModel.acmPositions.list[index].PositionId === id) {
                                    itemsRecommendedModel.acmPositions.list[index].InActionPlan = inActionPlan;
                                    break;
                                }
                            }
                            break;
                        case constants.actionPlan.type.assignment:
                            for (index = 0; index < itemsRecommendedModel.mySchedulingAssignments.list.length; index++) {
                                if (itemsRecommendedModel.mySchedulingAssignments.list[index].Id.toString() === id) {
                                    itemsRecommendedModel.mySchedulingAssignments.list[index].InActionPlan = inActionPlan;
                                    break;
                                }
                            }
                            break;
                    }
                }
            };
        }
    ]
);