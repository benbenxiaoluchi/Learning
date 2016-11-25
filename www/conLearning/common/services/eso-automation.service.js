/**
 * Created by ory-lamballe.antoine on 09/06/2015.
 */

angular.module('esoAutomation', ['ngResource']).provider('esoAutomation', function () {

    var providerScope;

    this.setScope = setScope;


    function setScope(scope) {
        providerScope = scope;
    }

    this.$get = function esoAutomationFactory($resource) {

        // 3 parameters are required: username, password, scope
        var JWT = initJWTResource();

        return {
            getJWT: getJWT,
            sum: sum
        };


        function initJWTResource() {
            return $resource('https://federation-sts.accenture.com/services/jwt/issue/adfs',
                {}, {
                    request: {method: 'POST'}//, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
        }

        function getJWT(eid, password, scope) {
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

            var jwt = JWT.request({ grant_type: "password", username: eid, password: password, scope: scope }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
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