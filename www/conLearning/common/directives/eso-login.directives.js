/**
 * Created by ory-lamballe.antoine on 11/06/2015.
 */


/**
 * Creates a login form where the directive tag is inserted. This tag accepts 4 parameters:
 * - scope (required): the ESO scope, could be something like the base URL of the website
 * - stage (optional): attribute without value or with a boolean to indicate whether the stage ESO env is used instead of prod
 * - proxy (optional): attribute without value or with a boolean to indicate whether a local redirection proxy is used
 * instead of directly calling ESO URL, to avoid CORS issues
 * - callback (optional): function with parameter "jwt" (add this parameter in the attribute value:
 * 'callback="myCallback(jwt)"'), a callback function called when we got the JWT from the ESO server. An alternative
 * is to use the broadcasted event 'loginJWT' instead.
 *
 * IMPORTANT: The service esoAutomation::getAccessTokenByForm() already implements listening to the broadcasted event
 * and returning a promise. Please refer to this method for an easier use of the form result.
 *
 * Validating the form calls the ESO web service to get a JWT.
 * The JWT returned is provided by 2 ways: calling the callback function provided in the "callback" attribute if any
 * with a "jwt" attribute (ex of attribute in the tag: callback="setJWT(jwt)"), and broadcast an event "loginJWT" to
 * the $rootScope with the responsed jwt as data. If listening to this broadcast event, don't forget to unregister
 * once the login is completed. In case of error, the broadcasted event has 2 fields: error (true) and reason. "reason"
 * typically contains the following fields: config (the request config), data (the response), status (code), statusText and headers: a function
 * that retrieves the headers (response headers I guess - this function maybe requires the header name as parameter:
 * to test).
 */
angular.module('esoLogin', ['ngResource']).directive('esoLoginForm', function (esoAutomation) {
    return {
        restrict: 'E',
        scope: {scope: '@', stage: '@', proxy: '@', callback: '&'},
        //templateUrl: 'templates/esoLogin/esoLogin.html',
        template: '<form ng-submit="login()" role="form" class="list" style="position: relative;"> <label class="item item-input"> <input ng-model="username" ng-disabled="loading" name="username" type="text" placeholder="EID (ex: john.smith)"> </label> <label class="item item-input"> <input ng-model="password" ng-disabled="loading" name="password" type="password" placeholder="Password"> </label> <div class="padding text-center"> <button type="submit" class="button button-block button-stable" ng-disabled="loading">Log in</button> <ion-spinner ng-show="loading" style="position: absolute;top:0;left:0;right:0;z-index: 2;"></ion-spinner> <p class="error" ng-show="error">{{error}}</p></div></form>',
        controller: function ($scope, $rootScope, $element, $attrs) {

            // Required parameter: scope to use to call ESO web service
            var esoScope = $scope.scope; // should be required
            if (!esoScope) {
                console.error('The esoLoginForm directive requires a scope attribute to authenticate to ESO. It is typically the URL of the website. Ex: <eso-login-form scope="https://myapp.accenture.com"></eso-login-form>');
            }
            // Optional parameters
            // Using the stage ESO environment instead of prod (testing accounts)
            var isStage = angular.isString($scope.stage) && $scope.stage !== 'false';
            // Using a proxy to avoid cross-domain (CORS) issues. It requires to have a local proxy, e.g. with Ionic configuration.
            // See how to configure a redirection proxy in ionic.project with config field "proxies"
            var useProxy = angular.isString($scope.proxy) && $scope.proxy !== 'false';
            // Callback function to call with the JWT we got from the web service. Note that the JWT is also given by an angular event 'loginJWT' fired on the $rootScope.
            var callback = $scope.callback;

            $scope.login = login;

            // debug
            //$scope.loading = true;


            function login() {
                var eid = $scope.username;
                var password = $scope.password;
                $scope.loading = true;
                $scope.error = null;

                esoAutomation.getJWT(eid, password, esoScope, isStage, useProxy).then(function(response){
                    $scope.loading = false;
                    $scope.error = null;
                    var responseJson = response.toJSON();
                    if (angular.isFunction(callback)) {
                        callback({jwt: responseJson});
                    }
                    $rootScope.$broadcast('loginJWT', responseJson);
                }).then(null, function(reason) {
                    $scope.loading = false;
                    if (reason.status === 400) {
                        $scope.error = "The authentication to the ESO service failed. Please check your password and try again.";
                        console.error("Authentication failed:", reason);
                    } else {
                        $scope.error = "Sorry, an unexpected error occurred while trying to authenticate. Please try again later.";
                        console.error("Authentication failed:", reason);
                    }
                    var envLabel = isStage ? "stage" : "production";
                    console.error("If the EID and password are correct, please also check your configuration: is your scope (" + esoScope + ") correct? Are you using the right environment (" + envLabel + ") with an account (" + eid + ") available in this environment?");
                    $rootScope.$broadcast('loginJWT', {error: true, reason: reason});
                });
            }
        }
    };
}).provider('esoAutomation', function () {

    var stageDomain = 'federation-sts-stage.accenture.com';
    var prodDomain = 'federation-sts.accenture.com';
    var stageDomainProxy = '/jwtstage';
    var prodDomainProxy = '/jwt';

    var providerScope;

    this.setScope = setScope;


    function setScope(scope) {
        providerScope = scope;
    }

    this.$get = function esoAutomationFactory($injector, $q, $rootScope) {

        // 3 parameters are required: username, password, scope
        var _JWT = null;

        return {
            getAccessTokenByForm: getAccessTokenByForm,
            getJWT: getJWT,
            sum: sum
        };


        /**
         * This function can be used to connect your code with the form of the directive esoLoginForm
         * (<eso-login-form></eso-login-form>). Returns a promise resolved when the form of the directive
         * is successfully validated. The promise returns the JWT.
         *
         * The application is responsible of displaying the directive at the relevant place, then it can call this
         * method to listen to the result of the form validation (wait until the promise is resolved).
         * @return {Promise} of the JWT.
         */
        function getAccessTokenByForm() {
            // listen to the login event. when fired, resolve the promise and remove event listener.

            var deferred = $q.defer();

            var unsubscriber = $rootScope.$on('loginJWT', function (event, data) {
                if (data && !data.error) {
                    unsubscriber();
                    deferred.resolve(data);
                } else {
                    deferred.reject(data.reason);
                }
            });
            $rootScope.$on('$destroy', function() {
                unsubscriber();
            });
            return deferred.promise;
        }

        function initJWTResource(isStage, useProxy) {
            var $resource = $injector.get('$resource');
            var url;
            if (useProxy) {
                url = isStage ? stageDomainProxy : prodDomainProxy;
            } else {
                var domain = isStage ? stageDomain : prodDomain;
                url = 'https://' + domain + '/services/jwt/issue/adfs';
            }
            return $resource(url,
                {}, {
                    request: {method: 'POST'}//, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
        }

        function getJWTResource(isStage, useProxy) {
            if (_JWT === null) {
                _JWT = initJWTResource(isStage, useProxy);
            }
            return _JWT;
        }

        function getJWT(eid, password, scope, isStage, useProxy) {
            // Parameter checks
            if (arguments.length < 2 || !eid || !password) {
                console.error("An EID and a password are required to request a JWT. Please also check that the scope was defined.");
                return;
            }
            if (arguments.length === 2) {
                scope = providerScope;
            }
            if (!scope) {
                console.error("The scope is required to request a JWT to the ESO service, but ", scope, "is not a valid scope. Please set the scope with the provider method esoAutomationProvider.setScope(scopeString) or pass it as a third parameter to the method getJWT().");
                return;
            }

            var JWT = getJWTResource(isStage, useProxy);
            var jwt = JWT.request({grant_type: "password", username: eid, password: password, scope: scope});
            var p = jwt.$promise;
            if (p.then) {
                return p.then(function(promised) {
                    return promised;
                });
            }
        }

        // To test Cucumber
        function sum(a, b) {
            return a + b;
        }

        function buyMicrowave(user, askReceipt) {
            //console.log("Buy a microwave");
            var microwaveCost = 100;
            user.microwave = {name: "microwave", amount: microwaveCost};
            if (askReceipt) {
                user.microwave.receipt = true;
            }
            user.money -= microwaveCost;
            return user;
        }

        function returnMicrowave(user) {
            var microwaveCost = 100;
            user.microwave = null;
            user.money += microwaveCost;
            return user;
        }
    };
});