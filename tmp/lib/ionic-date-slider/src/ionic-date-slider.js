  angular.module('dateSlider',[])
  .directive('dateSliderPicker',['$compile',function($compile){
    
    return {
      restrict : 'E',
      link : function($scope,$elem,$attrs) {
        //var monthDays = ['S','M','T','W','Th','F','Sa'],
        var monthDays = ['日','一','二','三','四','五','六'],

            onSelectDate = $attrs.onSelectDate,
            dateVar = $attrs.dateSelectVar,
            eventsVal = $attrs.dateEvents,
            valueToWatch,
            configObj,
            totalDays = ($attrs.totalDays && parseInt($attrs.totalDays)) || 90;

        if(dateVar) {
          initSelectedDate();
        }

        configObj = {
          totalDays : totalDays
        };

        function initSelectedDate() {

          var splitted = dateVar.split('.');

          if(splitted.length > 0) {
            valueToWatch = formatKeys(splitted);
          } else {
            valueToWatch = $scope.$eval(dateVar);
          }

        }

        if(!(onSelectDate)) {
          onSelectDate = function() {};
        }

        function formatKeys(key) {

          var props = key,
              len = props.length,
              index,
              obj = {},
              currKey;

          for(index = 0; index < len; index++) {
            currKey = props[index];
            obj = obj[currKey] ? obj[currKey] : $scope[currKey];
          }

          return obj;
        }

        function getKeys() {
          
          var arr = [],
              obj = this;

          for(var i in obj) {
            if(obj.hasOwnProperty(i)) {
              arr.push(i);
            }
          }

          return arr;
        }

        function daysInMonth(month,year) {
          return new Date(year, month, 0).getDate();
        }

        function getEvent(day){
          var events = [];
          var dayVal = formatDate(day);
          angular.forEach($scope.$eval(eventsVal),function(event){
            if(event.checkin_day === dayVal) {
              events.push(event);
            }
          });
          return events;
        }

        function formatDate(date) {
          var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [year, month, day].join('-');
        }

        function generateDays() {

          var date = new Date(),
              month = date.getMonth(),
              year = date.getFullYear(),
              days = daysInMonth((month - 1),year),
              totalDays = configObj.totalDays,
              currYear = date.getFullYear(),
              currMonth = date.getMonth(),
              dates = [],
              today = date.getDate(),
              counter = today,
              currDay = date.getDay(),
              calendar = [],
              index,
              dateObj,
              template;

          for(index = totalDays; index >= 1; index--) {

            // console.log("当前counter:"+counter);

            // 如果是1号
            if(counter == 0) {
              
              // 当前月份－1
              currMonth = (currMonth === 1) ? 0 : (currMonth - 1);
              currYear = (currMonth === 0) ? (currYear - 1 ) : currYear;
              days = daysInMonth((currMonth - 1),currYear);

              // counter 设置为上个月的天数
              counter = days;
            }

            // console.log("当前month:"+currMonth);

            dateObj = {
              date : counter,
              event:getEvent((new Date(currYear, currMonth, counter)).toDateString()),
              month : monthDays[currDay],
              fullDay : (new Date(currYear, currMonth, counter)).toDateString()
            };

            // 天数－1
            counter--;

            // 如果是星期天返回
            if(currDay === 0) {
              currDay = 7;
            }

            // 星期－1
            currDay--;

            dates.push(dateObj);

          }

          counter = 0;

          for(var i=totalDays-1;i>=0;i--) {
            
            if ((i-6)%7 === 0) {
              counter += 1;
            }
      
            calendar[counter] = calendar[counter] || [];
            calendar[counter].push(dates[i]);

            if(valueToWatch === dates[i].fullDay) {
              $scope.activeSlide = counter;
            }
            
          }

          return calendar;
        }

        function isActive(day,day1) {
          initSelectedDate();
          return valueToWatch === day;
        }

        function updateEvents() {
          var calendar = $scope.calendar;
          var events = $scope.$eval(eventsVal);
          angular.forEach(calendar,function(obj,index) {
            angular.forEach(obj,function(o,i){
              angular.forEach(events,function(event){
                if(event.checkin_day == formatDate(o.fullDay)) {
                  calendar[index][i]['event'] = [];
                  calendar[index][i]['event'].push(event)
                  }
              });
            });
          });
          // console.log(calendar);
          $scope.calendar = calendar;
        }

        $scope.isActive = isActive;
        $scope.calendar = generateDays();

        $scope.$watch(eventsVal, function() {
           updateEvents(eventsVal);
        });

        // template = "<ion-slide-box on-slide-changed=\"slideHasChanged($index)\" show-pager=\"false\" active-slide=\"activeSlide\"><ion-slide ng-repeat=\"week in calendar\"><div class=\"row\"><div ng-repeat=\"day in week\" ng-click=" + onSelectDate + '(day.fullDay)' + " class=\"col col-17\"><div class=\"row responsive-sm responsive-md responsive-lg text-center\"><div class=\"col\">{{day.month}}</div><div class=\"col\"><span ng-class=\"{'badge badge-positive' : isActive(day.fullDay),'event':day.event}\">{{day.date}}</span></div></div></div></div></ion-slide></ion-slide-box>";
        template = "<ion-slide-box on-slide-changed=\"slideHasChanged($index)\" " +
                                  "show-pager=\"false\" " +
            "                     active-slide=\"activeSlide\">" +
                      "<ion-slide ng-repeat=\"week in calendar\">" +
                        "<div class=\"flex-calendar\">" +
                          "<div class=\"week\">" +
                              "<div class=\"day\" ng-repeat=\"day in week\">" +
                                "{{day.month}}" +
                              "</div>" +
                          "</div>" +
                          "<div class=\"days\">" +
                              "<div class=\"day\"" +
                                "ng-repeat=\"day in week\"" +
                                "ng-click=\"" + onSelectDate + '(day)' + "\" " +
                                "ng-class=\"{'selected' : isActive(day.fullDay,day),'event':day.event.length>0}\">" +
                                  "<div class='number'>" +
                                    "{{day.date}}" +
                                  "</div>" +
                              "</div>" +
                          "</div>" +
                        "</div>" +
                      "</ion-slide>" +
                    "</ion-slide-box>";


        template = $compile(template)($scope);
        
        $elem.html(template);

      }
    };

  }]);