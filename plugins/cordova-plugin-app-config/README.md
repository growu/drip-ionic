# cordova-plugin-app-config

It reads Info.plist or AndroidManifest.xml.

## Examples

iOS:

```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
    <dict>
      ...
      <key>MyApiKey</key>
      <string>ef8b97cce42d</string>
      <key>FacebookAppID</key>
      <string>4157893254</string>
    </dict>
  </plist>
```

Android:

```xml
<?xml version='1.0' encoding='utf-8'?>
<manifest ...>
  ...
  <application ...>
      <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="\ 4157893254" />
      <meta-data android:name="MyApiKey" android:value="ef8b97cce42d" />
  </application>
</manifest>
```

Note: escaped space is used in "com.facebook.sdk.ApplicationId" to force value to string type.

## Usage

iOS:

```js
  cordova.plugins.AppConfig.fetch(['MyApiKey', 'FacebookAppID'], function(result) {
    console.log(result); // => { "MyApiKey": "ef8b97cce42d", "FacebookAppID": "4157893254" }
  });
```

Android:

```js
  cordova.plugins.AppConfig.fetch(['MyApiKey', 'com.facebook.sdk.ApplicationId'], function(result) {
    console.log(result); // => { "MyApiKey": "ef8b97cce42d", "com.facebook.sdk.ApplicationId": "4157893254" }
  });
```

You can specify any fields you want. Only specified fields will be returned.

## Publishing new version

1. Update package.json
2. Update plugin.xml
3. `npm publish .`
