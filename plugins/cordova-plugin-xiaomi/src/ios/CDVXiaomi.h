//
//  CDVXiaomi.h
//  cordova-plugin-xiaomi
//
//  Created by Jason.z on 12/12/16.
//
//

#import <Cordova/CDV.h>
#import "MiPassport/MiPassport.h"
#import "MiPassport/MPReqeust.h"
#import "MPConstants.h"


@interface CDVXiaomi:CDVPlugin <MPSessionDelegate,
    MPRequestDelegate>

@property (nonatomic, strong) NSString *currentCallbackId;
@property (nonatomic, strong) NSString *wechatAppId;

- (void)getAccessToken:(CDVInvokedUrlCommand *)command;
- (void)getProfile:(CDVInvokedUrlCommand *)command;

@end
