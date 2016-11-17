//#region module definition
var harmonizr = null;

try {
    harmonizr = angular.module('harmonizr');
}
catch (e) {
    harmonizr = angular.module('harmonizr', []);
}
//#endregion

harmonizr.factory('harmonizr.methods', function () {
    return {
        isEmptyOrNull: function (obj) {
            /// <summary>
            /// Retrieve true when object is empty, undefined or null.
            /// </summary>
            /// <param name="obj">Object to be checked</param>
            /// <returns type="boolean">True when object is empty, undefined or null.</returns>

            return (
                (obj === undefined) ||
                (obj === null) ||
                (angular.isString(obj) && (obj === '')) ||      // String
                (angular.isArray(obj) && (obj.length === 0))    // Arrays
                );
        },
        chunk: function (arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        },
        parse: function () {
            /// <summary>
            /// Format string using string.format way to match parameters.
            /// </summary>
            /// <returns type="string">String parsed.</returns>

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
        tryParse: function (str) {
            var defaultValue = 0,
                result = defaultValue;
            if (!isNaN(str)) {
                result = parseInt(str);
            }
            return result;
        },
        inArray: function (property, array, value) {
            var result = -1;
            for (var c = 0; c < array.length; c++) {
                if (array[c][property] == value) {
                    result = c;
                    break;
                }
            }
            return result;
        }

    };
});