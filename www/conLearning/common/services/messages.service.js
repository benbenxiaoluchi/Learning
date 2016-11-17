/*global services, angular*/

services.service('connectedLearning.messages', ['$rootScope', function ($rootScope) {
    /// <summary>
    /// Service to manage communication between layers.
    /// </summary>
    /// <param name="$rootScope">
    /// type in module ng:
    /// A root scope can be retrieved using the $rootScope key from the $injector.
    /// Child scopes are created using the $new() method. (Most scopes are created automatically when compiled HTML template is executed.)
    /// </param>
    /// <doc>connectedLearning.services:messages</doc>

    'use strict';

    var service = {};

    service.message = '';

    service.broadcast = function (eventId, msg, ok, cancel) {
        /// <summary>
        /// Broadcast event.
        /// </summary>
        /// <param name="eventId">Event.</param>
        /// <param name="msg">Message.</param>
        /// <param name="ok">Function to be executed.</param>
        /// <param name="cancel">Function to be executed.</param>
        /// <doc>connectedLearning.services:messages#broadcastEvent</doc>

        if (angular.isDefined(cancel) || angular.isDefined(ok)) {
            $rootScope.$broadcast(eventId, { 'message': msg, 'ok': ok, 'cancel': cancel });
        } else if (angular.isDefined(msg)) {
            $rootScope.$broadcast(eventId, { 'message': msg });
        } else {
            $rootScope.$broadcast(eventId);
        }
    };

    return service;
}]);