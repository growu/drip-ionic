/**
 * Created by Jason.z on 16/8/3.
 */
(function() {
    'use strict';

    angular
        .module('kd.comm')
        .factory('Upload', Upload);

    function Upload($q, $localStorage,$cordovaImagePicker,$cordovaFileTransfer,Loading, $log,ENV) {

        var service = {
            imageUpload: imageUpload,
        };

        // 图片上传
        function imageUpload(){
            var deferred = $q.defer();

            var options = {
                maximumImagesCount: 1,
                width: 512,
                height: 512,
                quality: 100
            };

            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    $log.debug("选择照片结果:",results);
                    if(results.length == 0) {
                        Loading.show("未选择图片");
                        return;
                    }

                    Loading.show("图片上传中:0%");

                    var fileURL = results[0];

                    var options = {};
                    options.fileKey = "file";
                    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";

                    var headers = {
                        'Authorization': 'Bearer ' +$localStorage.token,
                    };
                    options.headers = headers;

                    $cordovaFileTransfer.upload(encodeURI(ENV.apiUrl+'upload/image'), fileURL, options)
                        .then(function(result) {
                            $log.info("上传结果:");

                            result = JSON.parse(result.response);
                            $log.info(result);

                            if(result.status) {
                               Loading.show("上传成功");
                                deferred.resolve(result.data);
                            } else {
                                deferred.reject(result.message);
                            }
                        }, function(error) {
                            Loading.show("上传失败，请重试");
                            $log.debug(error);
                            deferred.reject(error);
                        }, function(progress) {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $log.debug('上传进度:'+downloadProgress);
                            Loading.showWaiting("图片上传中：" + Math.floor(downloadProgress) + "%");
                            if (downloadProgress > 99) {
                               Loading.hide();
                            }
                        });
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        return service;

    }

})();

