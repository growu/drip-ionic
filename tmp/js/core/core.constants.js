angular.module('kd.core', [])

// 定义环境
.constant('ENV',{
	"debug":true,// 测试模式
	"version":"0.3.0",// 版本
	// "apiUrl":"http://192.168.2.14/kd/public/api/",
	// "resUrl":"http://192.168.2.14/kd/public/uploads/",
	'homeUrl':"http://drip.growu.me",
	'downUrl':"http://drip.growu.me/update",
	"apiUrl":"http://drip.growu.me/api/",
	"resUrl":"http://drip.growu.me/uploads/",
});
