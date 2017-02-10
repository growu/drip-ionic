
# 项目说明

微打卡Android,IOS的客户端ionic源码

# 功能说明

* 代码风格参考 [angular-style-guide](https://github.com/johnpapa/angular-styleguide)
* 底层基于[ionic](http://ionicframework.com/)+[angula](https://github.com/angular/angular)+[cordova](http://cordova.apache.org/)(phonegap)创建
* 本地存储采用*localStorage*
* API接口采用jwt认证方式
* 支持代码热更
* 集成极光推送

# 插件列表

- com.qiudao.cordova.umeng-analytics（友盟统计）
- cordova-plugin-app-config（读取配置文件）
- cordova-plugin-console （控制台输出）
- cordova-plugin-crop （图片裁剪）
- cordova-plugin-device （设备信息）
- cordova-plugin-file (文件管理)
- cordova-plugin-file-transfer (文件传输)
- cordova-plugin-inappbrowser (打开链接)
- cordova-plugin-qqsdk (qq sdk)
- cordova-plugin-splashscreen (splashscreen)
- cordova-plugin-wechat (微信sdk)
- cordova-plugin-weibo （微博sdk）
- cordova-plugin-x-socialsharing （社交化分享）
- cordova-plugin-xiaomi（小米登录sdk）
- ionic-plugin-keyboard (键盘)
- jpush-phonegap-plugin(极光推送)

# 使用说明

## step1:安装所需要的组件

`npm install`

`bower install`

## step2:编译www源码

`gulp build -p`

## step3:编译工程

`ionic build android`
`ionic build ios --device`

# TODO

0.4.0



# About

微打卡是一款基于目标管理和习惯养成的打卡工具，并充分融入了社交元素。

现已对用户开放使用：

**IOS**：[https://itunes.apple.com/us/app/wei-da-ka-zhuan-zhu-yu-mu/id1017364870?l=zh&ls=1&mt=8](https://itunes.apple.com/us/app/wei-da-ka-zhuan-zhu-yu-mu/id1017364870?l=zh&ls=1&mt=8)

**Android**: 在应用宝，360，豌豆荚，小米商店搜索**微打卡**即可。



> 代码和设计方面也存在很多的不足之处，我们也希望借助社区的力量，来不断地完善此款app。如果你对我们的项目感兴趣，也可以联系刚哥的微信号（foxmee）,来加入我们的线上开发团队中。



如果想了解更多方面，可以通过以下方式关注我们：

微信公众号:keepdays

新浪微博：[http://weibo.com/keepdays/](http://weibo.com/keepdays/)




# License


本项目源代码遵循GPL授权许可，你可以修改并免费使用，但请保留本项目作者信息。