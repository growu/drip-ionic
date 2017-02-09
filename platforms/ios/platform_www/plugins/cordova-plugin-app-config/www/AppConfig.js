cordova.define("cordova-plugin-app-config.AppConfig", function(require, exports, module) {
var exec = require('cordova/exec');

exports.fetch = function(fields, success, error) {
  exec(success, error, 'AppConfig', 'fetch', fields || [])
}

});
