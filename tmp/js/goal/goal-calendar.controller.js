/**
 * Created by Jason.z on 16/10/17.
 */
(function() {

    'use strict';

    angular
        .module('kd.goal')
        .controller('GoalCalendarController', GoalCalendarController);

    function GoalCalendarController($http,$scope,$stateParams,$localStorage,$ionicLoading,$timeout,$state,$log,Goal,ENV) {
        var vm = this;

        vm.goalId = $stateParams.goalId;

        vm.events = [];

        vm.checkin = {};

        getEvents(moment().year(),moment().month()+1);

        vm.options =  {
            defaultDate: moment().format("YYYY-MM-DD"),
            minDate: "2015-01-01",
            maxDate: moment().format("YYYY-MM-DD"),
            disabledDates: [

            ],
            dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            mondayIsFirstDay: true,//set monday as first day of week. Default is false
            eventClick: function(date) { // called before dateClick and only if clicked day has events
                console.log(date);
            },
            dateClick: function(date) { // called every time a day is clicked
                console.log(date);
                if(date.event.length>0){
                    vm.checkin = date.event[0];
                }
            },
            changeMonth: function(month, year) {
                console.log(month);
                getEvents(year,month.index+1);
            },
            filteredEventsChange: function(filteredEvents) {
                console.log(filteredEvents);
            },
        };

        function getEvents(year,month) {
            $http.get(ENV.apiUrl+'goal/checkins?goal_id='+vm.goalId+'&month='+month+'&year='+year).success(function(response) {
                $log.debug(response);
                if(response.status) {
                    vm.events = response.data;

                    if(vm.events.length>0) {
                        var last_event = vm.events[vm.events.length-1];
                        if(last_event.checkin_day == moment().format("YYYY-MM-DD")) {
                            vm.checkin = last_event;
                        }
                    }

                }
            }).error(function(error) {
                $log.error(error);
            });
        }

        // $scope.events = [
        //     {foo: 'bar', date: "2016-08-18"}, //value of eventClass will be added to CSS class of the day element
        //     {foo: 'bar', date: "2016-08-20"}
        // ];

    }

})();