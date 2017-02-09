//  UMCheckUpdate.h
//  Copyright © 2015年 umeng. All rights reserved.

#import <Foundation/Foundation.h>

@interface UMCheckUpdate : NSObject
///---------------------------------------------------------------------------------------
/// @name  按渠道自动更新
///---------------------------------------------------------------------------------------

/** 按渠道检测更新
 检查当前app是否有更新，有则弹出UIAlertView提示用户,当用户点击升级按钮时app会跳转到您预先设置的网址。
 无更新不做任何操作。
 需要先在服务器端设置app版本信息，默认渠道是App Store.
 @param appkey 友盟统计 appkey.
 @param channel 渠道名称,当值为 nil 渠道是App Store.
 @return void.
 */
+ (void)checkUpdateWithAppkey:(NSString *)appkey channel:(NSString *)channel;

/** 按渠道检测更新
 检查当前app是否有更新，有则弹出UIAlertView提示用户,当用户点击升级按钮时app会跳转到您预先设置的网址。
 无更新不做任何操作。
 需要先在服务器端设置app版本信息，默认渠道是App Store.

 @param title 对应UIAlertView的title.
 @param cancelTitle 对应UIAlertView的cancelTitle.
 @param otherTitle 对应UIAlertView的otherTitle.
 @param appkey 友盟统计 appkey.
 @param channel 渠道名称,当值为 nil 渠道是App Store.
 @return void.
 */
+ (void)checkUpdate:(NSString *)title cancelButtonTitle:(NSString *)cancelTitle otherButtonTitles:(NSString *)otherTitle appkey:(NSString *)appkey channel:(NSString *)channel;

/** 设置自由控制更新callback函数
 若程序需要自由控制收到更新内容后的流程可设置delegate和callback函数来完成

 @param delegate 需要自定义checkUpdate的对象.
 @param callBackSelectorWithDictionary 当checkUpdate事件完成时此方法会被调用,同时标记app更新信息的字典被传回.
 @param appkey 友盟统计 appkey.
 @param channel 渠道名称,当值为 nil 渠道是App Store.
 */
+ (void)checkUpdateWithDelegate:(id)delegate selector:(SEL)callBackSelectorWithDictionary appkey:(NSString *)appkey channel:
        (NSString *)channel;


/** 设置是否打印sdk的log信息, 默认NO(不打印log).
 @param value 设置为YES,umeng SDK 会输出log信息可供调试参考. 除非特殊需要，否则发布产品时需改回NO.
 @return void.
 */
+ (void)setLogEnabled:(BOOL)value;

@end
