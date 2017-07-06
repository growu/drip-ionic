/********* AppConfig.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface AppConfig : CDVPlugin {
  // Member variables go here.
}

- (void)fetch:(CDVInvokedUrlCommand*)command;
@end

@implementation AppConfig

- (void)fetch:(CDVInvokedUrlCommand *)command {
  NSDictionary *info = [[NSBundle mainBundle] infoDictionary];
  NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];

  for (NSString* key in command.arguments)
  {
    NSLog(@"%@", key);
    [resultDictionary setObject:[info objectForKey:key] forKey:key];
  }

  CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDictionary];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
