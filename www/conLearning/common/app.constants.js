/*global app */

//#region Constants

app.constant('connectedLearning.constants', {
    /// <summary>
    /// Declare all global constants needed by application.
    /// </summary>
    /// <returns type="object">Object that contains all constants.</returns>
    /// <doc>connectedLearning.constants:constants</doc>

    common: {
        /// <summary>
        /// Common constants used in connectedLearning application.
        /// pictureUrl -> path to get user images
        /// noImageUrl -> path to default user image
        /// noInvoiceUrl -> path to image to be shown when there is no receipt
        /// enterpriseId -> user logged enterprise id
        /// statusDraft -> status managed when user add new comment
        /// </summary>
        /// <doc>connectedLearning.constants:constants!common</doc>

        noImageUrl: 'img/no-user.png',
        leadershipCL: '10000025'
    },
    skills: {
        /// <summary>
        /// Constants related to skills.
        /// </summary>
        /// <doc>connectedLearning.constants:constants!skills</doc>

        maximumFollowSkills: 5,
        size: 2,
        type: {
            recommended: 1,
            specialty: 2,
            future: 3,
            businessPriority: 4
        },
        maxSizeSkills: 50,
        excludedSpecSkills: ["80007950", "80007951", "80007952"],
        disabledText: "Not Available"
    },
    recommendations: {
        /// <summary>
        /// Constants related to recommendations.
        /// </summary>
        /// <doc>connectedLearning.constants:constants!recommendations</doc>

        size: 2,
        maxSizePositions: 50,
        maxSizeAssignments: 50,
        maxSizeLearnings: 50,
        maxSizeCommunities: 50,
        maxSizePYMK: 50,
        type: {
            learning: 1,
            community: 2,
            pymk: 3,
            position: 4,
            assignment: 5,
            board: 6
        }
    },
    actionPlan: {
        type: {
            learning: 1201,
            board: 1202,
            community: 1203,
            position: 1204,
            pymk: 1205,
            assignment: 1206
        },
        status: {
            completed: 1402,
            notStarted: 1401
        },
        sourceAppName: 1503
    },
    messages: {
        userErrorMessage: 'Some content on this page may temporarily be unavailable. We apologize for any inconvenience this causes. Please check back again soon.',
        maxFollowedSkills: 'You can only follow 5 skills. Please review your followed skills.',
        saveSuccesfully: 'Expense saved',
        submitSuccesfully: 'Expense sent for approval'
    },
    broadcast: {
        updateBaseController: '__updateBaseController__',
        reloadRecommendations: '__reloadRecommendations__',
        sendTempFollowSkills: '__sendTempFollowSkills__',
        updateSummaryCards: '__updateSummaryCards__',
        removeActionItem: '__removeActionItem__',
        getLearningDetail: '__getLearningDetail__',
        setLearningDetail: '__setLearningDetail__',
        getPositionDetail: '__getPositionDetail__',
        setPositionDetail: '__setPositionDetail__',
        getAssignmentDetail: '__getAssignmentDetail__',
        setAssignmentDetail: '__setAssignmentDetail__',
        finishLoadingAdminTraining: '__finishLoadingAdminTraining__',
        finishLoadingSurveyToFaculty:'__finishLoadingSurveyToFaculty__',
    },
    circle: {
        overallCircle: {
            circleID: '9c483707-79c1-4094-bb68-b71f08bf86c8',
            circleName: "Learning Events App Discussion",
            circleType: "UserDefault",
            defaultCircle: 1,
            PreferredCircle: 1,
            InternalCircleID: 0
        }
    }
});
//#endregion

app.constant('connectedLearning.constants.environments', {
    isBrowser: !ionic.Platform.isWebView(),
    PROD: 'PROD',
    LOCAL: 'LOCAL',
    DEV: 'DEV',
    STAGE: 'STAGE',
    PERF: 'PERF',
    MOCK: 'MOCK'
});

app.provider('environmentData', ['connectedLearning.constants.environments', function (envs) {

    'use strict';

    var config_MOCK = {
        clientId: 'f45302e0-3ac5-4ebe-b6fa-261b946928d4',
        environment: 'MOCK',
        peopleUrl: 'https://peopleux-perf.ciotest.accenture.com/Experience.aspx?accountname=',
        //acmURL: 'https://careersmarketplace.ciodev.accenture.com/Home/Position/',
        //mySchedulingURL: 'https://myschedrebar-pt.ciotest.accenture.com/me/?path=assignment&amp;id=',
        acmURL: 'https://careersmarketplace.accenture.com/Home/Position/',
        mySchedulingURL: 'https://myscheduling.accenture.com/me/?path=assignment&amp;id=',
        faq: 'https://kx.accenture.com/repositories/contributionform.aspx?path=c34/2/11&mode=read',
        services: {
            conlearningService: {
                serviceName: 'connectedlearningService',
                identifier: '',
                url: {
                    user: {
                        getUserSettings: 'data/userSettings.json',
                        setHaveSeenTutorial: 'data/haveSeenTutorial.json',
                        setHaveSeenRecommededSkills: 'data/haveSeenRecommededSkills.json',
                        sendFeedback: 'data/sendFeedback.json',
                        getClaims: 'data/claims.json',
                        getProfile: 'data/profile.json',
                        getAvatar: 'data/avatar.json'
                    },
                    skills: {
                        getUserSkills: 'data/userSkills.json',
                        getRecommendedSkills: 'data/recommendedSkills.json',
                        getFollowSkills: 'data/followSkills.json',
                        followUnfollowSkill: 'data/follow.json',
                        getSkillDescription: 'data/skillDetails.json',
                        getUserDTE: 'data/userDTE.json',
                        getBusinessPrioritySkills: 'data/businessPrioritySkills.json',
                        getSpecialtySkills: 'data/specialtySkills.json',
                        getTopSkills: 'data/topSkills.json'
                    },
                    recommendations: {
                        getItemsRecommended: 'data/items.recommended.json',
                        getRecommendedLearnings: 'data/items.recommended.learnings.json',
                        getRecommendedCommunities: 'data/items.recommended.communities.json',
                        getRecommendedPYMK: 'data/items.recommended.pymk.json',
                        getSkillRecommendedLearnings: 'data/skill.learnings.json',
                        getLearningDetail: 'data/learningDetails.json'
                    }
                }
            },
            myLearningService: {
                serviceName: 'myLearningService',
                identifier: 'https://pews-pi.accenture.com/mylapi/',
                apiKey: 'rzbbpxmbvrxwjvrk69xn6kjk',
                secretKey: 'dhPg8wbbAW5cfecBfRbtJg5R',
                url: {
                    myExpenses: 'LOCAL_DATA',

                    apis: {
                        getFacilities: '/Facility/getFacilityList',
                        getEnrollments: '/get active enrollments training',
                        getTrainingIntroduction: '/Activity/getCourseObjectives?ActivityID={ActivityID}',
                        getParticipants: '/Activity/getRosterDetails?ActivityID={ActivityID}&RecordCount={RecordCount}&ReturnSetFlag={ReturnSetFlag}',
                        getFaculty: '/Activity/getRosterDetails?ActivityID={ActivityID}&RecordCount={RecordCount}&ReturnSetFlag={ReturnSetFlag}',
                        getProfileDetails: '/collabhub.accenture.com/json/People',
                        getProfileImage: '/collabhub.accenture.com/People/ProfilePicture',
                        getSingleFacility: 'data/learningEvents/facilities_list.json',
                        getFacilityList: 'data/learningEvents/facilities_list.json',
                        getAcitivityAndParticipants: '/Activity/getActivityAndUserDetails?ActivityID={ActivityID}&RecordCount={RecordCount}&ReturnSetFlag={ReturnSetFlag}',
                        getScheduleAndMaterials: '/Activity/getScheduleAndMaterials?ActivityID={ActivityID}',
                        getWhitelist: '/getACLWhitelistUser?enterpriseID={enterpriseID}',
                        getMaterialsAndAgenda: '/Activity/getMaterialsDetails?CourseCode={CourseCode}'
                    },

                    training: {
                        getTraining: 'data/learningEvents/training_classroomtrainingschedule.json',
                        getTrainingDesc: 'data/learningEvents/about.json',
                        getTrainingDetails: 'data/learningEvents/venue.json',
                        searchPeople: 'data/learningEvents/training_getrosterdetails.json',
                        getCourseSchedule: 'data/learningEvents/training_getscheduledetails.json',
                        getCourseMeterial: 'data/learningEvents/meterial.json',
                        getPeopleLikeMe: 'data/learningEvents/training_getpeoplelikeme.json',
                        getPeopleOnSite: 'data/learningEvents/training_getrosterdetails.json',
                        getDemographicType: 'data/learningEvents/training_getsupporteddemogs.json',
                        getDemographics: 'data/learningEvents/demographics.json',
                        getActivityTabs: 'data/learningEvents/training_getactivitytabs.json',
                        getAttendanceStatus: 'data/learningEvents/training_getIndividualAttendanceStatus.json',
                        getCircles: 'data/learningEvents/training_getcircles.json',
                        getRollCall: 'data/learningEvents/training_RollCall.json',
                        getLearnersByAttendanceStatus1: 'data/learningEvents/training_getLearnersByStatus1.json',
                        getLearnersByAttendanceStatus2: 'data/learningEvents/training_getLearnersByStatus2.json',
                        getLearnersByAttendanceStatus3: 'data/learningEvents/training_getLearnersByStatus3.json',
                        getIndividualAttendanceStatus: 'data/learningEvents/training_getIndividualAttendanceStatus.json',
                        //getUpcomingSessions: 'http://54.169.123.157/UpcomingSessions',
                        getUpcomingSessions: 'data/learningEvents/training_upcomingSessions.json',
                        getVenue: 'data/learningEvents/venue_AllOngoingEvents.json',
                        getSurveyForSession:'data/learningEvents/training_getsurveyforsession.json',
                        getSurveyForFaculty:'data/learningEvents/training_getsurveyforfaculty.json',
                        getActivityEventInfo:'data/learningEvents/getactivityeventinfo.json'
                    },
                    menu: {
                        getFullName: 'data/learningEvents/training_getpeopledata.json',
                        getProfilePicture: 'data/learningEvents/training_getprofilepicture.json',
                        getProfileInfo: 'data/learningEvents/training_getpeopledata.json'
                    },
                    impersonation: {
                        getACLWhitelistUser: 'data/learningEvents/training_getaclwhitelistuser.json',
                        getManageModePermission: 'https://pews.accenture.com/aclapi/User/getACLManageModePermission?enterpriseID={0}&impersonateKey={1}',
                        getSampleSessions: 'https://pews.accenture.com/aclapi/User/getSampleSessions?CourseCode={0}'
                    },
                    weather: {
                        getCurrentObservation: 'https://query.yahooapis.com/v1/public/yql?q={0}&format=json'
                    },
                    personalisedMessage: {
                        getPersonalisedMessage: 'data/learningEvents/notificationsInf.json'
                    }
                },
            },
            careerPlanningService: {
                serviceName: 'careerPlanningService',
                identifier: '',
                url: {
                    careerBoard: {
                        getFutureSkills: 'data/futureSkills.json'
                    }
                }
            },
            actionPlanService: {
                serviceName: 'actionPlanService',
                identifier: '',
                url: {
                    actionPlan: {
                        getActionPlan: 'data/actionPlan.json',
                        addActionPlanItem: 'data/addActionPlan.json',
                        removeActionPlanItem: 'data/removeActionPlan.json',
                        updateTargetDateActionPlanItem: 'data/removeActionPlan.json',
                        updateStatusActionPlanItem: 'data/removeActionPlan.json'
                    }
                }
            },
            mySchedulingService: {
                serviceName: 'mySchedulingService',
                identifier: '',
                url: {
                    assignments: {
                        getMySchedulingAssignments: 'data/assignments.json',
                        getAssignmentDetail: 'data/assignmentDetail.json'
                    }
                }
            },
            acmService: {
                serviceName: 'acmService',
                identifier: '',
                url: {
                    positions: {
                        getACMPositions: 'data/positions.json',
                        getPositionDetails: 'data/positionDetails.json'
                    }
                }
            },
            circleService: {
                serviceName: 'circleService',
                identifier: 'urn:federation:collabstreammobile:service',
                circleId: '79dbd409-5edc-46a9-8e92-0006751722fe',
                circleGUID: '881985c9-ba27-4ff8-acaa-3953f7b8184c',
                url: {
                    stream: {
                        getStream: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}',
                        getStreamDetail: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/thread/{0}',
                        like: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/like/{0}',
                        share: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/shares/{0}',
                        comment: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/comments/{0}',
                        post: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}/event',
                        upload: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/upload/file?extension=.jpg',
                        getSuggestions: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/search',
                        getDiscussionStreamSecured: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}&searchTxt={3}',
                        follow: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/follow/{0} ',
                        getfollowstatus: 'https://collab-ts.cioperf.accenture.com/m/v2/api/Stream/tag?o=true&tag={0}'
                    }
                }
            }
        }
    };

    var config_LOCAL = {
        clientId: 'f45302e0-3ac5-4ebe-b6fa-261b946928d4',
        environment: 'LOCAL',
        peopleUrl: 'https://peopleux-perf.ciotest.accenture.com/Experience.aspx?accountname=',
        acmURL: 'https://careersmarketplace.ciodev.accenture.com/Home/Position/',
        mySchedulingURL: 'https://mysched.ciostage.accenture.com/me/?path=assignment&id=',
        faq: 'https://kx.accenture.com/repositories/contributionform.aspx?path=c34/2/11&mode=read',
        services: {
            conlearningService: {
                serviceName: 'connectedlearningService',
                identifier: 'https://careerplanning.ciostage.accenture.com/webapi/api/external-service/',
                url: {
                    user: {
                        getUserSettings: 'http://localhost:18679/api/user/{0}/userSettings',
                        setHaveSeenTutorial: 'http://localhost:18679/api/user/{0}/tutorial',
                        setHaveSeenRecommededSkills: 'http://localhost:18679/api/user/{0}/recommendedSkills',
                        sendFeedback: 'http://localhost:18679/api/user/{0}/sendFeedback',
                        getClaims: 'data/claims.json',
                        getProfile: 'data/profile.json',
                        getAvatar: 'data/avatar.json'
                    },
                    skills: {
                        getUserSkills: 'http://localhost:18679/api/user/{0}/myskills',
                        getRecommendedSkills: 'http://localhost:18679/api/user/{0}/skillsrecommended?roleId={1}&careerLevelCd={2}&size={3}',
                        getFollowSkills: 'http://localhost:18679/api/user/{0}/skillsfollowed?roleId={1}&careerLevelCd={2}',
                        followUnfollowSkill: 'http://localhost:18679/api/user/{0}/follow?skillId={1}&isFollow={2}&skillType={3}',
                        getSkillDescription: 'http://localhost:18679/api/user/{0}/skilldetail/{1}/description',
                        getUserDTE: 'http://localhost:18679/api/user/{0}/dte?enterpriseid={1}',
                        getBusinessPrioritySkills: 'http://localhost:18679/api/user/{0}/bpskills?dte={1}',
                        getSpecialtySkills: 'http://localhost:18679/api/user/{0}/specializationskills?size={1}',
                        getTopSkills: 'http://localhost:18679/api/user/{0}/topskills?roleid={1}&careerlevelcd={2}'
                    },
                    recommendations: {
                        getRecommendedLearnings: 'http://localhost:18679/api/user/{0}/recommendedlearnings?size={1}&killCache={2}',
                        getRecommendedCommunities: 'http://localhost:18679/api/user/{0}/recommendedcommunities?skills={1}&size={2}&killCache={3}',
                        getRecommendedPYMK: 'http://localhost:18679/api/user/{0}/recommendedpeople?careerLevelCd={1}&size={2}&killCache={3}',
                        getSkillRecommendedLearnings: 'http://localhost:18679/api/user/{0}/skilldetail/{1}/learnings?title={2}&careerLevelCd={3}&userProficiency={4}&size={5}&killCache={6}',
                        getLearningDetail: 'http://localhost:18679/api/user/{0}/learningdetail/{1}?killCache=true'
                    }
                }
            },
            myLearningService: {
                serviceName: 'myLearningService',
                identifier: 'https://pews-pi.accenture.com/mylapi/'
            },
            careerPlanningService: {
                serviceName: 'careerPlanningService',
                identifier: 'https://careerplanning.ciostage.accenture.com/webapi/api/external-service/',
                url: {
                    careerBoard: {
                        getFutureSkills: 'http://localhost:18679/api/user/{0}/futureskills?roleId={1}&careerLevelCd={2}&size={3}'
                    }
                }
            },
            actionPlanService: {
                serviceName: 'actionPlanService',
                identifier: 'https://careerplanning.ciostage.accenture.com/webapi/api/external-service/',
                url: {
                    actionPlan: {
                        getActionPlan: 'data/actionPlan.json',
                        addActionPlanItem: 'data/addActionPlan.json',
                        removeActionPlanItem: 'data/removeActionPlan.json',
                        updateTargetDateActionPlanItem: 'data/removeActionPlan.json',
                        updateStatusActionPlanItem: 'data/removeActionPlan.json'
                    }
                }
            },
            mySchedulingService: {
                serviceName: 'mySchedulingService',
                identifier: 'https://myschedsvc.ciostage.accenture.com',
                url: {
                    assignments: {
                        getMySchedulingAssignments: 'http://localhost:18679/api/user/{0}/recommendedassignments?enterpriseId={1}&size={2}&skills={3}&careerLevelCd={4}&killCache={5}',
                        getAssignmentDetail: 'http://localhost:18679/api/user/{0}/assignmentdetail?assignmentid={1}&killcache=true'
                    }
                }
            },
            acmService: {
                serviceName: 'acmService',
                identifier: 'https://careersmarketplace-at.ciodev.accenture.com/webapi/api/external-service/',
                url: {
                    positions: {
                        getACMPositions: 'http://localhost:18679/api/user/{0}/recommendedopportunities?skills={1}&careerLevelCd={2}&size={3}&killCache={4}',
                        getPositionDetails: 'http://localhost:18679/api/user/{0}/opportunitydetail?positionId={1}&killCache=true'
                    }
                }
            }
        }
    };
    //DEV Env
    var config_DEV = {
        clientId: 'f45302e0-3ac5-4ebe-b6fa-261b946928d4',
        environment: 'DEV',
        peopleUrl: 'https://peopleux-perf.ciotest.accenture.com/Experience.aspx?accountname=',
        acmURL: 'https://careersmarketplace.ciodev.accenture.com/Home/Position/',
        mySchedulingURL: 'https://mysched.ciostage.accenture.com/me/?path=assignment&id=',
        faq: 'https://kx.accenture.com/repositories/contributionform.aspx?path=c34/2/11&mode=read',
        services: {
            conlearningService: {
                serviceName: 'connectedlearningService',
                identifier: 'https://connectedlearningapp.ciodev.accenture.com/api',
                url: {
                    user: {

                        getUserSettings: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/userSettings',
                        setHaveSeenTutorial: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/tutorial',
                        setHaveSeenRecommededSkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/recommendedSkills',
                        sendFeedback: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/sendFeedback',
                        getClaims: 'https://connectedlearningapp.ciodev.accenture.com/api/user/claims',
                        getProfile: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/profile?enterpriseid={1}',
                        getAvatar: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/picture'
                    },
                    skills: {
                        getUserSkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/myskills',
                        getRecommendedSkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/skillsrecommended?roleId={1}&careerLevelCd={2}&size={3}',
                        getFollowSkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/skillsfollowed?roleId={1}&careerLevelCd={2}',
                        followUnfollowSkill: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/follow?skillId={1}&isFollow={2}&skillType={3}',
                        getSkillDescription: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/skilldetail/{1}/description',
                        getUserDTE: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/dte?enterpriseid={1}',
                        getBusinessPrioritySkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/bpskills?dte={1}',
                        getSpecialtySkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/specializationskills?size={1}',
                        getTopSkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/topskills?roleid={1}&careerlevelcd={2}'
                    },
                    recommendations:
                    {
                        getRecommendedLearnings: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/recommendedlearnings?size={1}&killCache={2}',
                        getRecommendedCommunities: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/recommendedcommunities?skills={1}&size={2}&killCache={3}',
                        getRecommendedPYMK: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/recommendedpeople?careerLevelCd={1}&size={2}&killCache={3}',
                        getSkillRecommendedLearnings: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/skilldetail/{1}/learnings?title={2}&careerLevelCd={3}&userProficiency={4}&size={5}&killCache={6}',
                        getLearningDetail: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/learningdetail/{1}?killCache=true'
                    }
                }
            },
            myLearningService: {
                serviceName: 'myLearningService',
                identifier: 'https://mylbuild-pews.accenture.com/mylapi/',
                apiKey: 'rzbbpxmbvrxwjvrk69xn6kjk',
                secretKey: 'dhPg8wbbAW5cfecBfRbtJg5R',
                appName: 'myLearningService',
                url: {
                    myExpenses: 'https://mylbuild-pews.accenture.com/aclapi',

                    apis: {
                        getSingleFacility: 'https://mylbuild-pews.accenture.com/aclapi/Facility/getFacilityInfo?ActivityID={0}&FacilityID={1}',
                        getFacilityList: 'https://mylrelease-pews.accenture.com/aclapi/Facility/getFacilityList'
                    },
                    training: {
                        getTraining: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getClassroomTrainingSchedule',
                        //getTrainingDesc: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getCourseObjectives?ActivityID={0}',
                        getTrainingDesc: 'https://webservice.accenture.com/1720_myLAPI/Dev/Activity/getCourseObjectives?ActivityID={0}&api_key={1}&sig={2}',
                        getTrainingDetails: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getActivityAndUserDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}',
                        getCourseCode: 'https://mylbuild-pews.accenture.com/aclapi/activity/getScheduleAndMaterials?ActivityID={0}',
                        //searchPeople: 'data/learningEvents/participants.json',
                        //searchPeople: 'https://webservice.accenture.com/1720_myLAPI/Dev/Activity/getRosterDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}&SearchStr={3}&DemogCategory={4}&DemogKey={5}&api_key={6}&sig={7}',
                        //searchPeople: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getRosterDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}&SearchStr={3}&DemogCategory={4}&DemogKey={5}',
                        //getCourseSchedule: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getScheduleDetails?ActivityID={0}',
                        getCourseSchedule:'https://webservice.accenture.com/1720_myLAPI/Dev/Activity/getScheduleDetails?ActivityID={0}&api_key={1}&sig={2}',
                        //getCourseSchedule: 'data/learningEvents/training_getscheduledetails.json',
                        // getCourseMeterial: 'data/learningEvents/meterial.json',
                        getCourseMeterial: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getMaterialsDetails?ActivityID={0}',
                        getPeopleLikeMe: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getPeopleLikeMe?PeopleKey={0}&ActivityID={1}&Source={2}',
                        //getPeopleOnSite: 'https://mylbuild-pews.accenture.com/aclapi/Facility/getPeopleOnSite?ActivityID={0}&SearchStr={1}&RecordCount={2}&DemogCategory={3}&DemogKey={4}',

                        getDemographicType: 'https://mylbuild-pews.accenture.com/aclapi/Activity/GetSupportedDemogs?source={0}',
                        getDemographics: 'https://mylbuild-pews.accenture.com/aclapi/Activity/GetPeopleByDemog?ActivityID={0}&Source={1}&DemogTypeLabel={2}',
                        getSurveyForSession: 'https://mylbuild-pews.accenture.com/aclapi/Activity/SurveyForSession?ActivityID={0}',
                        getSurveyForFaculty: 'https://mylbuild-pews.accenture.com/aclapi/Activity/SurveyForFaculty?ActivityID={0}',
                        //getActivityTabs: 'https://mylbuild-pews.accenture.com/aclapi/Activity/getActivityTabs?ActivityID={0}',
                        getActivityTabs:'https://webservice.accenture.com/1720_myLAPI/Dev/Activity/getActivityTabs?ActivityID={0}&api_key={1}&sig={2}',


                        getRollCall: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/rollCall?AuthorID={0}&AuthorIDType={1}&ActivityID={2}&StatusTS={3}&api_key={4}&sig={5}',
                        getLearnerByStatus: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/LearnerByStatus?AuthorID={0}&AuthorIDType={1}&ActivityID={2}&AttendanceStatus={3}&StatusTS={4}&api_key={5}&sig={6}',
                        getAttendanceInfo: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/AttendanceInfo?AuthorID={0}&AuthorIDType={1}&LearnerID={2}&ActivityID={3}&StatusTS={4}&api_key={5}&sig={6}',
                        postCheckIn: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/checkIn?api_key={0}&sig={1}',
                        postCheckOut: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/checkOut?api_key={0}&sig={1}',
                        postAttendanceInfo: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/AttendanceInfo?api_key={0}&sig={1}',
                        getCircles: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/getCircles?AuthorID={0}&AuthorIDType={1}&ActivityID={2}&api_key={3}&sig={4}',
                        getVenue:'https://webservice.accenture.com/1720_myLearning/Dev/Activity/getCurrentRLCSessionSchedule?facilityID={0}&api_key={1}&sig={2}',
                        getUpcomingSessions:'https://webservice.accenture.com/1720_myLearning/Dev/Activity/getAdminRLCSessionDetails?StartDate={0}&EndDate={1}&AuthorIDType={2}&FacilityID={3}&TabCategory={4}&api_key={5}&sig={6}',
                        modifyDefaultCircle: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/ModifyDefaultCircle?api_key={0}&sig={1}',
                        searchPeople: 'https://webservice.accenture.com/1720_myLAPI/Dev/Activity/getRosterDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}&SearchStr={3}&DemogCategory={4}&DemogKey={5}&api_key={6}&sig={7}',
                        getPeopleOnSite: 'https://webservice.accenture.com/1720_myLAPI/Dev/Facility/getPeopleOnSite?ActivityID={0}&SearchStr={1}&RecordCount={2}&DemogCategory={3}&DemogKey={4}&api_key={5}&sig={6}',
                        getActivityEventInfo: 'https://mylbuild-pews.accenture.com/ACLAPI/Activity/getActivityEventInfo'
                    },
                    menu: {
                        getFullName: 'https://mylbuild-pews.accenture.com/aclapi/other/getPeopleData?eid={0}',
                        getProfilePicture: 'https://mylbuild-pews.accenture.com/aclapi/other/getProfilePicture?eid={0}',
                        getProfileInfo: 'https://mylbuild-pews.accenture.com/aclapi/other/getPeopleData?eid={0}'
                    },
                    impersonation: {
                        getACLWhitelistUser: 'https://mylbuild-pews.accenture.com/aclapi/User/getACLWhitelistUser?enterpriseID={0}',
                        getManageModePermission: 'https://mylbuild-pews.accenture.com/aclapi/User/getACLManageModePermission?enterpriseID={0}&impersonateKey={1}',
                        getSampleSessions: 'https://mylbuild-pews.accenture.com/aclapi/login/getSampleSessions?CourseCode={0}'
                    },
                    weather: {
                        getCurrentObservation: 'https://query.yahooapis.com/v1/public/yql?q={0}&format=json'
                    },
                    personalisedMessage: {
                        getPersonalisedMessage: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/PersonalisedMessage?AuthorID={0}&ActivityID={1}&api_key={2}&sig={3}',
                        postPersonalisedMessage: 'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/PersonalisedMessage?api_key={0}&sig={1}',
                        putPersonalisedMessage:'https://webservice.accenture.com/1720_myLearning/Dev/AttendanceManagement/PersonalisedMessage?api_key={0}&sig={1}'
                    }
                }
            },
            careerPlanningService: {
                serviceName: 'careerPlanningService',
                identifier: 'https://careerplanning.ciodev.accenture.com/webapi/api/external-service/',
                url: {
                    careerBoard: {
                        getFutureSkills: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/futureskills?roleId={1}&careerLevelCd={2}&size={3}'
                    }
                }
            },
            actionPlanService: {
                serviceName: 'actionPlanService',
                identifier: 'https://careerplanning.ciotest.accenture.com/webapi/api/external-service/',
                url: {
                    actionPlan: {
                        getActionPlan: 'https://careerplanning.ciotest.accenture.com/external-service/GetActionPlan',
                        addActionPlanItem: 'https://careerplanning.ciotest.accenture.com/external-service/InsertActionPlan(sourceappCode={0})',
                        removeActionPlanItem: 'https://careerplanning.ciotest.accenture.com/external-service/DeleteActionPlan(actionPlanId={0})',
                        updateTargetDateActionPlanItem: "https://careerplanning.ciotest.accenture.com/external-service/UpdateActionPlanTargetDate(sourceappCode={0},actionPlanId={1},targetDate={2})",
                        updateStatusActionPlanItem: 'https://careerplanning.ciotest.accenture.com/external-service/UpdateActionPlanStatus(sourceappCode={0},actionPlanId={1},status={2})'
                    }
                }
            },
            mySchedulingService: {
                serviceName: 'mySchedulingService',
                identifier: 'https://myschedsvc.ciostage.accenture.com',
                url: {
                    assignments: {
                        getMySchedulingAssignments: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/recommendedassignments?enterpriseId={1}&size={2}&skills={3}&careerLevelCd={4}&killCache={5}',
                        getAssignmentDetail: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/assignmentdetail?assignmentid={1}&killcache=true'
                    }
                }
            },
            acmService: {
                serviceName: 'acmService',
                identifier: 'https://careersmarketplace-at.ciodev.accenture.com/webapi/api/external-service/',
                url: {
                    positions: {
                        getACMPositions: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/recommendedopportunities?skills={1}&careerLevelCd={2}&size={3}&killCache={4}',
                        getPositionDetails: 'https://connectedlearningapp.ciodev.accenture.com/api/user/{0}/opportunitydetail?positionId={1}&killCache=true'
                    }
                }
            },
            circleService: {
                serviceName: 'circleService',
                identifier: 'urn:federation:collabstreammobile:service',
                circleId: '79dbd409-5edc-46a9-8e92-0006751722fe',
                circleGUID: '881985c9-ba27-4ff8-acaa-3953f7b8184c',
                url: {
                    stream: {
                        getStream: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}',
                        getStreamDetail: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/thread/{0}',
                        like: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/like/{0}',
                        share: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/shares/{0}',
                        comment: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/comments/{0}',
                        post: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}/event',
                        upload: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/upload/file?extension=.jpg',
                        getSuggestions: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/search',
                        getDiscussionStreamSecured: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}&searchTxt={3}',
                        follow: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/follow/{0} ',
                        getfollowstatus: 'https://collab-ts.cioperf.accenture.com/m/v2/api/Stream/tag?o=true&tag={0}'
                    }
                }
            }
        }
    };
    //UAT Env
    var config_STAGE = {
        clientId: 'f45302e0-3ac5-4ebe-b6fa-261b946928d4',
        environment: 'STAGE',
        peopleUrl: 'https://peopleux-perf.ciotest.accenture.com/Experience.aspx?accountname=',
        acmURL: 'https://careersmarketplace.ciostage.accenture.com/Home/Position/',
        mySchedulingURL: 'https://mysched.ciostage.accenture.com/me/?path=assignment&id=',
        faq: 'https://kx.accenture.com/repositories/contributionform.aspx?path=c34/2/11&mode=read',
        services: {
            conlearningService: {
                serviceName: 'connectedlearningService',
                identifier: 'https://connectedlearningapp.ciostage.accenture.com/api',
                url: {
                    user: {
                        getUserSettings: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/userSettings',
                        setHaveSeenTutorial: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/tutorial',
                        setHaveSeenRecommededSkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/recommendedSkills',
                        sendFeedback: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/sendFeedback',
                        getClaims: 'https://connectedlearningapp.ciostage.accenture.com/api/user/claims',
                        getProfile: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/profile?enterpriseid={1}',
                        getAvatar: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/picture'
                    },
                    skills: {
                        getUserSkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/myskills',
                        getRecommendedSkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/skillsrecommended?roleId={1}&careerLevelCd={2}&size={3}',
                        getFollowSkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/skillsfollowed?roleId={1}&careerLevelCd={2}',
                        followUnfollowSkill: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/follow?skillId={1}&isFollow={2}&skillType={3}',
                        getSkillDescription: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/skilldetail/{1}/description',
                        getUserDTE: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/dte?enterpriseid={1}',
                        getBusinessPrioritySkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/bpskills?dte={1}',
                        getSpecialtySkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/specializationskills?size={1}',
                        getTopSkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/topskills?roleid={1}&careerlevelcd={2}'
                    },
                    recommendations:
                    {
                        getRecommendedLearnings: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/recommendedlearnings?size={1}&killCache={2}',
                        getRecommendedCommunities: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/recommendedcommunities?skills={1}&size={2}&killCache={3}',
                        getRecommendedPYMK: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/recommendedpeople?careerLevelCd={1}&size={2}&killCache={3}',
                        getSkillRecommendedLearnings: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/skilldetail/{1}/learnings?title={2}&careerLevelCd={3}&userProficiency={4}&size={5}&killCache={6}',
                        getLearningDetail: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/learningdetail/{1}?killCache=true'
                    }
                }
            },
           myLearningService: {
                serviceName: 'myLearningService',
                identifier: 'https://pews-pi.accenture.com/mylapi/',
                apiKey: 'rzbbpxmbvrxwjvrk69xn6kjk',
                secretKey: 'dhPg8wbbAW5cfecBfRbtJg5R',
                appName: 'myLearningService',
                url: {
                    myExpenses: 'https://mylbuild-pews.accenture.com/aclapi',

                    apis: {
                        getSingleFacility: 'https://webservice.accenture.com/1720_myLAPI/SB/Facility/getFacilityInfo?ActivityID={0}&FacilityID={1}&api_key={2}&sig={3}',
                        getFacilityList: 'https://pews-pi.accenture.com/aclapi/Facility/getFacilityList?api_key={0}&sig={1}'
                    },
                    training: {
                        getTraining: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getClassroomTrainingSchedule?api_key={0}&sig={1}',
                        getTrainingDesc: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getCourseObjectives?ActivityID={0}&api_key={1}&sig={2}',
                        getTrainingDetails: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getActivityAndUserDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}&api_key={3}&sig={4}',
                        getCourseCode: 'https://webservice.accenture.com/1720_myLAPI/SB/activity/getScheduleAndMaterials?ActivityID={0}&api_key={1}&sig={2}',
                        getCourseSchedule:'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getScheduleDetails?ActivityID={0}&api_key={1}&sig={2}',
                        getCourseMeterial: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getMaterialsDetails?ActivityID={0}&api_key={1}&sig={2}',
                        getPeopleLikeMe: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getPeopleLikeMe?PeopleKey={0}&ActivityID={1}&Source={2}&api_key={3}&sig={4}',
                  
                        getDemographicType: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/GetSupportedDemogs?source={0}&api_key={1}&sig={2}',
                        getDemographics: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/GetPeopleByDemog?ActivityID={0}&Source={1}&DemogTypeLabel={2}&api_key={3}&sig={4}',
                        getSurveyForSession: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/SurveyForSession?ActivityID={0}&api_key={1}&sig={2}',
                        getSurveyForFaculty: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/SurveyForFaculty?ActivityID={0}&api_key={1}&sig={2}',
                        getActivityTabs:'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getActivityTabs?ActivityID={0}&api_key={1}&sig={2}',


                        getRollCall: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/rollCall?AuthorID={0}&AuthorIDType={1}&ActivityID={2}&StatusTS={3}&api_key={4}&sig={5}',
                        getLearnerByStatus: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/LearnerByStatus?AuthorID={0}&AuthorIDType={1}&ActivityID={2}&AttendanceStatus={3}&StatusTS={4}&api_key={5}&sig={6}',
                        getAttendanceInfo: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/AttendanceInfo?AuthorID={0}&AuthorIDType={1}&LearnerID={2}&ActivityID={3}&StatusTS={4}&api_key={5}&sig={6}',
                        postCheckIn: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/checkIn?api_key={0}&sig={1}',
                        postCheckOut: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/checkOut?api_key={0}&sig={1}',
                        postAttendanceInfo: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/AttendanceInfo?api_key={0}&sig={1}',
                        getCircles: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/getCircles?AuthorID={0}&AuthorIDType={1}&ActivityID={2}&api_key={3}&sig={4}',
                        getVenue:'https://webservice.accenture.com/1720_myLearning/SB/Activity/getCurrentRLCSessionSchedule?facilityID={0}&api_key={1}&sig={2}',
                        getUpcomingSessions:'https://webservice.accenture.com/1720_myLearning/SB/Activity/getAdminRLCSessionDetails?StartDate={0}&EndDate={1}&AuthorIDType={2}&FacilityID={3}&TabCategory={4}&api_key={5}&sig={6}',
                        modifyDefaultCircle: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/ModifyDefaultCircle?api_key={0}&sig={1}',
                        searchPeople: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/getRosterDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}&SearchStr={3}&DemogCategory={4}&DemogKey={5}&api_key={6}&sig={7}',
                        getPeopleOnSite: 'https://webservice.accenture.com/1720_myLAPI/SB/Facility/getPeopleOnSite?ActivityID={0}&SearchStr={1}&RecordCount={2}&DemogCategory={3}&DemogKey={4}&api_key={5}&sig={6}',
                        getActivityEventInfo: 'https://webservice.accenture.com/1720_myLearning/SB/Activity/getActivityEventInfo?api_key={1}&sig={2}'
                    },
                    menu: {
                        getFullName: 'https://webservice.accenture.com/1720_myLAPI/SB/Other/getPeopleData?eid={0}&api_key={1}&sig={2}',
                        getProfilePicture: 'https://webservice.accenture.com/1720_myLAPI/SB/Other/getProfilePicture?eid={0}&api_key={1}&sig={2}',
                        getProfileInfo: 'https://webservice.accenture.com/1720_myLAPI/SB/Other/getPeopleData?eid={0}&api_key={1}&sig={2}'
                    },
                    impersonation: {
                        getACLWhitelistUser: 'https://webservice.accenture.com/1720_myLAPI/SB/Login/getACLWhitelistUser?enterpriseID={0}&api_key={1}&sig={2}',
                        getManageModePermission: 'https://webservice.accenture.com/1720_myLAPI/SB/Login/getACLManageModePermission?enterpriseID={0}&impersonateKey={1}&api_key={2}&sig={3}',
                        getSampleSessions: 'https://webservice.accenture.com/1720_myLAPI/SB/Activity/GetSampleSessions?CourseCode={0}&api_key={1}&sig={2}'
                    },
                    weather: {
                        getCurrentObservation: 'https://query.yahooapis.com/v1/public/yql?q={0}&format=json'
                    },
                    personalisedMessage: {
                        getPersonalisedMessage: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/PersonalisedMessage?AuthorID={0}&ActivityID={1}&api_key={2}&sig={3}',
                        postPersonalisedMessage: 'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/PersonalisedMessage?api_key={0}&sig={1}',
                        putPersonalisedMessage:'https://webservice.accenture.com/1720_myLearning/SB/AttendanceManagement/PersonalisedMessage?api_key={0}&sig={1}'
                    }
                }
            },
            careerPlanningService: {
                serviceName: 'careerPlanningService',
                identifier: 'https://careerplanning.ciostage.accenture.com/webapi/api/external-service/',
                url: {
                    careerBoard: {
                        getFutureSkills: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/futureskills?roleId={1}&careerLevelCd={2}&size={3}'
                    }
                }
            },
            actionPlanService: {
                serviceName: 'actionPlanService',
                identifier: 'https://actionplanservice.ciostage.accenture.com/',
                url: {
                    actionPlan: {
                        getActionPlan: 'https://actionplanservice.ciostage.accenture.com/external-service/GetActionPlan',
                        addActionPlanItem: 'https://actionplanservice.ciostage.accenture.com/external-service/InsertActionPlan(sourceappCode={0})',
                        removeActionPlanItem: 'https://actionplanservice.ciostage.accenture.com/external-service/DeleteActionPlan(actionPlanId={0})',
                        updateTargetDateActionPlanItem: 'https://actionplanservice.ciostage.accenture.com/external-service/UpdateActionPlanTargetDate(sourceappCode={0},actionPlanId={1},targetDate={2})',
                        updateStatusActionPlanItem: 'https://actionplanservice.ciostage.accenture.com/external-service/UpdateActionPlanStatus(sourceappCode={0},actionPlanId={1},status={2})'
                    }
                }
            },
            mySchedulingService: {
                serviceName: 'mySchedulingService',
                identifier: 'https://myschedsvc.ciostage.accenture.com',
                url: {
                    assignments: {
                        getMySchedulingAssignments: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/recommendedassignments?enterpriseId={1}&size={2}&skills={3}&careerLevelCd={4}&killCache={5}',
                        getAssignmentDetail: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/assignmentdetail?assignmentid={1}&killcache=true'

                    }
                }
            },
            acmService: {
                serviceName: 'acmService',
                identifier: 'https://careersmarketplace.ciostage.accenture.com/webapi/api/external-service/',
                url: {
                    positions: {
                        getACMPositions: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/recommendedopportunities?skills={1}&careerLevelCd={2}&size={3}&killCache={4}',
                        getPositionDetails: 'https://connectedlearningapp.ciostage.accenture.com/api/user/{0}/opportunitydetail?positionId={1}&killCache=true'
                    }
                }
            },
            circleService: {
                serviceName: 'circleService',
                identifier: 'urn:federation:collabstreammobile:service',
                circleId: '79dbd409-5edc-46a9-8e92-0006751722fe',
                circleGUID: '881985c9-ba27-4ff8-acaa-3953f7b8184c',
                url: {
                    stream: {
                        getStream: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}',
                        getStreamDetail: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/thread/{0}',
                        like: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/like/{0}',
                        share: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/shares/{0}',
                        comment: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/comments/{0}',
                        post: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}/event',
                        upload: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/upload/file?extension=.jpg',
                        getSuggestions: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/search',
                        getDiscussionStreamSecured: 'https://collab-ts.cioperf.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}&searchTxt={3}',
                        follow: 'https://collab-ts.cioperf.accenture.com/m/api/Stream/follow/{0} ',
                        getfollowstatus: 'https://collab-ts.cioperf.accenture.com/m/v2/api/Stream/tag?o=true&tag={0}'
                    }
                }
            }
        }
    };
    //APT Env
    var config_PERF = {
        clientId: 'f45302e0-3ac5-4ebe-b6fa-261b946928d4',
        environment: 'PERF',
        peopleUrl: 'https://peopleux-perf.ciotest.accenture.com/Experience.aspx?accountname=',
        acmURL: 'https://careersmarketplace.ciodev.accenture.com/Home/Position/',
        mySchedulingURL: 'https://mysched.ciostage.accenture.com/me/?path=assignment&id=',
        faq: 'https://kx.accenture.com/repositories/contributionform.aspx?path=c34/2/11&mode=read',
        services: {
            conlearningService: {
                serviceName: 'connectedlearningService',
                identifier: 'https://connectedlearningapp.ciotest.accenture.com/api',
                url: {
                    user: {
                        getUserSettings: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/userSettings',
                        setHaveSeenTutorial: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/tutorial',
                        setHaveSeenRecommededSkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/recommendedSkills',
                        sendFeedback: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/sendFeedback',
                        getClaims: 'https://connectedlearningapp.ciotest.accenture.com/api/user/claims',
                        getProfile: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/profile?enterpriseid={1}',
                        getAvatar: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/picture'
                    },
                    skills: {
                        getUserSkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/myskills',
                        getRecommendedSkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/skillsrecommended?roleId={1}&careerLevelCd={2}&size={3}',
                        getFollowSkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/skillsfollowed?roleId={1}&careerLevelCd={2}',
                        followUnfollowSkill: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/follow?skillId={1}&isFollow={2}&skillType={3}',
                        getSkillDescription: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/skilldetail/{1}/description',
                        getUserDTE: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/dte?enterpriseid={1}',
                        getBusinessPrioritySkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/bpskills?dte={1}',
                        getSpecialtySkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/specializationskills?size={1}',
                        getTopSkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/topskills?roleid={1}&careerlevelcd={2}'
                    },
                    recommendations:
                    {
                        getRecommendedLearnings: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/recommendedlearnings?size={1}&killCache={2}',
                        getRecommendedCommunities: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/recommendedcommunities?skills={1}&size={2}&killCache={3}',
                        getRecommendedPYMK: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/recommendedpeople?careerLevelCd={1}&size={2}&killCache={3}',
                        getSkillRecommendedLearnings: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/skilldetail/{1}/learnings?title={2}&careerLevelCd={3}&userProficiency={4}&size={5}&killCache={6}',
                        getLearningDetail: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/learningdetail/{1}?killCache=true'
                    }
                }
            },
            myLearningService: {
                serviceName: 'myLearningService',
                identifier: 'https://pews-pi.accenture.com/mylapi/'
            },
            careerPlanningService: {
                serviceName: 'careerPlanningService',
                identifier: 'https://careerplanning.ciotest.accenture.com/webapi/api/external-service/',
                url: {
                    careerBoard: {
                        getFutureSkills: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/futureskills?roleId={1}&careerLevelCd={2}&size={3}'
                    }
                }
            },
            actionPlanService: {
                serviceName: 'actionPlanService',
                identifier: 'https://careerplanning.ciotest.accenture.com/webapi/api/external-service/',
                url: {
                    actionPlan: {
                        getActionPlan: 'https://careerplanning.ciotest.accenture.com/external-service/GetActionPlan',
                        addActionPlanItem: 'https://careerplanning.ciotest.accenture.com/external-service/InsertActionPlan(sourceappCode={0})',
                        removeActionPlanItem: 'https://careerplanning.ciotest.accenture.com/external-service/DeleteActionPlan(actionPlanId={0})',
                        updateTargetDateActionPlanItem: "https://careerplanning.ciotest.accenture.com/external-service/UpdateActionPlanTargetDate(sourceappCode={0},actionPlanId={1},targetDate={2})",
                        updateStatusActionPlanItem: 'https://careerplanning.ciotest.accenture.com/external-service/UpdateActionPlanStatus(sourceappCode={0},actionPlanId={1},status={2})'
                    }
                }
            },
            mySchedulingService: {
                serviceName: 'mySchedulingService',
                identifier: 'https://myschedsvc.ciostage.accenture.com',
                url: {
                    assignments: {
                        getMySchedulingAssignments: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/recommendedassignments?enterpriseId={1}&size={2}&skills={3}&careerLevelCd={4}&killCache={5}',
                        getAssignmentDetail: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/assignmentdetail?assignmentid={1}&killcache=true'
                    }
                }
            },
            acmService: {
                serviceName: 'acmService',
                identifier: 'https://careersmarketplace-at.ciodev.accenture.com/webapi/api/external-service/',
                url: {
                    positions: {
                        getACMPositions: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/recommendedopportunities?skills={1}&careerLevelCd={2}&size={3}&killCache={4}',
                        getPositionDetails: 'https://connectedlearningapp.ciotest.accenture.com/api/user/{0}/opportunitydetail?positionId={1}&killCache=true'
                    }
                }
            }
        }
    };

    var config_PROD = {
        clientId: '3becaaac-7e22-4e31-81b9-ab16a5796069',
        environment: 'PROD',
        peopleUrl: 'https://people.accenture.com/Experience.aspx?accountname=',
        acmURL: 'https://careersmarketplace.accenture.com/Home/Position/',
        mySchedulingURL: 'https://myscheduling.accenture.com/me/?path=assignment&id=',
        faq: 'https://kx.accenture.com/repositories/contributionform.aspx?path=c34/2/11&mode=read',
        services: {
            conlearningService: {
                serviceName: 'connectedlearningService',
                identifier: 'https://connectedlearningapp.accenture.com/api',
                url: {
                    user: {
                        getUserSettings: 'https://connectedlearningapp.accenture.com/api/user/{0}/userSettings',
                        setHaveSeenTutorial: 'https://connectedlearningapp.accenture.com/api/user/{0}/tutorial',
                        setHaveSeenRecommededSkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/recommendedSkills',
                        sendFeedback: 'https://connectedlearningapp.accenture.com/api/user/{0}/sendFeedback',
                        getClaims: 'https://connectedlearningapp.accenture.com/api/user/claims',
                        getProfile: 'https://connectedlearningapp.accenture.com/api/user/{0}/profile?enterpriseid={1}',
                        getAvatar: 'https://connectedlearningapp.accenture.com/api/user/{0}/picture'
                    },
                    skills: {
                        getUserSkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/myskills',
                        getRecommendedSkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/skillsrecommended?roleId={1}&careerLevelCd={2}&size={3}',
                        getFollowSkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/skillsfollowed?roleId={1}&careerLevelCd={2}',
                        followUnfollowSkill: 'https://connectedlearningapp.accenture.com/api/user/{0}/follow?skillId={1}&isFollow={2}&skillType={3}',
                        getSkillDescription: 'https://connectedlearningapp.accenture.com/api/user/{0}/skilldetail/{1}/description',
                        getUserDTE: 'https://connectedlearningapp.accenture.com/api/user/{0}/dte?enterpriseid={1}',
                        getBusinessPrioritySkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/bpskills?dte={1}',
                        getSpecialtySkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/specializationskills?size={1}',
                        getTopSkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/topskills?roleid={1}&careerlevelcd={2}'
                    },
                    recommendations:
                    {
                        getRecommendedLearnings: 'https://connectedlearningapp.accenture.com/api/user/{0}/recommendedlearnings?size={1}&killCache={2}',
                        getRecommendedCommunities: 'https://connectedlearningapp.accenture.com/api/user/{0}/recommendedcommunities?skills={1}&size={2}&killCache={3}',
                        getRecommendedPYMK: 'https://connectedlearningapp.accenture.com/api/user/{0}/recommendedpeople?careerLevelCd={1}&size={2}&killCache={3}',
                        getSkillRecommendedLearnings: 'https://connectedlearningapp.accenture.com/api/user/{0}/skilldetail/{1}/learnings?title={2}&careerLevelCd={3}&userProficiency={4}&size={5}&killCache={6}',
                        getLearningDetail: 'https://connectedlearningapp.accenture.com/api/user/{0}/learningdetail/{1}?killCache=true'
                    }
                }
            },
            myLearningService: {
                serviceName: 'myLearningService',
                identifier: 'https://pews.accenture.com/mylapi/',
                apiKey: '84z6vns2u535mugca7prcmy8',
                secretKey: 'C6VacdB3bE58zq8vhzbd2CMY',
                appName: 'myLearningService',
                url: {
                    myExpenses: 'https://pews.accenture.com/aclapi/',
                    apis: {
                        getSingleFacility: 'https://pews.accenture.com/aclapi/Facility/getFacilityInfo?ActivityID={0}&FacilityID={1}'
                    },
                    training: {
                        getTraining: 'https://pews.accenture.com/aclapi/Activity/getClassroomTrainingSchedule',
                        getTrainingDesc: 'https://pews.accenture.com/aclapi/Activity/getCourseObjectives?ActivityID={0}',
                        getTrainingDetails: 'https://pews.accenture.com/aclapi/Activity/getActivityAndUserDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}',
                        getCourseCode: 'https://pews.accenture.com/aclapi/activity/getScheduleAndMaterials?ActivityID={0}',
                        searchPeople: 'https://pews.accenture.com/aclapi/Activity/getRosterDetails?ActivityID={0}&RecordCount={1}&ReturnSetFlag={2}&SearchStr={3}&DemogCategory={4}&DemogKey={5}',
                        getCourseSchedule: 'https://pews.accenture.com/aclapi/Activity/getScheduleDetails?ActivityID={0}',
                        getCourseMeterial: 'https://pews.accenture.com/aclapi/Activity/getMaterialsDetails?ActivityID={0}',
                        getPeopleLikeMe: 'https://pews.accenture.com/aclapi/Activity/getPeopleLikeMe?PeopleKey={0}&ActivityID={1}&Source={2}',
                        getPeopleOnSite: 'https://pews.accenture.com/aclapi/Facility/getPeopleOnSite?ActivityID={0}&SearchStr={1}&RecordCount={2}&DemogCategory={3}&DemogKey={4}',
                        getDemographicType: 'https://pews.accenture.com/aclapi/Activity/GetSupportedDemogs?source={0}',
                        getDemographics: 'https://pews.accenture.com/aclapi/Activity/GetPeopleByDemog?ActivityID={0}&Source={1}&DemogTypeLabel={2}',
                        getSurveyForSession: 'https://pews.accenture.com/aclapi/Activity/SurveyForSession?ActivityID={0}',
                        getSurveyForFaculty: 'https://pews.accenture.com/aclapi/Activity/SurveyForFaculty?ActivityID={0}',
                        getActivityTabs: 'https://pews.accenture.com/aclapi/Activity/getActivityTabs?ActivityID={0}',
                        getUpcomingSessions: 'http://54.169.123.157/UpcomingSessions',
                        getVenue: 'http://54.169.123.157/UpcomingSessions'
                    },
                    menu: {
                        getFullName: 'https://pews.accenture.com/aclapi/other/getPeopleData?eid={0}',
                        getProfilePicture: 'https://pews.accenture.com/aclapi/other/getProfilePicture?eid={0}',
                        getProfileInfo: 'https://pews.accenture.com/aclapi/other/getPeopleData?eid={0}'
                    },
                    impersonation: {
                        getACLWhitelistUser: 'https://pews.accenture.com/aclapi/User/getACLWhitelistUser?enterpriseID={0}',
                        getManageModePermission: 'https://pews.accenture.com/aclapi/User/getACLManageModePermission?enterpriseID={0}&impersonateKey={1}',
                        getSampleSessions: 'https://pews.accenture.com/aclapi/User/getSampleSessions?CourseCode={0}'
                    },
                    weather: {
                        getCurrentObservation: 'https://query.yahooapis.com/v1/public/yql?q={0}&format=json'
                    }
                }
            },
            careerPlanningService: {
                serviceName: 'careerPlanningService',
                identifier: 'https://careerplanning.accenture.com/webapi/api/external-service/',
                url: {
                    careerBoard: {
                        getFutureSkills: 'https://connectedlearningapp.accenture.com/api/user/{0}/futureskills?roleId={1}&careerLevelCd={2}&size={3}'
                    }
                }
            },
            actionPlanService: {
                serviceName: 'actionPlanService',
                identifier: 'https://actionplanservice.accenture.com',
                url: {
                    actionPlan: {
                        getActionPlan: 'https://actionplanservice.accenture.com/external-service/GetActionPlan',
                        addActionPlanItem: 'https://actionplanservice.accenture.com/external-service/InsertActionPlan(sourceappCode={0})',
                        removeActionPlanItem: 'https://actionplanservice.accenture.com/external-service/DeleteActionPlan(actionPlanId={0})',
                        updateTargetDateActionPlanItem: 'https://actionplanservice.accenture.com/external-service/UpdateActionPlanTargetDate(sourceappCode={0},actionPlanId={1},targetDate={2})',
                        updateStatusActionPlanItem: 'https://actionplanservice.accenture.com/external-service/UpdateActionPlanStatus(sourceappCode={0},actionPlanId={1},status={2})'
                    }
                }
            },
            mySchedulingService: {
                serviceName: 'mySchedulingService',
                identifier: 'https://myschedulingsvc.accenture.com',
                url: {
                    assignments: {
                        getMySchedulingAssignments: 'https://connectedlearningapp.accenture.com/api/user/{0}/recommendedassignments?enterpriseId={1}&size={2}&skills={3}&careerLevelCd={4}&killCache={5}',
                        getAssignmentDetail: 'https://connectedlearningapp.accenture.com/api/user/{0}/assignmentdetail?assignmentid={1}&killcache=true'
                    }
                }
            },
            acmService: {
                serviceName: 'acmService',
                identifier: 'https://careersmarketplace.accenture.com/webapi/api/external-service/',
                url: {
                    positions: {
                        getACMPositions: 'https://connectedlearningapp.accenture.com/api/user/{0}/recommendedopportunities?skills={1}&careerLevelCd={2}&size={3}&killCache={4}',
                        getPositionDetails: 'https://connectedlearningapp.accenture.com/api/user/{0}/opportunitydetail?positionId={1}&killCache=true'
                    }
                }
            },
            circleService: {
                serviceName: 'circleService',
                identifier: 'urn:federation:collabstreammobile:service',
                circleId: '79dbd409-5edc-46a9-8e92-0006751722fe',
                circleGUID: '881985c9-ba27-4ff8-acaa-3953f7b8184c',
                url: {
                    stream: {
                        getStream: 'https://collab-ts.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}',
                        getStreamDetail: 'https://collab-ts.accenture.com/m/api/Stream/thread/{0}',
                        like: 'https://collab-ts.accenture.com/m/api/Stream/like/{0}',
                        share: 'https://collab-ts.accenture.com/m/api/Stream/shares/{0}',
                        comment: 'https://collab-ts.accenture.com/m/api/Stream/comments/{0}',
                        post: 'https://collab-ts.accenture.com/m/api/v2/Stream/{0}/event',
                        upload: 'https://collab-ts.accenture.com/m/api/Stream/upload/file?extension=.jpg',
                        getSuggestions: 'https://collab-ts.accenture.com/m/api/Stream/search',
                        getDiscussionStreamSecured: 'https://collab-ts.accenture.com/m/api/v2/Stream/{0}?threadCount={1}&pagingToken={2}&searchTxt={3}',
                        follow: 'https://collab-ts.accenture.com/m/api/Stream/follow/{0} ',
                        getfollowstatus: 'https://collab-ts.accenture.com/m/v2/api/Stream/tag?o=true&tag={0}'
                    }
                }
            }
        }
    };


    // config object
    var config = {
        clientId: '',
        environment: '',
        services: {}
    };

    this.setEnvironment = function (environment) {
        if (environment === envs.MOCK) { config = config_MOCK; }
        else if (environment === envs.LOCAL) { config = config_LOCAL; }
        else if (environment === envs.DEV) { config = config_DEV; }
        else if (environment === envs.PERF) { config = config_PERF; }
        else if (environment === envs.STAGE) { config = config_STAGE; }
        else if (environment === envs.PROD) {
            config = config_PROD;
        }
    };

    this.$get = function () {
        return config;
    };


    // config object
    //var config = {
    //    url: {},
    //    clientId: '',
    //    identifier: '',
    //    jwt: ''
    //};

    //this.setEnvironment = function (environment) {
    //    if (environment === envs.MOCK) { config = config_MOCK; }
    //    else if (environment === envs.PROD) { config = config_PROD; }
    //};

    //this.$get = function () {
    //    return config;
    //};
}]);

app.run(['$rootScope', 'connectedLearning.constants', function ($rootScope, constants) {

    'use strict';

    $rootScope.constants = constants;
}]);