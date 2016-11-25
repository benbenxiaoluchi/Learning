/*global factories, angular */

factories.factory('profileService',
    ['$q', '$http', 'connectedLearning.constants', 'environmentData', 'connectedLearning.methods', '$cordovaPush', 'dateFilter', 'crittercismService',
        function ($q, $http, constants, environmentData, methods, $cordovaPush, dateFilter, crittercismService) {
            /// <summary>
            /// Service created to manage http calls needed to provide functionality to manage users list home page in connectedLearning application.
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
            /// <param name="environmentData">environmentData</param>
            /// <param name="methods">Application common methods injection.</param>
            /// <returns type="object">Service object.</returns>
            /// <doc>connectedLearning.services:usersService</doc>

            'use strict';

            //#region Models

            /// <summary>
            ///  Model to manage skills Information.
            /// </summary>
            /// <doc>connectedLearning.services:profileService!userModel</doc>
            var userModel = {
                claims: {
                    enterpriseId: '',
                    peopleKey: 0
                },
                profile: {},
                actionPlan: []
            };

            /// <summary>
            ///  Model to manage skills Information.
            /// </summary>
            /// <doc>connectedLearning.services:profileService!skillsModel</doc>
            var skillsModel = {
                userSkills: {
                    list: []
                },
                followSkills: {
                    list: []
                },
                topSkills: {
                    list: []
                },
                recommendedSkills: {
                    list: [],
                    endPaging: true,
                    size: constants.skills.size
                },
                businessSkills: {
                    list: [],
                    endPaging: true,
                    size: constants.skills.size
                },
                futureSkills: {
                    list: [],
                    endPaging: true,
                    size: constants.skills.size
                },
                specialtySkills: {
                    list: [],
                    endPaging: true,
                    size: constants.skills.size
                }
            };

            //#endregion

            return {
                // Model Management
                getUserModel: function () {
                    /// <summary>
                    /// Get the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getUserModel</doc>

                    return userModel;
                },
                getRoleId: function () {
                    /// <summary>
                    /// Get the Role from the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getRoleId</doc>

                    return userModel.profile.StandardJobCode;
                },
                getCareerLevel: function () {
                    /// <summary>
                    /// Get the Role from the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getRoleId</doc>

                    return userModel.profile.JobCd;
                },
                getEnterpriseId: function () {
                    /// <summary>
                    /// Get the EnterpriseId from the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getEnterpriseId</doc>

                    return userModel.claims.enterpriseId;
                },
                getPeopleKey: function () {
                    /// <summary>
                    /// Get the EnterpriseId from the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getEnterpriseId</doc>

                    return userModel.claims.peopleKey;
                },
                getSkillsModel: function () {
                    /// <summary>
                    /// Get the model to be used and shared by injection.
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getSkillsModel</doc>

                    return skillsModel;
                },
                // Appification Service calls
                getClaims: function (jwt) {
                    /// <summary>
                    /// Get the claims of the user (enterprise id, people key, etc).
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#getClaims</doc>
                    
                    var baseUrl = environmentData.services.conlearningService.url.user.getClaims,
                        url = methods.urlFormat(baseUrl),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Claims');
                                        
                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Claims');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Claims');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getUserProfile: function (jwt, parameters) {
                    /// <summary>
                    /// Get user profile information
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getUserProfile</doc>
                    
                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.enterpriseId)) { parameters.enterpriseId = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.user.getProfile,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.enterpriseId),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_User_Profile');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_User_Profile');
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        crittercismService.failTransaction('Get_User_Profile');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getUserImage: function (jwt, peopleKey) {
                    /// <summary>
                    /// Get user personal avatar
                    /// </summary>
                    /// <param name="enterpriseId">Enterprise Id.</param>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getUserImage</doc>

                    if (methods.isEmptyOrNull(peopleKey)) { peopleKey = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.user.getAvatar,
                        url = methods.urlFormat(baseUrl, peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_User_Image');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_User_Image');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_User_Image');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                // Connected Learning Service Calls
                getUserSkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get user skills
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getUserSkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getUserSkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_User_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_User_Skills');
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        crittercismService.failTransaction('Get_User_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getRecommendedSkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get skills recommended for the user
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getRecommendedSkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.roleId)) { parameters.roleId = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevel)) { parameters.careerLevel = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.skills.size; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getRecommendedSkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.roleId, parameters.careerLevel, parameters.size),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Recommended_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Recommended_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Recommended_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getFutureSkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get skills recommended for the user from his Career board (FUTURE SKILLS)
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getFutureSkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.roleId)) { parameters.roleId = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevel)) { parameters.careerLevel = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.skills.size; }

                    var baseUrl = environmentData.services.careerPlanningService.url.careerBoard.getFutureSkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.roleId, parameters.careerLevel, parameters.size),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        cpAuthorization = parameters.cpToken || '';

                    crittercismService.beginTransaction('Get_Future_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'CareerPlanningAuthorization': cpAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Future_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Future_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getBusinessPrioritySkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get skills recommended for the user that are not in TAD
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getBusinessPrioritySkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.dte)) { parameters.dte = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getBusinessPrioritySkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.dte),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Business_Priority_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Business_Priority_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Business_Priority_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getUserDTE: function (jwt, parameters) {
                    /// <summary>
                    /// Get user's dte
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getUserDTE</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.enterpriseId)) { parameters.enterpriseId = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getUserDTE,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.enterpriseId),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_User_DTE');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_User_DTE');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_User_DTE');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getSpecialtySkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get specialty skills of the user
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getSpecialtySkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.skills.size; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getSpecialtySkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.size),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Specialty_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Specialty_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Specialty_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getFollowSkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get skills the user is following
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getFollowSkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.roleId)) { parameters.roleId = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevel)) { parameters.careerLevel = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getFollowSkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.roleId, parameters.careerLevel),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Followed_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Followed_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Followed_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getTopSkills: function (jwt, parameters) {
                    /// <summary>
                    /// Get skills the user is following and top recommended skills
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getRecommendedSkills</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.roleId)) { parameters.roleId = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevel)) { parameters.careerLevel = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getTopSkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.roleId, parameters.careerLevel),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Top_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function(data) {
                        crittercismService.endTransaction('Get_Top_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Top_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getSkillDescription: function (jwt, parameters) {
                    /// <summary>
                    /// Get description of a given skill
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getSkillDescription</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.skillId)) { parameters.skillId = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.skills.getSkillDescription,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.skillId),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Skill_Description');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Skill_Description');
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        crittercismService.failTransaction('Get_Skill_Description');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getSkillRecommendedLearnings: function (jwt, parameters) {
                    /// <summary>
                    /// Get the recommended items from myLearning
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:recommendationsService#getSkillRecommendedLearnings</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.skillId)) { parameters.skillId = ''; }
                    if (methods.isEmptyOrNull(parameters.skillTitle)) { parameters.skillTitle = ''; }
                    if (methods.isEmptyOrNull(parameters.careerLevel)) { parameters.careerLevel = ''; }
                    if (methods.isEmptyOrNull(parameters.userProficiency)) { parameters.userProficiency = '0'; }
                    if (methods.isEmptyOrNull(parameters.size)) { parameters.size = constants.recommendations.size; }
                    if (methods.isEmptyOrNull(parameters.killCache)) { parameters.killCache = true; }

                    var baseUrl = environmentData.services.conlearningService.url.recommendations.getSkillRecommendedLearnings,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.skillId, parameters.skillTitle, parameters.careerLevel, parameters.userProficiency, parameters.size, parameters.killCache),
                        deferred = $q.defer(),
                        authorization = jwt || '',
                        myLearningAuthorization = parameters.myLToken || '';

                    crittercismService.beginTransaction('Get_Skill_Rec_Learnings');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'MyLearningAuthorization': myLearningAuthorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Skill_Rec_Learnings');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Skill_Rec_Learnings');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                removeFollowSkill: function (skillId) {
                    /// <summary>
                    /// Remove a skill from the followed skills list
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#removeSkill</doc>

                    var position = -1, index;
                    for (index = 0; index < skillsModel.followSkills.list.length; index++) {
                        if (skillsModel.followSkills.list[index].SkillId === skillId) {
                            position = index;
                            break;
                        }
                    }
                    if (position >= 0) {
                        skillsModel.followSkills.list.splice(position, 1);
                    }
                },
                addFollowSkill: function (skill) {
                    /// <summary>
                    /// Add a skill to the followed skills list
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#addFollowSkill</doc>

                    // maximum 5 followed skills
                    if (skillsModel.followSkills.list.length < constants.skills.maximumFollowSkills) {

                        var exists = false, index;
                        for (index = 0; index < skillsModel.followSkills.list.length; index++) {
                            if (skillsModel.followSkills.list[index].SkillId === skill.SkillId) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            skillsModel.followSkills.list.push(skill);
                        }
                    }
                },
                setRecommendedSkilltoFollow: function (skillId, follow) {
                    /// <summary>
                    /// set a given skill the follow value
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#setRecommendedSkilltoFollow</doc>

                    var exists = false, index;
                    for (index = 0; index < skillsModel.recommendedSkills.list.length; index++) {
                        if (skillsModel.recommendedSkills.list[index].SkillId === skillId) {
                            skillsModel.recommendedSkills.list[index].IsFollow = follow;
                            break;
                        }
                    }
                },
                setFutureSkilltoFollow: function (skillId, follow) {
                    /// <summary>
                    /// set a given skill the follow value
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#setFutureSkilltoFollow</doc>

                    var exists = false, index;
                    for (index = 0; index < skillsModel.futureSkills.list.length; index++) {
                        if (skillsModel.futureSkills.list[index].SkillId === skillId) {
                            skillsModel.futureSkills.list[index].IsFollow = follow;
                            break;
                        }
                    }
                },
                setBusinessPrioritySkilltoFollow: function (skillId, follow) {
                    /// <summary>
                    /// set a given skill the follow value
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#setBusinessPrioritySkilltoFollow</doc>

                    var exists = false, index;
                    for (index = 0; index < skillsModel.businessSkills.list.length; index++) {
                        if (skillsModel.businessSkills.list[index].SkillId === skillId) {
                            skillsModel.businessSkills.list[index].IsFollow = follow;
                            break;
                        }
                    }
                }, setSpecialtySkilltoFollow: function (skillId, follow) {
                    /// <summary>
                    /// set a given skill the follow value
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#setSpecialtySkilltoFollow</doc>

                    var exists = false, index;
                    for (index = 0; index < skillsModel.specialtySkills.list.length; index++) {
                        if (skillsModel.specialtySkills.list[index].SkillId === skillId) {
                            skillsModel.specialtySkills.list[index].IsFollow = follow;
                            break;
                        }
                    }
                },
                followUnfollowSkill: function (jwt, parameters) {
                    /// <summary>
                    /// set a skill to be followed/unfollowed
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#FollowUnfollowSkill</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) {
                        parameters.peopleKey = '';
                    }
                    if (methods.isEmptyOrNull(parameters.skillId)) {
                        parameters.skillId = '';
                    }
                    if (methods.isEmptyOrNull(parameters.skillType)) {
                        parameters.skillType = '';
                    }
                    if (methods.isEmptyOrNull(parameters.follow)) {
                        parameters.follow = false;
                    }

                    var baseUrl = environmentData.services.conlearningService.url.skills.followUnfollowSkill,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey, parameters.skillId, parameters.follow, parameters.skillType),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    if (parameters.follow) {
                        crittercismService.beginTransaction('Follow_Skill');
                    }
                    else {
                        crittercismService.beginTransaction('Unfollow_Skill');
                    }

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        if (parameters.follow) {
                            crittercismService.endTransaction('Follow_Skill');
                        }
                        else {
                            crittercismService.endTransaction('Unfollow_Skill');
                        }
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        if (parameters.follow) {
                            crittercismService.failTransaction('Follow_Skill');
                            }
                        else {
                            crittercismService.failTransaction('Unfollow_Skill');
                        }
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getUserSettings: function (jwt, parameters) {
                    /// <summary>
                    /// Get user profile settings like if have seen the tutorial or the recommeded skills
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getUserSettings</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.user.getUserSettings,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_User_Settings');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_User_Settings');
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        crittercismService.failTransaction('Get_User_Settings');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                setHaveSeenTutorial: function (jwt, parameters) {
                    /// <summary>
                    /// Set the flag haveSeenTutorial to true to the current user
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#sethaveSeenTutorial</doc>
                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.user.setHaveSeenTutorial,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Set_Have_Seen_Tutorial');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Set_Have_Seen_Tutorial');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Set_Have_Seen_Tutorial');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                setHaveSeenRecommededSkills: function (jwt, parameters) {
                    /// <summary>
                    /// Set the flag haveSeenRecommededSkills to true to the current user
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#sethaveSeenTutorial</doc>
                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.user.setHaveSeenRecommededSkills,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Set_Have_Seen_Recommended_Skills');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Set_Have_Seen_Recommended_Skills');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Set_Have_Seen_Recommended_Skills');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                sendFeedback: function (jwt, parameters) {
                    /// <summary>
                    /// Send a feedback message
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#sendFeedback</doc>
                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.enterpriseId)) { parameters.enterpriseId = ''; }
                    if (methods.isEmptyOrNull(parameters.body)) { parameters.body = ''; }

                    var baseUrl = environmentData.services.conlearningService.url.user.sendFeedback,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Send_Feedback');

                    $http.post(url, {
                        enterpriseId: parameters.enterpriseId,
                        body: parameters.body
                    }, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Send_Feedback');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Send_Feedback');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                getActionPlan: function (jwt, parameters) {
                    /// <summary>
                    /// Get action plan for the user
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#getActionPlan</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }

                    var baseUrl = environmentData.services.actionPlanService.url.actionPlan.getActionPlan,
                        url = methods.urlFormat(baseUrl, parameters.peopleKey),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    crittercismService.beginTransaction('Get_Action_Plan');

                    $http.get(url, {
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Get_Action_Plan');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Get_Action_Plan');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                removeFromActionPlanList: function (id, type) {
                    /// <summary>
                    /// Remove an item from the action plan list
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#removeFromActionPlanList</doc>

                    var position = -1, index;

                    for (index = 0; index < userModel.actionPlan.length; index++) {
                        if (userModel.actionPlan[index].ActionPlanId === id) {
                            position = index;
                            break;
                        }
                    }

                    if (position >= 0) {
                        userModel.actionPlan.splice(position, 1);
                    }
                },
                addToActionPlanList: function (item) {
                    /// <summary>
                    /// Add an item to the action plan list
                    /// </summary>
                    /// <returns type="object">Model.</returns>
                    /// <doc>connectedLearning.services:profileService#addToActionPlanList</doc>

                    var exists = false, index;

                    for (index = 0; index < userModel.actionPlan.length; index++) {
                        if (userModel.actionPlan[index].ObjectId === item.ObjectId) {
                            exists = true;
                            break;
                        }
                    }

                    if (!exists) {
                        // add to the first place
                        userModel.actionPlan.push(item);
                    }

                },
                addActionPlanItem: function (jwt, parameters) {
                    /// <summary>
                    /// Adds an item to action plan of the user
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#addActionPlanItem</doc>

                    if (methods.isEmptyOrNull(parameters.peopleKey)) { parameters.peopleKey = ''; }
                    if (methods.isEmptyOrNull(parameters.sourceAppName)) { parameters.sourceAppName = ''; }
                    if (methods.isEmptyOrNull(parameters.ObjectTypeCodeNbr)) { parameters.ObjectTypeCodeNbr = ''; }
                    if (methods.isEmptyOrNull(parameters.ObjectId)) { parameters.ObjectId = ''; }
                    if (methods.isEmptyOrNull(parameters.ObjectNameTxt)) { parameters.ObjectNameTxt = ''; }
                    if (methods.isEmptyOrNull(parameters.URL)) { parameters.URL = ''; }

                    var baseUrl = environmentData.services.actionPlanService.url.actionPlan.addActionPlanItem,
                        url = methods.urlFormat(baseUrl, parameters.sourceAppName),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    var currentAction = 'GET';
                    if (environmentData.environment !== "MOCK") {
                        currentAction = 'POST';
                    }

                    crittercismService.beginTransaction('Add_Item_To_Action_Plan');

                    $http({
                        method: currentAction,
                        url: url,
                        data: $.param({
                            ObjectTypeCodeNbr: parameters.ObjectTypeCodeNbr,
                            ObjectId: parameters.ObjectId,
                            ObjectNameTxt: parameters.ObjectNameTxt,
                            ActionTypeCodeNbr: "1306",
                            ActionTypeId: "40002021",
                            ActionTypeNameTxt: "SeniorManager",
                            URL: parameters.URL
                        }),
                        cache: false,
                        headers: {
                            'Authorization': authorization,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Add_Item_To_Action_Plan');
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        crittercismService.failTransaction('Add_Item_To_Action_Plan');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                removeActionPlanItem: function (jwt, parameters) {
                    /// <summary>
                    /// remove an item from the users action plan
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#removeActionPlanItem</doc>

                    if (methods.isEmptyOrNull(parameters.id)) { parameters.id = ''; }

                    var baseUrl = environmentData.services.actionPlanService.url.actionPlan.removeActionPlanItem,
                        url = methods.urlFormat(baseUrl, parameters.id),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    var currentAction = 'GET';
                    if (environmentData.environment !== "MOCK") {
                        currentAction = 'DELETE';
                    }

                    crittercismService.beginTransaction('Remove_Item_From_Action_Plan');

                    $http({
                        method: currentAction,
                        url: url,
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Remove_Item_From_Action_Plan');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Remove_Item_From_Action_Plan');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                updateTargetDateActionPlanItem: function (jwt, parameters) {
                    /// <summary>
                    /// saves an action plan item target date
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#updateTargetDateActionPlanItem</doc>

                    if (methods.isEmptyOrNull(parameters.sourceAppName)) { parameters.sourceAppName = ''; }
                    if (methods.isEmptyOrNull(parameters.id)) { parameters.id = ''; }
                    if (methods.isEmptyOrNull(parameters.targetDate)) { parameters.targetDate = null; }

                    var baseUrl = environmentData.services.actionPlanService.url.actionPlan.updateTargetDateActionPlanItem,
                        url = methods.urlFormat(baseUrl, parameters.sourceAppName, parameters.id, parameters.targetDate),
                        deferred = $q.defer(),
                        authorization = jwt || '';
                    
                    //url = url.replace("targetDate=''", "targetDate='" + parameters.targetDate + "'")
                    
                    var currentAction = 'GET';
                    if (environmentData.environment !== "MOCK") {
                        currentAction = 'PUT';
                    }

                    crittercismService.beginTransaction('Update_Target_Date_Action_Plan');

                    $http({
                        method: currentAction,
                        url: url,
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Update_Target_Date_Action_Plan');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Update_Target_Date_Action_Plan');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                },
                updateStatusActionPlanItem: function (jwt, parameters) {
                    /// <summary>
                    /// mark/unmark as complete an action plan item
                    /// </summary>
                    /// <returns type="object">Result in a promise object.</returns>
                    /// <doc>connectedLearning.services:profileService#updateStatusActionPlanItem</doc>

                    if (methods.isEmptyOrNull(parameters.sourceAppName)) { parameters.sourceAppName = ''; }
                    if (methods.isEmptyOrNull(parameters.id)) { parameters.id = ''; }
                    if (methods.isEmptyOrNull(parameters.complete)) { parameters.complete = ''; }

                    var baseUrl = environmentData.services.actionPlanService.url.actionPlan.updateStatusActionPlanItem,
                        url = methods.urlFormat(baseUrl, parameters.sourceAppName, parameters.id, parameters.complete),
                        deferred = $q.defer(),
                        authorization = jwt || '';

                    var currentAction = 'GET';
                    if (environmentData.environment !== "MOCK") {
                        currentAction = 'PUT';
                    }

                    crittercismService.beginTransaction('Update_Status_Action_Plan');

                    $http({
                        method: currentAction,
                        url: url,
                        cache: false,
                        headers: {
                            'Authorization': authorization
                        }
                    })
                    .success(function (data) {
                        crittercismService.endTransaction('Update_Status_Action_Plan');
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        crittercismService.failTransaction('Update_Status_Action_Plan');
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });

                    return deferred.promise;
                }
            };
        }
    ]
);