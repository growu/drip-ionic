angular.module('drip.comm', [])

    .filter('parseUrl', function () {

        var replacePattern = /\b((http:\/\/|https:\/\/|ftp:\/\/|mailto:|news:)|www\.|ftp\.|[^ \,\;\:\!\)\(\""\'<>\f\n\r\t\v]+@)([^ \,\;\:\!\)\(\""\'<>\f\n\r\t\v]+)\b/gim;

        return function (text, target, otherProp) {
            var originText = text;
            if (text === undefined || text === "") {
                return "";
            } else {
                return text.replace(replacePattern, function ($0, $1) {
                    var match = $0;
                    var protocol = $1;

                    // if ((/^www\./i).test(match))
                    // {
                    //    return "<span onclick=\"window.open('http://" + match + "', '_system');\" class='link_url'>" + match + "</span>";
                    // }
                    // if ((/^ftp\./i).test(match))
                    // {
                    //    return "<span onclick=\"window.open('ftp://" + match + "', '_system');\" class='link_url'>" + match + "</span>";
                    // }

                    // if (protocol && protocol.charAt(0) === '@')
                    // {
                    //    return "<a href=\"mailto:" + match + "\">" + match + "</a>";
                    // }

                    return "<a href=\"" + match + "\"  target=\"_blank\" class='positive'><i class='ion-link'></i>网页链接</span>";
                });
            }
        };
    })

    .filter('trustHtml', function ($sce) {

        return function (input) {

            return $sce.trustAsHtml(input);

        };

    })

    .filter('cutStr', function () {

        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || '...');
        };


    })


    .filter('isEmpty', function () {
        var bar;
        return function (obj) {
            return angular.equals({}, obj) || obj == null;
        };
        // var bar;
        // return function (obj) {
        //   for (bar in obj) {
        //     if (obj.hasOwnProperty(bar)) {
        //       return false;
        //     }
        //   }
        //   return true;
        // };
    });
