
# 项目说明

本项目是「水滴打卡」App 基于Ionic编写的Android和Ios客户端代码

# 功能说明

* 代码风格参考 [angular-style-guide](https://github.com/johnpapa/angular-styleguide)
* 底层基于[ionic](http://ionicframework.com/)+[angula](https://github.com/angular/angular)+[cordova](http://cordova.apache.org/)(phonegap)创建
* 本地存储采用*localStorage*
* API接口采用jwt认证方式
* 支持代码热更
* 集成极光推送

# 插件列表

- [cordova-plugin-app-config 0.0.3](https://github.com/BlackFoks/cordova-plugin-app-config)（读取配置文件）
- [cordova-plugin-apprate 1.3.0](https://github.com/pushandplay/cordova-plugin-apprate) (商店评分)
- [cordova-plugin-console 1.0.7](https://github.com/apache/cordova-plugin-console/) （控制台输出）
- [cordova-plugin-crop 0.3.1](https://github.com/jeduan/cordova-plugin-crop) （图片裁剪）
- [cordova-plugin-device 1.1.6](https://github.com/apache/cordova-plugin-device) （设备信息）
- [cordova-plugin-file 4.3.3](https://github.com/apache/cordova-plugin-file) (文件管理)
- [cordova-plugin-file-transfer 1.6.3](https://github.com/apache/cordova-plugin-file-transfer) (文件传输)
- [cordova-plugin-inappbrowser 1.7.1](https://github.com/apache/cordova-plugin-inappbrowser) (打开链接)
- [cordova-plugin-qqsdk 0.9.6](https://github.com/iVanPan/Cordova_QQ) (QQ sdk)
- [cordova-plugin-splashscreen 4.0.3](https://github.com/apache/cordova-plugin-splashscreen) (splashscreen)
- [cordova-plugin-wechat 2.0.0](https://github.com/xu-li/cordova-plugin-wechat) (微信sdk)
- [cordova-plugin-weibo 1.6.0](https://github.com/BelinChung/cordova-plugin-weibo) （微博sdk）
- [cordova-plugin-whitelist 1.3.2](https://github.com/apache/cordova-plugin-whitelist) (白名单)
- [cordova-umeng-analytics 0.0.6](https://github.com/pipitang/cordova-umeng-analytics)（友盟统计）
- [ionic-plugin-keyboard](https://github.com/ionic-team/ionic-plugin-keyboard) (键盘)
- [jpush-phonegap-plugin 3.2.0](https://github.com/jpush/jpush-phonegap-plugin)(极光推送)

# 使用说明

## 1、安装所需要的组件

`npm install`

`bower install`

## 2、编译www源码

`gulp build -p`

## 3、编译工程

`ionic serve`
`ionic build android`
`ionic build ios --device`

# TODO

0.4.0


# 关于项目

「水滴打卡」是一款基于目标管理和习惯养成的打卡工具.

**IOS**：[https://itunes.apple.com/us/app/wei-da-ka-zhuan-zhu-yu-mu/id1017364870?l=zh&ls=1&mt=8](https://itunes.apple.com/us/app/wei-da-ka-zhuan-zhu-yu-mu/id1017364870?l=zh&ls=1&mt=8)

**Android**: 在应用宝，360，豌豆荚，小米商店搜索**水滴打卡**即可。


> 代码和设计方面也存在很多的不足之处，我们也希望借助社区的力量，来不断地完善此款app。如果你对我们的项目感兴趣，也可以联系格吾君的微信号（growu001）,加入我们的线上开发团队中。



# 关注我们：

微信公众号:格吾社区

新浪微博：[http://weibo.com/growu/](http://weibo.com/growu)




# License


本项目源代码遵循GPL授权许可，你可以修改并免费使用，但请保留本项目作者信息。