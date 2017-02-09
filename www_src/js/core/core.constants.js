angular.module('kd.core', [])

// 定义环境
.constant('ENV',{
	"debug":true,// 测试模式
	"version":"0.3.0",// 版本
	// "apiUrl":"http://192.168.2.14/kd/public/api/",
	// "resUrl":"http://192.168.2.14/kd/public/uploads/",
	'homeUrl':"https://www.keepdays.com",
	'downUrl':"https://www.keepdays.com/update",
	"apiUrl":"https://www.keepdays.com/api/",
	"resUrl":"https://www.keepdays.com/uploads/",
});
