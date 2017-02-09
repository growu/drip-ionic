var exec = require('cordova/exec');

module.exports = {

    /**
     * Sending an auth request to Xiaomi
     *
     * @example
     * <code>
     * Xiaomi.getAccessToken(function (response) { alert(response.code); });
     * </code>
     */
    getAccessToken: function (onSuccess, onError) {
        return exec(onSuccess, onError, "Xiaomi", "getAccessToken", []);
    },
    getOpenId: function (onSuccess, onError) {
        return exec(onSuccess, onError, "Xiaomi", "getOpenId", []);
    },
    getProfile: function (onSuccess, onError) {
        return exec(onSuccess, onError, "Xiaomi", "getProfile", []);
    },
};

