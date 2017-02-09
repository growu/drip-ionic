//
//  CDVXiaomi.m
//  cordova-plugin-xiaomi
//
//  Created by Jason.z on 12/12/16.
//
//

#import "CDVXiaomi.h"

static int const MAX_THUMBNAIL_SIZE = 320;

@implementation CDVXiaomi {
    MiPassport *_passport;
}

#pragma mark "API"
- (void)pluginInitialize {
    NSString* appId = [[self.commandDelegate settings] objectForKey:@"xiaomi_appid"];
    NSString* redirectUrl = [[self.commandDelegate settings] objectForKey:@"xiaomi_redirecturl"];

    if (appId){
        _passport = [[MiPassport alloc] initWithAppId:appId redirectUrl:redirectUrl andDelegate:self];
    }
    
    NSLog(@"cordova-plugin-xiaomi has been initialized.");
}

- (void)getAccessToken:(CDVInvokedUrlCommand *)command
{
    currentCallbackId = command.callbackId;

    [_passport loginWithPermissions:nil];

}
    
- (void)getProfile:(CDVInvokedUrlCommand *)command
    currentCallbackId = command.callbackId;
    [_passport requestWithURL:@"user/profile" params:[NSMutableDictionary dictionaryWithObject:_passport.appId forKey:@"clientId"] httpMethod:@"GET" delegate:self];
}
    
    
#pragma mark - MPSessionDelegate
    // 登录成功
- (void)passportDidLogin:(MiPassport *)passport{
    
     NSLog(@"passport login succeeded, token:%@, token type:%@, expiration date:%@, encrypt algorithm:%@, encrypt key:%@", passport.accessToken, passport.tokenType, passport.expirationDate, passport.encryptAlgorithm, passport.encryptKey);
    
    NSDictionary *response = @{
                 @"access_token":  passport.accessToken != nil ?  passport.accessToken : @"",
                 @"openid": passport.state != nil ? passport.state : @"",
                 @"expire_in": passport.lang != nil ? passport.lang : @"",
                 };

    
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:response];
    
    [self.commandDelegate sendPluginResult:commandResult callbackId:self.currentCallbackId];
    

    
}
    
    //登录失败
- (void)passport:(MiPassport *)passport failedWithError:(NSError *)error{
    NSDictionary *errorInfo = [error userInfo];
    
    NSLog(@"passport login failed with error: %d info %@", [error code], [errorInfo objectForKey: @"error_description"]);
    
    [self failWithCallbackID:self.currentCallbackId withMessage:[errorInfo objectForKey: @"error_description"]];

  
}
    
    // 用户取消登录
- (void)passportDidCancel:(MiPassport *)passport{
    NSLog(@"passport login did cancel");
    [self failWithCallbackID:self.currentCallbackId withMessage:@"用户取消"];
}
    
    
    
#pragma mark - MPRequestDelegate
    // 请求向服务器发送
- (void)requestLoading:(MPRequest *)request{
    NSLog(@"request start loading");
//    indicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:
//                     UIActivityIndicatorViewStyleGray];
//    indicatorView.autoresizingMask =
//    UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin
//    | UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin;
//    [self.view addSubview:indicatorView];
//    [indicatorView sizeToFit];
//    [indicatorView startAnimating];
//    indicatorView.center = self.view.center;
}
    
    // 请求收到服务器回复，开始接受数据
- (void)request:(MPRequest *)request didReceiveResponse:(NSURLResponse *)response{
    NSLog(@"request did receive response");
//    [indicatorView stopAnimating];
//    indicatorView = nil;
}
    
    // 请求失败， error包含错误信息
- (void)request:(MPRequest *)request didFailWithError:(NSError *)error{
    NSLog(@"request did fail with error code: %d", [error code]);
    [self failWithCallbackID:self.currentCallbackId withError:error];
}
    
    // 请求成功，result为处理后的请求结果
- (void)request:(MPRequest *)request didLoad:(id)result{
    NSLog(@"request did load: %@", result);
    NSString *str = @"";
    
    if ( [result isKindOfClass:[NSString class]] ) {
        str = result;
    }
    [self successWithCallbackID:self.currentCallbackId withMessage:str];

}
    
    // 请求成功，data为未经处理的服务器返回数据
- (void)request:(MPRequest *)request didLoadRawResponse:(NSData *)data{
    NSLog(@"request did load raw response: %@", data);
    NSString *result = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

    [self successWithCallbackID:self.currentCallbackId withMessage:result];

}


- (void)successWithCallbackID:(NSString *)callbackID
{
    [self successWithCallbackID:callbackID withMessage:@"OK"];
}

- (void)successWithCallbackID:(NSString *)callbackID withMessage:(NSString *)message
{
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
    [self.commandDelegate sendPluginResult:commandResult callbackId:callbackID];
}

- (void)failWithCallbackID:(NSString *)callbackID withError:(NSError *)error
{
    [self failWithCallbackID:callbackID withMessage:[error localizedDescription]];
}

- (void)failWithCallbackID:(NSString *)callbackID withMessage:(NSString *)message
{
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:message];
    [self.commandDelegate sendPluginResult:commandResult callbackId:callbackID];
}

@end
