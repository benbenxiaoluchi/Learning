/**
 * Created by ory-lamballe.antoine on 03/06/2015.
 */

'use strict';

factories.factory('cache', function(localStorageService) {

    var PREFIX = 'aclmobile.';

    var ACCESS_TOKEN_NAME = 'accessToken';
    var AMEX_EXPENSES_NAME = 'AMEXExpenses';
    var EXPENSE_TYPES_NAME = 'expenseTypes';
    var EXPENSE_TYPES_IMPORTABLE_NAME = 'expenseTypesImportable';
    var EXPENSES_TO_IMPORT_NAME = 'expensesToImport';

    return {
        clearAll: clearAll,
        getAMEXExpenses: getAMEXExpenses,
        setAMEXExpenses: setAMEXExpenses,
        getAccessToken: getAccessToken,
        setAccessToken: setAccessToken,
        getExpenseTypes: getExpenseTypes,
        setExpenseTypes: setExpenseTypes,
        getExpenseTypesImportable: getExpenseTypesImportable,
        setExpenseTypesImportable: setExpenseTypesImportable,
        getExpensesToImport: getExpensesToImport,
        setExpensesToImport: setExpensesToImport,

        //
        getData: function (cid, defaultValue) {
            return get(cid) || defaultValue;
        },
        setData: set
    };


    // core cache functions

    function clearAll() {
        checkConfig();
        localStorageService.clearAll();
    }

    function getAMEXExpenses() {
        return get(AMEX_EXPENSES_NAME);
    }

    function setAMEXExpenses(AMEXExpenses) {
        set(AMEX_EXPENSES_NAME, AMEXExpenses);
    }

    function getAccessToken() {
        return get(ACCESS_TOKEN_NAME);
    }

    function setAccessToken(accessToken) {
        set(ACCESS_TOKEN_NAME, accessToken);
    }

    function getExpenseTypes() {
        return get(EXPENSE_TYPES_NAME);
    }

    function setExpenseTypes(expenseTypes) {
        set(EXPENSE_TYPES_NAME, expenseTypes);
    }

    function getExpenseTypesImportable() {
        return get(EXPENSE_TYPES_IMPORTABLE_NAME);
    }

    function setExpenseTypesImportable(expenseTypesImportable) {
        set(EXPENSE_TYPES_IMPORTABLE_NAME, expenseTypesImportable);
    }

    function getExpensesToImport() {
        return get(EXPENSES_TO_IMPORT_NAME);
    }

    function setExpensesToImport(expensesToImport) {
        set(EXPENSES_TO_IMPORT_NAME, expensesToImport);
    }

    // utility functions

    function get(key) {
        checkConfig();
        try {
            return localStorageService.get(key);
        } catch (e) {
            console.error("Could not get the AMEX expenses from cache:", e);
            return null;
        }
    }

    function set(key, value) {
        checkConfig();
        return localStorageService.set(key, value);
    }

    /**
     * Check and update the prefix at each call of the localStorage.
     * This is required to avoid bad prefix uses, because the ESO library is changing the whole app prefix
     * in the middle of its workflow instead of setting its own internal prefixes (add a prefix in key names).
     * This might result in weird behaviour: storing a value with a prefix, trying to retrieve it with another prefix.
     */
    function checkConfig() {
        if (typeof localStorageService.changePrefix === 'function') {
            localStorageService.changePrefix(PREFIX);
        }
    }
});

