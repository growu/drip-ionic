
由于此项目已经采用ionic v3版本重新编写，该项目已经停止代码维护，仅供参考学习。新项目[地址](https://github.com/growu/drip-ionic3)

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

## 1、安装

```bash
npm install
```

```bash
bower install
```

## 2、编译

```bash
gulp build -p
```

## 3、运行

```bash
ionic serve
```

```bash
ionic build android
```

```bash
ionic build ios --device
```

# 关于项目

「水滴打卡」是一款基于目标管理和习惯养成的打卡工具.

 ![扫码下载](http://drip.growu.me/img/qrcode.png)

 或者在苹果商店，应用宝，360，豌豆荚，小米商店搜索**水滴打卡**即可。


# 关注我们：

微信群：请添加格吾君微信（微信号：growu001）,发送暗号"水滴打卡"即可。

官网：[http://drip.growu.me](http://drip.growu.me)

微信公众号:格吾社区(微信号：growuu)

新浪微博：[http://weibo.com/growu/](http://weibo.com/growu)

# 问题反馈

IONIC技术交流群：783459080

# License

本项目源代码遵循GPL授权许可，请勿用于商业用途。
