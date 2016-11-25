'use strict';
services.service('streamService', ['$q', '$http', '$timeout', '$cordovaFileTransfer', 'environmentData', 'connectedLearning.methods', 'securityService','trainingService', 'authService',
    function ($q, $http, $timeout, $cordovaFileTransfer, environment, methods, securityService, trainingService, authService) {
        //#region Model Definition
        var streamModel = [];
        var stream = [];
        var detail = {};
        var suggestionTimeout = null;
        //#region Common WS Retry functionality
        var httpService = {
            fetchData: function (url, method, config, data, refresh) {
                var deferred = $q.defer();
                if (method == "GET") {
                    return httpService.get(url, config, refresh);
                }
                else if (method == "POST") {
                    return httpService.post(url, data, config, refresh);
                }
                else {
                    // TODO(daguang) when method is not "GET" or "POST"
                    console.error("method error");
                    deferred.reject("method error, please check if method is 'GET' or 'POST'");
                }
                return deferred.promise;
            },
            get: function (url, config, refresh) {
                var deferred = $q.defer();
                $http.get(url, config).success(function (data) {
                    // cache data to indexedDB
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
        //#endregion
        var streamService = {
            //#region Model Management
            getCurrentStream: function () {
                return stream;
            },
            setDetail: function (article) {
                detail = article;
            },
            getDetailFromStream: function (id) {
                return methods.getByProperty('eventID', stream, id);
            },
            clearStream: function () {
                stream = [];
            },
            likeManagement: function (article) {
                if (article) {
                    if (article.userLikeThis > 0) {
                        article.likeCount--;
                        article.userLikeThis = 0;
                    }
                    else {
                        article.likeCount++;
                        article.userLikeThis = 1;
                    }
                }
            },
            shareManagement: function (article) {
                if (article) {
                    if (!article.userShareThis) {
                        article.shareCount++;
                    }
                    article.userShareThis = 1;
                }
            },
            commentManagement: function (article, comment) {
                if (article) {
                    article.Comments.unshift(comment);
                    article.commentCount++;
                }
            },
            //#endregion
            //#region Public Methods
            getEventSecured: function (circleId, threadCount, pagingToken, refresh) {
                var deferred = $q.defer();
                if (refresh != true && streamModel.length > 0) {
                    var isFind = false;
                    angular.forEach(streamModel, function (model) {
                        if ((model.circleId == circleId) && (model.pagingToken == pagingToken)) {
                            isFind = true;
                            $timeout(function () {
                                deferred.resolve(model.data);
                            });
                            return;
                        }
                    });
                    if (isFind) {
                        return deferred.promise;
                    }
                }
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.getStreamSecured,
                    params: { circleId: circleId, threadCount: threadCount, pagingToken: pagingToken }
                }).then(function (data) {
                    var model = {
                        circleId: circleId,
                        pagingToken: pagingToken,
                        data: data
                    };
                    angular.forEach(streamModel, function (stream, index) {
                        if ((stream.circleId == circleId) && (stream.pagingToken == pagingToken)) {
                            streamModel.splice(index, 1);
                        }
                    });
                    streamModel.push(model);
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getStreamDetail: function (articleId) {
                var deferred = $q.defer();
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.getStreamDetailSecured,
                    params: { articleId: articleId }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            like: function (articleId) {
                var deferred = $q.defer();
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.likeSecured,
                    params: { articleId: articleId }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            share: function (articleId) {
                var deferred = $q.defer();
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.shareSecured,
                    params: { articleId: articleId }
                }).then(function (data) {
                    //crittercismService.endTransaction('Share_Article');
                    deferred.resolve(data);
                }, function (error) {
                    //crittercismService.failTransaction('Share_Article');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            comment: function (articleId, text) {
                var deferred = $q.defer();
                //crittercismService.beginTransaction('Comment_Article');
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.commentSecured,
                    params: { articleId: articleId, text: text }
                }).then(function (data) {
                    //crittercismService.endTransaction('Comment_Article');
                    deferred.resolve(data);
                }, function (error) {
                    //crittercismService.failTransaction('Comment_Article');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            post: function (circleId, text) {
                var deferred = $q.defer();
                //crittercismService.beginTransaction('Post_Article');
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.postSecured,
                    params: { circleId: circleId, text: text }
                }).then(function (data) {
                    //crittercismService.endTransaction('Post_Article');
                    deferred.resolve(data);
                }, function (error) {
                    //crittercismService.failTransaction('Post_Article');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            upload: function (img) {
                var deferred = $q.defer();
                //crittercismService.beginTransaction('Upload_Image');
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.uploadSecured,
                    params: { img: img }
                }).then(function (data) {
                    //crittercismService.endTransaction('Upload_Image');
                    deferred.resolve(data);
                }, function (error) {
                    //crittercismService.failTransaction('Upload_Image');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDiscussionStream: function (circleId, threadCount, pagingToken, hashtag) {
                var deferred = $q.defer();
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.getDiscussionStreamSecured,
                    params: { circleId: circleId, threadCount: threadCount, pagingToken: pagingToken, hashtag: hashtag }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMyActivity: function (enterpriseId) {
                var deferred = $q.defer();
                //crittercismService.beginTransaction('Load_User_Activity');
                authService.callService({
                    serviceName: environment.services.customService.serviceName,
                    action: streamService.getMyActivitySecured,
                    params: { enterpriseId: enterpriseId }
                }).then(function (data) {
                    //crittercismService.endTransaction('Load_User_Activity');
                    deferred.resolve(data);
                }, function (error) {
                    //crittercismService.failTransaction('Load_User_Activity');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //#endregion
            //#region Private Methods
            getStreamSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.getStream, url = methods.urlFormat(baseUrl, params.circleId, params.threadCount, params.pagingToken), deferred = $q.defer(), authorization = jwt || '';
                httpService.fetchData(url, 'GET', {
                    cache: false,
                    headers: {
                        'Authorization': authorization
                    }
                }).then(function (data) {
                    stream = stream.concat(data.Threads);
                    deferred.resolve(stream);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getStreamDetailSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.getStreamDetail, url = methods.urlFormat(baseUrl, params.articleId), deferred = $q.defer(), authorization = jwt || '';
                httpService.fetchData(url, 'GET', {
                    cache: false,
                    headers: {
                        'Authorization': authorization
                    }
                }).then(function (data) {
                    var post = detail;
                    if (post) {
                        post.Shares = data.Shares;
                        post.Likes = data.Likes;
                        post.Comments = data.Comments;
                    }
                    else {
                        post = data;
                    }
                    deferred.resolve(post);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            likeSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.like, url = methods.urlFormat(baseUrl, params.articleId), deferred = $q.defer(), authorization = jwt || '';
                httpService.post(url, null, {
                    cache: false,
                    headers: {
                        'Authorization': authorization,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            shareSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.share, url = methods.urlFormat(baseUrl, params.articleId), deferred = $q.defer(), authorization = jwt || '';
                httpService.post(url, null, {
                    cache: false,
                    headers: {
                        'Authorization': authorization,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            commentSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.comment, url = methods.urlFormat(baseUrl, params.articleId), deferred = $q.defer(), authorization = jwt || '', parameters = { markup: params.text, platform: '' };
                httpService.post(url, parameters, {
                    cache: false,
                    headers: {
                        'Authorization': authorization,
                        'Content-Type': 'application/json'
                    }
                }).then(function (data) {
                    //data = [];
                    //data.push({ authorEID: 'f.avila.pacheco', eventDt: new Date(), bodyTxt: params.text });
                    if (data && data.length > 0) {
                        deferred.resolve(data[0]);
                    }
                    else {
                        deferred.reject('Comment has no data');
                    }
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            postSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.post, url = methods.urlFormat(baseUrl, params.circleId), deferred = $q.defer(), authorization = jwt || '', parameters = { bodyPlain: params.text, deviceOrigin: '', typeEventID: 1 };
                httpService.post(url, parameters, {
                    cache: false,
                    headers: {
                        'Authorization': authorization,
                        'Content-Type': 'application/json'
                    }
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            uploadSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.upload, url = baseUrl, deferred = $q.defer(), authorization = jwt || '';
                //var options = new FileUploadOptions();
                //options.fileKey = "file";
                //options.fileName = params.img.substr(params.img.lastIndexOf('/') + 1);
                //options.mimeType = "image/jpeg";
                ///*Add headers to both params.headers and to options.headers for iOS and Android compatibility.*/
                //var parameters = {};
                //parameters.headers = { "Authorization": authorization };
                //options.params = parameters;
                //options.headers = parameters.headers;
                //var ft = new FileTransfer();
                //ft.upload(params.img, encodeURI(url),
                //    function (data) {
                //        if (data.responseCode == 200) {
                //            deferred.resolve(data.response);
                //        }
                //        else {
                //            data.status = data.responseCode;
                //            deferred.reject({ data: data });
                //        }
                //    },
                //    function (error) {
                //        error.status = error.http_status;
                //        deferred.reject(error);
                //    }, options);
                var options = {
                    fileKey: "file",
                    fileName: params.img.substr(params.img.lastIndexOf('/') + 1),
                    mimeType: "image/jpeg",
                    parameters: { headers: { Authorization: authorization } },
                    params: { headers: { Authorization: authorization } },
                    headers: { Authorization: authorization }
                };
                document.addEventListener('deviceready', function () {
                    $cordovaFileTransfer.upload(url, params.img, options)
                        .then(function (data) {
                        if (data.responseCode == 200) {
                            var result = data.response.replace(/"/g, '');
                            deferred.resolve(result);
                        }
                        else {
                            data.status = data.responseCode;
                            deferred.reject({ data: data });
                        }
                    }, function (error) {
                        error.status = error.http_status;
                        deferred.reject({ data: error });
                    }, function (progress) {
                        // constant progress updates
                    });
                }, false);
                return deferred.promise;
            },
            followSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.follow, url = methods.urlFormat(baseUrl, params.groupID), deferred = $q.defer(), authorization = jwt || '';
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
            unfollowSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.unfollow, url = methods.urlFormat(baseUrl, params.groupID), deferred = $q.defer(), authorization = jwt || '';
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
            getDiscussionsSecured: function (jwt, params) {
                var baseUrl = environment.services.myLService.url.getDiscussions, url = methods.urlFormat(baseUrl, params.circleId), deferred = $q.defer(), authorization = jwt || '';
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
            getDiscussionStreamSecured: function (jwt, params) {
                var baseUrl = environment.services.circleService.url.stream.getDiscussionStreamSecured, url = methods.urlFormat(baseUrl, params.circleId, params.threadCount, params.pagingToken, params.hashtag), deferred = $q.defer(), authorization = jwt || '';
                httpService.fetchData(url, 'GET', {
                    cache: false,
                    headers: {
                        'Authorization': authorization
                    }
                }).then(function (data) {
                    var results = [];
                    for (var c = 0; c < data.Threads.length; c++) {
                        //var article = streamService.getNewArticle(data.Threads[c]);
                        results.push(data.Threads[c]);
                    }
                    deferred.resolve(results);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMyActivitySecured: function (jwt, params) {
                var baseUrl = environment.services.customService.url.stream.getUserStream, url = methods.urlFormat(baseUrl, params.enterpriseId), deferred = $q.defer(), authorization = jwt || '';
                httpService.fetchData(url, 'GET', {
                    cache: false,
                    headers: {
                        'Authorization': authorization
                    }
                }).then(function (data) {
                    var results = [];
                    for (var c = 0; c < data.Threads.length; c++) {
                        var article = streamService.getNewArticle(data.Threads[c]);
                        results.push(data.Threads[c]);
                    }
                    deferred.resolve(results);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getNewArticle: function (oldArticle) {
                var article = angular.copy(oldArticle);
                article.leadinSubjectTxt = oldArticle.leadinSubjectCard;
                article.leadinVerbTxt = oldArticle.leadinPredicateTxt;
                article.authorEID = oldArticle.enterpriseID;
                article.threadDisplayTxt = oldArticle.ownerTxt;
                article.threadEventDt = oldArticle.eventUTCDatetime;
                article.bodyTxt = oldArticle.bodyMarkup;
                article.hasLiked = (oldArticle.userLikeThis > 0) ? 1 : 0;
                article.userShareThis = (oldArticle.userShareThis > 0) ? 1 : 0;
                return article;
            },
            getSuggestions: function (keyword) {
                var deferred = $q.defer();
                //crittercismService.beginTransaction('Load_Suggestions');
                authService.callService({
                    serviceName: environment.services.circleService.serviceName,
                    action: streamService.getSuggestionsSecured,
                    params: { keyword: keyword }
                }).then(function (data) {
                    //crittercismService.endTransaction('Load_Suggestions');
                    var handledData = data.results;
                    angular.forEach(handledData, function (person) {
                        person.EnterpriseId = person.enterpriseID;
                        person.PersonalDisplayName = person.displayName;
                        var splitted_displaytxt = person.displaytxt.split(",");
                        person.Role = splitted_displaytxt[0].split("|")[1];
                    });
                    deferred.resolve(handledData);
                }, function (error) {
                    //crittercismService.failTransaction('Load_Suggestions');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getSuggestionsSecured: function (jwt, params) {
                if (methods.isEmptyOrNull(params.keyword)) {
                    return [];
                }
                var baseUrl = environment.services.circleService.url.stream.getSuggestions, url = methods.urlFormat(baseUrl), deferred = $q.defer(), authorization = jwt || '', parameters = { exactmatch: 0, requestid: 1, searchtxt: params.keyword };
                //Delay the typeahead search 500ms to avoid multiple calls to the API service.
                $timeout.cancel(suggestionTimeout);
                suggestionTimeout = $timeout(function () {
                    httpService.post(url, parameters, {
                        cache: true,
                        headers: {
                            'Authorization': authorization
                        }
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });
                }, 500);
                return deferred.promise;
            },
            getEventImage: function (enterpriseId) {
                var deferred = $q.defer();
                //crittercismService.beginTransaction('Load_Image');
                authService.callService({
                    serviceName: environment.services.myLearningService.serviceName,
                    action: streamService.getEventImageSecured,
                    params: enterpriseId
                }).then(function (data) {
                    //crittercismService.endTransaction('Load_Image');
                    deferred.resolve(data);
                }, function (error) {
                    //crittercismService.failTransaction('Load_Image');
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getEventImageSecured: function (jwt, enterpriseId) {
                if (methods.isEmptyOrNull(enterpriseId)) {
                    enterpriseId = '';
                }
                var baseUrl = environment.services.myLearningService.url.menu.getProfilePicture;
                if (!enterpriseId.match(/^[0-9].*?[0-9]$/)) {
                    baseUrl = environment.services.myLearningService.url.menu.getProfilePicture;
                }
                var url = methods.urlFormat(baseUrl, enterpriseId),
                //deferred = $q.defer(),
                    authorization = jwt || '';
                return httpService.fetchData(url, 'GET', {
                    cache: true,
                    headers: {
                        'Authorization': authorization
                    }
                });
            },

         followStatus: function (jwt, params) {
             var baseUrl = environment.services.circleService.url.stream.getfollowstatus,
            url = methods.urlFormat(baseUrl, params.eid),
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

        getFollowStatusModel: function (eid) {
            var deferred = $q.defer();
            authService.callService({
                 serviceName: environment.services.circleService.serviceName,
                 //1
                 action: streamService.followStatus,
                 params: { eid: eid }
             }).then(function (data) {
                 deferred.resolve(data);
             }, function (error) {
                 deferred.reject(error);
             });
            return deferred.promise;
        },

        };
        return streamService;
    }]);
//# sourceMappingURL=stream.service.js.map