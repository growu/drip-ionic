# Umeng Analytics Cordova Plugin

A Cordova plugin for Umeng Analytics (友盟统计) SDK.

## 1. 插件功能

1. 实现使用Cordova插件方式自动加入友盟统计功能；
2. 支持友盟的基本统计功能；
3. TODO

## 2. 插件使用

**安装插件**

    cordova plugin add https://github.com/baomingba/cordova-plugin-umeng-analytics.git --variable UMENG_IOS_ID="123456789012345678901234" --variable UMENG_ANDROID_ID="123456789012345678900987"
    
其中：

- `UMENG_IOS_ID`的值替换为友盟平台创建的iOS应用id，该值将保存在`Staging/config.xml`中；

- `UMENG_ANDROID_ID`的值替换为友盟平台创建的Android应用id，该值将保存在`res/values/umeng.xml`中。

**移除插件**

    cordova plugin remove com.qiudao.cordova.umeng-analytics

### iOS平台
      
安装插件即支持基本统计功能。

更多高级统计功能参考[Umeng iOS Doc](http://dev.umeng.com/analytics/ios-doc)，需要在应用代码中调用相关友盟接口。  
      
### Android平台

需要修改生成的Android Project部分代码来实现基本统计功能。在每个需要统计的Acitivity中加入：

        import com.umeng.analytics.MobclickAgent;

        @Override
        public void onResume() {
            super.onResume();
            MobclickAgent.onResume(this);
        }
        
        @Override
        public void onPause() {
            super.onPause();
            MobclickAgent.onPause(this);
        }

更多高级统计功能参考[Umeng Android Doc](http://dev.umeng.com/analytics/android-doc)，需要在应用代码中调用相关友盟接口。  

## 3. 友盟统计版本
目前插件包含的友盟统计版本为当前（2015-4-22）最新版，其中iOS版本为No-IDFA 3.4.7，Android版本为5.4.2。

如果需要更换版本，只要替换src/ios/libs和src/android/libs下的文件即可。
