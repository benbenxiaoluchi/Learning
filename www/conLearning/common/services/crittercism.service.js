'use strict';

factories.factory('crittercismService', ['connectedLearning.constants',
    function (constants) {

        function IsCrittercismAvailable() {
            return (typeof Crittercism !== 'undefined');
        }

        var services = {
            setUsername: function (enterpriseId) {
                if (IsCrittercismAvailable()) {
                    Crittercism.setUsername(enterpriseId);
                }
            },
            leaveBreadcrumb: function (breadcrumb) {
                if (IsCrittercismAvailable()) {
                    Crittercism.leaveBreadcrumb(breadcrumb);
                }
            },
            beginTransaction: function (transaction) {
                if (IsCrittercismAvailable()) {
                    Crittercism.beginTransaction(transaction);
                }
            },
            endTransaction: function (transaction) {
                if (IsCrittercismAvailable()) {
                    Crittercism.endTransaction(transaction);
                }
            },
            failTransaction: function (transaction) {
                if (IsCrittercismAvailable()) {
                    Crittercism.failTransaction(transaction);
                }
            },
            setTransactionValue: function (transaction, value) {
                if (IsCrittercismAvailable()) {
                    Crittercism.setTransactionValue(transaction, value);
                }
            }
        };

        return services;
    }]
);