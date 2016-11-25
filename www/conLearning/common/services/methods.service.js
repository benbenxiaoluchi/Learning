/*global angular, factories, $httpProvider */
/*jslint regexp: true */

factories.factory('connectedLearning.methods', ['connectedLearning.constants', '$filter', function (constants, $filter) {
    /// <summary>
    /// Factory that contains all common methods used by connectedLearning application.
    /// </summary>
    /// <param name="$filter">
    /// Angular's service which purpose is to format the value of an expression for display to the user
    /// </param>
    /// <param name="constants">Application constants.</param>
    /// <doc>connectedLearning.factory:methods</doc>

    'use strict';

    return {
        isEmptyOrNull: function (obj) {
            /// <summary>
            /// Retrieve true when object is empty, undefined or null.
            /// </summary>
            /// <param name="obj">Object to be checked</param>
            /// <returns type="boolean">True when object is empty, undefined or null.</returns>
            /// <doc>connectedLearning.factory:methods#isEmptyOrNull</doc>

            return (
                (obj === undefined) ||
                (obj === null) ||
                (angular.isString(obj) && (obj === '')) ||      // String
                (angular.isArray(obj) && (obj.length === 0))    // Arrays
                );
        },
        parse: function () {
            /// <summary>
            /// Format string using string.format way to match parameters.
            /// </summary>
            /// <returns type="string">String parsed.</returns>
            /// <doc>connectedLearning.factory:methods#parse</doc>

            var args = arguments,
                url = '',
                baseUrl = '',
                qs = '',
                qsFormatted = '',
                splitted,
                vars = [],
                hash, i;

            if (args === null || args.length === 0) {
                return "";
            }

            if (args.length === 1) {
                url = args[0];
            }
            else {
                url = args[0].replace(/\{(\d+)\}/g, function (match, number) {
                    return args[parseInt(number, 10) + 1] !== undefined ? args[parseInt(number, 10) + 1] : '';
                });
            }

            baseUrl = url;

            return baseUrl + qsFormatted;
        },
        urlFormat: function () {
            /// <summary>
            /// Format url using string.format way to match parameters.
            /// </summary>
            /// <returns type="string">String parsed.</returns>
            /// <doc>connectedLearning.factory:methods#urlFormat</doc>

            var args = arguments,
                url = '',
                baseUrl = '',
                qs = '',
                qsFormatted = '',
                splitted,
                vars = [],
                hash, i;

            if (args === null || args.length === 0) {
                return "";
            }

            if (args.length === 1) {
                url = args[0];
            }
            else {
                url = args[0].replace(/\{(\d+)\}/g, function (match, number) {
                    return args[parseInt(number, 10) + 1] !== undefined ? encodeURIComponent(args[parseInt(number, 10) + 1]) : '';
                });
            }

            // Remove empty qs parameters
            if (url.indexOf('?') >= 0) {
                splitted = url.split('?');
                baseUrl = splitted[0];

                if (splitted.length > 1) {
                    qs = splitted[1].split('&');
                    for (i = 0; i < qs.length; i++) {
                        if (qs[i].indexOf('=') >= 0) {
                            hash = qs[i].split('=');
                            vars.push({ code: hash[0], value: hash[1] });
                        }
                        else {
                            vars.push({ code: qs[i], value: '' });
                        }
                    }

                    // Fill qsFormatted using vars and removing empty values
                    for (i = 0; i < vars.length; i++) {
                        //if (vars[i].value && vars[i].value !== '') {
                            qsFormatted = qsFormatted + ((qsFormatted === '') ? '?' : '&') + vars[i].code + '=' + vars[i].value;
                        //}
                    }

                }
            }
            else {
                baseUrl = url;
            }

            return baseUrl + qsFormatted;
        },
        cleanArray: function (array) {
            /// <summary>
            /// Method that removes empty entries in an array.
            /// </summary>
            /// <param name="array">array to manage.</param>
            /// <doc>connectedLearning.factory:methods#cleanArray</doc>

            var newArray = [], i;
            for (i = 0; i < array.length; i++) {
                if (array[i]) {
                    newArray.push(array[i]);
                }
            }
            return newArray;
        },
        covertNumberToExpectedDecimal: function (numberToEvaluate) {
            var testNumber = 3500,
                resultNumber,
                isUSFormat = (testNumber.toLocaleString().indexOf(",") < testNumber.toLocaleString().indexOf(".")),
                usPattern = new RegExp("^([+-]|)?[0-9]{1,15}([,][0-9]{3})?([.][0-9]{1,9})?$");

            if (!isUSFormat && !(usPattern.test(numberToEvaluate.toString()))) {
                resultNumber = parseFloat(numberToEvaluate.toString().replace(".", "").replace(",", "."));
            } else {
                resultNumber = numberToEvaluate;
            }

            return resultNumber;
        },
        getTokenValue: function (token, tokenId) {
            /// <summary>
            /// Method that value for specific token.
            /// </summary>
            /// <param name="token">token information for user.</param>
            /// <param name="tokenId">Token code to be searched.</param>
            /// <returns type="string">Token value.</returns>
            /// <doc>connectedLearning.factory:methods#getTokenValue</doc>

            var result = '',
                self = this;

            if (!this.isEmptyOrNull(token) && !this.isEmptyOrNull(token.value)) {
                angular.forEach(token.value, function (item) {
                    if (!self.isEmptyOrNull(item.Name) && (item.Name.indexOf(tokenId) >= 0)) {
                        result = item.Value;
                    }
                });
            }
            return result;
        },
        getPriorityField: function (fields, fieldName) {
            /// <summary>
            /// Method that retrieves the requested field value in an array of fields (name/value).
            /// </summary>
            /// <param name="fieldName">Requested FieldName.</param>
            /// <param name="fields">Fields array</param>
            /// <returns type="string">Field value if founded.</returns>
            /// <doc>myPerformance.factory:methods#getExpenseField</doc>

            var result = '', c;

            if ((fields !== null) && (fields !== undefined) && (fields.length > 0)) {
                for (c = 0; c < fields.length; c++) {
                    if (fields[c].Name.indexOf(fieldName) >= 0) {
                        result = fields[c].Value;
                        break;
                    }
                }
            }

            return result;
        },
        inActionPlan: function (actionPlanList, itemId) {
            /// <summary>
            /// Check if the item is in the action plan
            /// </summary>

            if (actionPlanList !== null && actionPlanList !== undefined) {

                var i = 0;
                for (i = 0; i < actionPlanList.length; i++) {
                    if (itemId === actionPlanList[i].ObjectId) {
                        return true;
                    }
                }
            }

            return false;
        },
        formatDate: function (dateString, isShort) {
            /// <summary>
            /// Format the date from a string
            /// </summary>

            var finalDate = "";

            if (dateString !== null && dateString !== '' && dateString !== undefined) {

                //#region process month
                var monthName = "";
                switch (dateString.substring(5, 7)) {
                    case '01':
                        if (isShort) {
                            monthName = "Jan";
                        }
                        else {
                            monthName = "January";
                        }
                        break;
                    case '02':
                        if (isShort) {
                            monthName = "Feb";
                        }
                        else {
                            monthName = "February";
                        }
                        break;
                    case '03':
                        if (isShort) {
                            monthName = "Mar";
                        }
                        else {
                            monthName = "March";
                        }
                        break;
                    case '04':
                        if (isShort) {
                            monthName = "Apr";
                        }
                        else {
                            monthName = "April";
                        }
                        break;
                    case '05':
                        if (isShort) {
                            monthName = "May";
                        }
                        else {
                            monthName = "May";
                        }
                        break;
                    case '06':
                        if (isShort) {
                            monthName = "Jun";
                        }
                        else {
                            monthName = "June";
                        }
                        break;
                    case '07':
                        if (isShort) {
                            monthName = "Jul";
                        }
                        else {
                            monthName = "July";
                        }
                        break;
                    case '08':
                        if (isShort) {
                            monthName = "Aug";
                        }
                        else {
                            monthName = "August";
                        }
                        break;
                    case '09':
                        if (isShort) {
                            monthName = "Sep";
                        }
                        else {
                            monthName = "September";
                        }
                        break;
                    case '10':
                        if (isShort) {
                            monthName = "Oct";
                        }
                        else {
                            monthName = "October";
                        }
                        break;
                    case '11':
                        if (isShort) {
                            monthName = "Nov";
                        }
                        else {
                            monthName = "November";
                        }
                        break;
                    case '12':
                        if (isShort) {
                            monthName = "Dec";
                        }
                        else {
                            monthName = "December";
                        }
                        break;
                }

                //#endregion

                var year = "";

                if (isShort) {
                    year = dateString.substring(2, 4);
                }
                else {
                    year = dateString.substring(0, 4);
                }

                finalDate += dateString.substring(8, 10) + ' ' + monthName + ' ' + year;
            }

            return finalDate;

        },
        sortByDate: function (a, b) {
            var aName = a.TargetDate;
            var bName = b.TargetDate;

            // if both actions are completed, sort by completion date
            if (a.StatusCodeNbr === constants.actionPlan.status.completed && b.StatusCodeNbr === constants.actionPlan.status.completed) {
                return ((a.CompletionDate < b.CompletionDate) ? -1 : ((a.CompletionDate > b.CompletionDate) ? 1 : 0));
            } // if only one of the actions is completed, completed action goes last
            else if ((a.StatusCodeNbr === constants.actionPlan.status.completed || b.StatusCodeNbr === constants.actionPlan.status.completed) &&
                (a.StatusCodeNbr !== constants.actionPlan.status.completed || b.StatusCodeNbr !== constants.actionPlan.status.completed)) {
                if (a.StatusCodeNbr === constants.actionPlan.status.completed) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            else {
                if (aName !== '' && bName === '') {
                    return -1;
                }
                else if (aName === '' && bName !== '') {
                    return 1;
                }
                else {
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }
            }
        },
        //#region   Merge code from learning events
        whichNumberInputIsUsed: function () {
            var model = navigator.userAgent;
            return (model.indexOf('Galaxy') > -1) ? 'tel' : 'number';
        },
        getStorage: function (id) {
            var model = localStorageService.get(id);
            return model;
        },
        setStorage: function (id, model) {
            localStorageService.set(id, model);
            return model;
        },
        getMonday:function(d){
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        },
        getSunday: function (d) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? 0:7); // adjust when day is sunday
            return new Date(d.setDate(diff));
        },
        getLastMonday:function(d){
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1) -7; // adjust when day is sunday
            return new Date(d.setDate(diff));
        },
        getLastSunday: function(d){
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? 0:7) - 7; // adjust when day is sunday
            return new Date(d.setDate(diff));
        },
        getNextMonday:function(d){
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1) +7; // adjust when day is sunday
            return new Date(d.setDate(diff));
        },
        getNextSunday:function(d){
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? 0:7) + 7; // adjust when day is sunday
            return new Date(d.setDate(diff));
        },
        getFirstDayOfMonth:function(d){
            return new Date(d.getFullYear(),d.getMonth(),1);
        },
        getLastDayOfMonth:function(d){
            return new Date(d.getFullYear(), d.getMonth()+1, 0);
        },
        isSunday:function(d){
            return d.getDay() == 0;
        },
        isMonday:function(d){
            return d.getDay() == 1;
        },
        isLastDayOfMonth:function(d){
            var lastday = new Date(d.getFullYear(), d.getMonth()+1, 0);
            return d.getDate() == lastday.getDate();
        },
        isFirstDayOfMonth:function(d){
            return d.getDate() == 1;
        }
        //##endregion
    };
}]);