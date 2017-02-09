var exec = require('cordova/exec');

exports.fetch = function(fields, success, error) {
  exec(success, error, 'AppConfig', 'fetch', fields || [])
}
