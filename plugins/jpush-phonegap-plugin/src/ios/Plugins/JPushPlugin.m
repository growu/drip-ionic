//
//  PushTalkPlugin.m
//  PushTalk
//
//  Created by zhangqinghe on 13-12-13.
//
//

#import "JPushPlugin.h"
#import "JPUSHService.h"
#import <UIKit/UIKit.h>
#import <AdSupport/AdSupport.h>
#import <UserNotifications/UserNotifications.h>
#import "AppDelegate+JPush.h"

static NSString *const JP_APP_KEY = @"APP_KEY";
static NSString *const JP_APP_CHANNEL = @"CHANNEL";
static NSString *const JP_APP_ISPRODUCTION = @"IsProduction";
static NSString *const JP_APP_ISIDFA = @"IsIDFA";
static NSString *const JPushConfigFileName = @"PushConfig";
static NSDictionary *_launchOptions = nil;

#define WEAK_SELF(weakSelf)  __weak __typeof(&*self)weakSelf = self;

@implementation NSDictionary (JPush)
-(NSString*)toJsonString{
    NSError  *error;
    NSData   *data       = [NSJSONSerialization dataWithJSONObject:self options:0 error:&error];
    NSString *jsonString = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
    return jsonString;
}
@end

@implementation NSString (JPush)
-(NSDictionary*)toDictionary{
    NSError      *error;
    NSData       *jsonData = [self dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict     = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    return dict;
}
@end

@interface JPushPlugin()

@end

@implementation JPushPlugin

#pragma mark- 外部接口
-(void)stopPush:(CDVInvokedUrlCommand*)command{
    [[UIApplication sharedApplication]unregisterForRemoteNotifications];
}

-(void)resumePush:(CDVInvokedUrlCommand*)command{
    [JPushPlugin registerForRemoteNotification];
}

-(void)isPushStopped:(CDVInvokedUrlCommand*)command{
    NSNumber *result;
    if ([[UIApplication sharedApplication] isRegisteredForRemoteNotifications]) {
        result = @(0);
    }else{
        result = @(1);
    }
    [self handleResultWithValue:result command:command];
}

-(void)initial:(CDVInvokedUrlCommand*)command{
    //do nithng,because Cordova plugin use lazy load mode.
}


#ifdef __CORDOVA_4_0_0

- (void)pluginInitialize {
    NSLog(@"### pluginInitialize ");
    [self initNotifications];
}

#else

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView{
    NSLog(@"### initWithWebView ");
    if (self=[super initWithWebView:theWebView]) {
        [self initNotifications];
    }
    return self;
}


#endif

-(void)initNotifications {
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveMessage:)
                          name:kJPFNetworkDidReceiveMessageNotification
                        object:nil];

    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveNotification:)
                          name:kJPushPluginReceiveNotification
                        object:nil];

    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveNotification:)
                          name:kJPushPluginiOS10ForegroundReceiveNotification
                        object:nil];

    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveNotification:)
                          name:kJPushPluginiOS10ClickNotification
                        object:nil];


    if (_launchOptions) {
        NSDictionary *userInfo = [_launchOptions valueForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
        if ([userInfo count] >0) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.openNotification',%@)",[userInfo toJsonString]]];
            });
        }

    }
}

-(void)setTagsWithAlias:(CDVInvokedUrlCommand*)command{
    NSArray  *arguments = command.arguments;
    NSString *alias;
    NSArray  *tags;
    if (!arguments || [arguments count] < 2) {
        NSLog(@"#### setTagsWithAlias param is less");
        return ;
    }else{
        alias = arguments[0];
        tags  = arguments[1];
    }

    NSLog(@"#### setTagsWithAlias alias is %@, tags is %@",alias,tags);

    [JPUSHService setTags:[NSSet setWithArray:tags]
                    alias:alias
         callbackSelector:@selector(tagsWithAliasCallback:tags:alias:)
                   object:self];
}

-(void)setTags:(CDVInvokedUrlCommand *)command{

    NSArray *tags = command.arguments;

    NSLog(@"#### setTags %@",tags);

    [JPUSHService setTags:[NSSet setWithArray:tags]
         callbackSelector:@selector(tagsWithAliasCallback:tags:alias:)
                   object:self];

}

-(void)setAlias:(CDVInvokedUrlCommand *)command{

    NSLog(@"#### setAlias %@",command.arguments);
    [JPUSHService setAlias:command.arguments[0]
          callbackSelector:@selector(tagsWithAliasCallback:tags:alias:)
                    object:self];
}

-(void)getRegistrationID:(CDVInvokedUrlCommand*)command{
    NSString* registrationID = [JPUSHService registrationID];
    NSLog(@"### getRegistrationID %@",registrationID);
    [self handleResultWithValue:registrationID command:command];
}

-(void)startLogPageView:(CDVInvokedUrlCommand*)command{
    NSArray *arguments = command.arguments;
    if (!arguments || [arguments count] < 1) {
        NSLog(@"startLogPageView argument  error");
        return ;
    }
    NSString * pageName = arguments[0];
    if (pageName) {
        [JPUSHService startLogPageView:pageName];
    }
}

-(void)stopLogPageView:(CDVInvokedUrlCommand*)command{
    NSArray *arguments = command.arguments;
    if (!arguments || [arguments count] < 1) {
        NSLog(@"stopLogPageView argument  error");
        return ;
    }
    NSString * pageName = arguments[0];
    if (pageName) {
        [JPUSHService stopLogPageView:pageName];
    }

}

-(void)beginLogPageView:(CDVInvokedUrlCommand*)command{
    NSArray *arguments = command.arguments;
    if (!arguments || [arguments count] < 2) {
        NSLog(@"beginLogPageView argument  error");
        return ;
    }
    NSString * pageName = arguments[0];
    int duration = [arguments[0] intValue];
    if (pageName) {
        [JPUSHService beginLogPageView:pageName duration:duration];
    }
}

-(void)setBadge:(CDVInvokedUrlCommand*)command{
    NSArray *argument = command.arguments;
    if ([argument count] < 1) {
        NSLog(@"setBadge argument error!");
        return;
    }
    NSNumber *badge = argument[0];
    [JPUSHService setBadge:[badge intValue]];
}

-(void)resetBadge:(CDVInvokedUrlCommand*)command{
    [JPUSHService resetBadge];
}

-(void)setApplicationIconBadgeNumber:(CDVInvokedUrlCommand *)command{
    //
    NSArray *argument = command.arguments;
    if ([argument count] < 1) {
        NSLog(@"setBadge argument error!");
        return;
    }
    NSNumber *badge = [argument objectAtIndex:0];
    [UIApplication sharedApplication].applicationIconBadgeNumber = [badge intValue];
}

-(void)getApplicationIconBadgeNumber:(CDVInvokedUrlCommand *)command {
    NSInteger num = [UIApplication sharedApplication].applicationIconBadgeNumber;
    NSNumber *number = [NSNumber numberWithInteger:num];
    [self handleResultWithValue:number command:command];
}

-(void)setDebugModeFromIos:(CDVInvokedUrlCommand*)command{
    [JPUSHService setDebugMode];
}

-(void)setLogOFF:(CDVInvokedUrlCommand*)command{
    [JPUSHService setLogOFF];
}

-(void)crashLogON:(CDVInvokedUrlCommand*)command{
    [JPUSHService crashLogON];
}

-(void)setLocalNotification:(CDVInvokedUrlCommand*)command{
    NSArray      *arguments = command.arguments;
    NSDate       *date      = arguments[0] == [NSNull null] ? nil : [NSDate dateWithTimeIntervalSinceNow:[((NSString*)arguments[0]) intValue]];
    NSString     *alertBody = arguments[1] == [NSNull null] ? nil : (NSString*)arguments[1];
    int           badge     = arguments[2] == [NSNull null] ? 0   : [(NSString*)arguments[2] intValue];
    NSString     *idKey     = arguments[3] == [NSNull null] ? nil : (NSString*)arguments[3];
    NSDictionary *dict      = arguments[4] == [NSNull null] ? nil : (NSDictionary*)arguments[4];
    [JPUSHService setLocalNotification:date alertBody:alertBody badge:badge alertAction:nil identifierKey:idKey userInfo:dict soundName:nil];
}

-(void)deleteLocalNotificationWithIdentifierKey:(CDVInvokedUrlCommand*)command{
    NSString *identifier = [command argumentAtIndex:0];
    if ([UIDevice currentDevice].systemVersion.floatValue >= 10.0) {
        JPushNotificationIdentifier *jpid = [JPushNotificationIdentifier new];
        jpid.identifiers = @[identifier];
        [JPUSHService removeNotification:jpid];
    }else{
        [JPUSHService deleteLocalNotificationWithIdentifierKey:identifier];
    }
}

-(void)clearAllLocalNotifications:(CDVInvokedUrlCommand*)command{
    [JPUSHService clearAllLocalNotifications];
}

-(void)setLocation:(CDVInvokedUrlCommand*)command{
    [JPUSHService setLatitude:[((NSString*)command.arguments[0]) doubleValue] longitude:[((NSString*)command.arguments[1]) doubleValue]];
}

-(void)getUserNotificationSettings:(CDVInvokedUrlCommand*)command{
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        WEAK_SELF(weakSelf);
        [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
            NSMutableDictionary *dict = [NSMutableDictionary dictionary];
            dict[@"authorizationStatus"]       = @(settings.authorizationStatus);
            dict[@"soundSetting"]              = @(settings.soundSetting);
            dict[@"badgeSetting"]              = @(settings.badgeSetting);
            dict[@"alertSetting"]              = @(settings.alertSetting);
            dict[@"notificationCenterSetting"] = @(settings.notificationCenterSetting);
            dict[@"lockScreenSetting"]         = @(settings.lockScreenSetting);
            dict[@"carPlaySetting"]            = @(settings.carPlaySetting);
            dict[@"alertStyle"]                = @(settings.alertStyle);
            [weakSelf handleResultWithValue:dict command:command];
        }];
    }else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
        UIUserNotificationSettings *settings = [[UIApplication sharedApplication] currentUserNotificationSettings];
        UIUserNotificationType type = settings.types;
        NSNumber *number = [NSNumber numberWithInteger:type];
        [self handleResultWithValue:number command:command];
    }else{
        UIRemoteNotificationType type = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
        NSNumber *number = [NSNumber numberWithInteger:type];
        [self handleResultWithValue:number command:command];
    }
}

#pragma mark - 内部方法
+(void)setLaunchOptions:(NSDictionary *)theLaunchOptions{
    _launchOptions = theLaunchOptions;

    [JPUSHService setDebugMode];

    [JPushPlugin registerForRemoteNotification];

    //read appkey and channel from PushConfig.plist
    NSString *plistPath = [[NSBundle mainBundle] pathForResource:JPushConfigFileName ofType:@"plist"];
    if (plistPath == nil) {
        NSLog(@"error: PushConfig.plist not found");
        assert(0);
    }

    NSMutableDictionary *plistData = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    NSString * appkey       = [plistData valueForKey:JP_APP_KEY];
    NSString * channel      = [plistData valueForKey:JP_APP_CHANNEL];
    NSNumber * isProduction = [plistData valueForKey:JP_APP_ISPRODUCTION];
    NSNumber *isIDFA        = [plistData valueForKey:JP_APP_ISIDFA];

    NSString *advertisingId = nil;
    if(isIDFA){
        advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    }
    [JPUSHService setupWithOption:_launchOptions
                           appKey:appkey
                          channel:channel
                 apsForProduction:[isProduction boolValue]
            advertisingIdentifier:advertisingId];

}

+(void)registerForRemoteNotification{
    [(AppDelegate*)[UIApplication sharedApplication].delegate registerForIos10RemoteNotification];

    if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
        //可以添加自定义categories
        [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                          UIUserNotificationTypeSound |
                                                          UIUserNotificationTypeAlert)
                                              categories:nil];
    } else if([[UIDevice currentDevice].systemVersion floatValue] < 8.0){
        //categories 必须为nil
        [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                          UIRemoteNotificationTypeSound |
                                                          UIRemoteNotificationTypeAlert)
                                              categories:nil];
    }
}

#pragma mark 将参数返回给js
-(void)handleResultWithValue:(id)value command:(CDVInvokedUrlCommand*)command{
    CDVPluginResult *result = nil;
    CDVCommandStatus status = CDVCommandStatus_OK;

    if ([value isKindOfClass:[NSString class]]) {
        value = [value stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    } else if ([value isKindOfClass:[NSNull class]]) {
        value = nil;
    }

    if ([value isKindOfClass:[NSObject class]]) {
        result = [CDVPluginResult resultWithStatus:status messageAsString:value];//NSObject 类型都可以
    } else {
        NSLog(@"Cordova callback block returned unrecognized type: %@", NSStringFromClass([value class]));
        result = nil;
    }

    if (!result) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark 设置标签及别名回调
-(void)tagsWithAliasCallback:(int)resultCode tags:(NSSet *)tags alias:(NSString *)alias{
    NSDictionary *dict = @{@"resultCode":[NSNumber numberWithInt:resultCode],
                           @"tags"      :tags  == nil ? [NSNull null] : [tags allObjects],
                           @"alias"     :alias == nil ? [NSNull null] : alias
                           };
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.setTagsWithAlias',%@)",[dict toJsonString]]];
    });
}

- (void)networkDidReceiveMessage:(NSNotification *)notification {
    if (notification) {
        dispatch_async(dispatch_get_main_queue(), ^{

            [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.receiveMessage',%@)",[notification.userInfo toJsonString]]];

            [self.commandDelegate evalJs:[NSString stringWithFormat:@"window.plugins.jPushPlugin.receiveMessageIniOSCallback('%@')",[notification.userInfo toJsonString]]];

        });
    }
}

-(void)networkDidReceiveNotification:(NSNotification *)notification{

    NSError  *error;
    NSDictionary *userInfo = [notification object];

    NSData   *jsonData   = [NSJSONSerialization dataWithJSONObject:userInfo options:0 error:&error];
    NSString *jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];

    switch ([UIApplication sharedApplication].applicationState) {
        case UIApplicationStateActive:{
            //前台收到
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.receiveNotification',%@)",jsonString]];
            });
            break;
        }
        case UIApplicationStateInactive:{
            //后台点击
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.openNotification',%@)",jsonString]];
            });
            break;
        }
        case UIApplicationStateBackground:{
            //后台收到
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.backgoundNotification',%@)",jsonString]];
            });
            break;
        }
        default:
            //do nothing
            break;
    }
    
}

@end
