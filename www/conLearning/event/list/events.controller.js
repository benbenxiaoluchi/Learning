/**
 * Created by jian.a.gao on 4/17/2015.    
 */
'use strict';
controllers.controller('eventscontroller',
    ['$scope', '$rootScope', 'trainingService', '$filter', '$ionicPlatform',  '$log',  '$ionicLoading', '$ionicScrollDelegate',
        'itemPathService', 'aclAuthService', 'connectedLearning.constants.environments',
        'connectedLearning.messages','connectedLearning.constants','connectedLearning.methods','ionicDatePicker',
function ($scope, $rootScope, trainingService, filter, $ionicPlatform, $log, $ionicLoading, $ionicScrollDelegate,
          itemPathService, aclAuthService, environments,messagesService,constants, methods,ionicDatePicker) {
    /// <summary>
    /// Controller that manages functionality all training list
    /// </summary>
    /// <param name="$scope">
    /// scope is an object that refers to the application model. It is an execution context for expressions.
    /// Scopes are arranged in hierarchical structure which mimic the DOM structure of the application.
    /// Scopes can watch expressions and propagate events.
    /// </param>
    /// <doc>myExpenses.controllers:trainingListController</doc>

    //#region Properties

    /// <summary>
    /// Training list model
    /// </summary>
    /// <doc>myExpenses.controllers:expensesListController</doc>
    //var counter = 0;

    //$scope.$on("tokenReady", function (event) {
    //    $scope.getTrainingList();
    //})

    $scope.eventsTabs = [ // this is created for harmonizr
        {
            icon: "",
            isTabVisible: true,
            tabID: 0,
            template: "conLearning/event/list/tabs/current/current.html",
            text: "CURRENT"
        },
        {
            icon: "",
            isTabVisible: true,
            tabID: 1,
            template: "conLearning/event/list/tabs/upcoming/upcoming.html",
            text: "UPCOMING"
        },
        {
            icon: "",
            isTabVisible: true,
            tabID: 2,
            template: "conLearning/event/list/tabs/completed/completed.html",
            text: "COMPLETED"
        }
    ];
    $scope.$on('changedTab', function (event,data) {
        //maybe do something
        console.log("-- Tab has been changed --");
    });

    $scope.getAdminTrainingList = function (StartDt,EndDt,AuthorIDType,FacilityID,TabCategory) {

        trainingService.getUpcomingSessions(StartDt,EndDt,AuthorIDType,FacilityID,TabCategory).then(
            function (data) {
                var jwt, claims;

                /*if (window.currentEnvironment != environments.MOCK) {
                 jwt = aclAuthService.getJWT();
                 console.log('jwt');
                 console.log(jwt);
                 claims = aclAuthService.getProfileInformation(jwt);
                 console.log('claims');
                 console.log(claims);
                 $scope.getClaim(claims);
                 }*/
                if(data.ReturnCode == 0){
                    var list = data.Content;
                    switch (TabCategory){
                        case 'C':
                            if (list && list.length && list.length > 0) {
                                angular.forEach(list, function (item) {
                                    item.isCurrent = true;
                                    item.fromAdmin = true;
                                    $scope.CurrentTrainingList.push(itemPathService.UpcomingPath(item));
                                });
                            }
                            $scope.finishGetCurrentTrainingList = true;
                            break;
                        case 'P':
                            if (list && list.length && list.length > 0) {
                                angular.forEach(list, function (item) {
                                    item.fromAdmin = true;
                                    $scope.PastTrainingList.push(itemPathService.UpcomingPath(item));
                                });
                            }
                            $scope.finishGetPastTrainingList = true;
                            break;
                        case 'F':
                            if (list && list.length && list.length > 0) {
                                angular.forEach(list, function (item) {
                                    item.fromAdmin = true;
                                    $scope.UpcomingTrainingList.push(itemPathService.UpcomingPath(item));
                                });
                            }
                            $scope.finishGetUpcomingTrainingList = true;
                            break;
                        default:
                            break;
                    }
                    messagesService.broadcast(constants.broadcast.finishLoadingAdminTraining);
                }
                else{
                    if(TabCategory == 'C'){
                        $scope.finishGetCurrentTrainingList = true;
                    }
                    else if(TabCategory == 'P'){
                        $scope.finishGetPastTrainingList = true;
                    }
                    else if(TabCategory == 'F'){
                        $scope.finishGetUpcomingTrainingList = true;
                    }

                    // Error loading expenses message
                    console.log(data.ReturnMessage);
                    $rootScope.showSplash = false;
                    messagesService.broadcast(constants.broadcast.finishLoadingAdminTraining);
                }
            },

            function (data) {
                if(TabCategory == 'C'){
                    $scope.finishGetCurrentTrainingList = true;
                }
                else if(TabCategory == 'P'){
                    $scope.finishGetPastTrainingList = true;
                }
                else if(TabCategory == 'F'){
                    $scope.finishGetUpcomingTrainingList = true;
                }
                // Error loading expenses message
                var msg = 'There was an error loading trainings. Please, try again later';
                console.log(data.status);
                console.log(data.data);
                console.log(msg);
                $rootScope.showSplash = false;
                messagesService.broadcast(constants.broadcast.finishLoadingAdminTraining);
            }
        );
    };


    $scope.showTip = function () {
        if ($scope.CurrentTrainingList.length == 0) {
            $scope.NoCurr = 'You have no currently assigned training.';
            $scope.currentTrainingIcon = "";
        }
        else{
            $scope.currentTrainingIcon = "ion-chevron-down";
            $scope.NoCurr = "";
        }
        if ($scope.UpcomingTrainingList.length == 0) {
            $scope.NoUpcoming = 'You have no upcoming training in '+$scope.filterUpcoming;
            //$scope.upcomingTrainingIcon = "";
        }
        else{
            //$scope.upcomingTrainingIcon = 'ion-chevron-down';
            $scope.NoUpcoming = "";
        }
        if ($scope.PastTrainingList.length == 0) {
            $scope.NoPast = 'You have no past training in '+$scope.filterUpcoming;
        }
        else{
            $scope.NoPast = '';
        }
    };

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
        $scope.currentTrainingShow = true;
        $scope.upcomingTrainingShow = true;
        $scope.pastTrainingShow = true;

        $scope.upcomingTrainingIcon = 'ion-chevron-down';
        $scope.pastTrainingIcon = 'icon ion-chevron-down';

        $scope.upcomingStartDt = "";
        $scope.upcomingDisplayStartDt = "";
        $scope.upcomingEndDt = "";
        $scope.upcomingDisplayEndDt = "";

        $scope.pastStartDt = "";
        $scope.pastDisplayStartDt = "";
        $scope.pastEndDt = "";
        $scope.pastDisplayEndDt = "";

        $scope.CurrentTrainingList = [];
        $scope.UpcomingTrainingList = [];
        $scope.PastTrainingList = [];
        $scope.NoCurr = "";
        $scope.NoUpcoming = "";
        $scope.NoPast = "";
        $scope.finishGetCurrentTrainingList = false;
        $scope.finishGetPastTrainingList = false;
        $scope.finishGetUpcomingTrainingList = false;
        $scope.filterUpcoming = "THIS WEEK";
        $scope.filterPast = "THIS WEEK";

        $ionicLoading.show();
        $scope.getTrainingList('F',$scope.filterUpcoming);
        $scope.getTrainingList('C');
        $scope.getTrainingList('P',$scope.filterPast);
    });

    $scope.showCurrentTraining = function () {
        if ($scope.currentTrainingShow) {
            $scope.currentTrainingShow = false;
            $scope.currentTrainingIcon = ' placeholder-icon ion-chevron-up';
        } else {
            $scope.currentTrainingShow = true;
            $scope.currentTrainingIcon = ' placeholder-icon ion-chevron-down';
        }
        $ionicScrollDelegate.resize();        
    };

    $scope.showUpcomingTraining = function () {
        //$scope.upcomingTrainingShow = !$scope.upcomingTrainingShow;
        //$scope.upcomingTrainingIcon = $scope.upcomingTrainingShow?'ion-chevron-down':'ion-chevron-up';
        $scope.showUpcomingSelect = true;
        $scope.UpcomingCalendarSelectMessage ="";
        if(!$scope.upcomingCalendarViewSelect){
            $scope.upcomingStartDt = "";
            $scope.upcomingDisplayStartDt = "";
            $scope.upcomingEndDt = "";
            $scope.upcomingDisplayEndDt = "";
        }

        $ionicScrollDelegate.resize();
    };

    $scope.showPastTraining = function () {
        /*
        if ($scope.pastTrainingShow) {
            $scope.pastTrainingShow = false;
            $scope.pastTrainingIcon = 'icon ion-ios-plus-empty placeholder-icon ion-chevron-up';
        } else {
            $scope.pastTrainingShow = true;
            $scope.pastTrainingIcon = 'icon ion-ios-minus-empty placeholder-icon ion-chevron-down';
        }*/
        $scope.showPastSelect = true;
        $scope.PastCalendarSelectMessage="";
        if(!$scope.pastCalendarViewSelect){
            $scope.pastStartDt = "";
            $scope.pastDisplayStartDt = "";
            $scope.pastEndDt = "";
            $scope.pastDisplayEndDt = "";
        }
        $ionicScrollDelegate.resize();
    };

    $scope.scheduleTabCss = ['schedule-tab-selected','',''];
    $scope.tabContentSelected = [true,false,false];
    $scope.chooseScheduleTab = function (index) {
        $scope.scheduleTabCss = [];
        $scope.tabContentSelected = [];
        $scope.scheduleTabCss[index] = 'schedule-tab-selected';
        $scope.tabContentSelected[index] = true;
    };

    $scope.doRefresh =function(){
        //$scope.refresh = true;
        //$scope.CurrentTrainingList = [];
        //$scope.UpcomingTrainingList = [];
        //$scope.PastTrainingList = [];
        //$scope.finishGetTrainingList = false;
        //$scope.finishGetUpcomingTrainingList = false;
        //$scope.getTrainingList();
        //$scope.getUpcomingTrainingList();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //type = 'S', 'E'
    //'S' = Start Date
    //'E' = end date
    $scope.openUpcomingDatePicker = function(type){
        $scope.dt = null;
        if(type == 'S'){
            $scope.dt = $scope.upcomingStartDt;
        }
        else{
            $scope.dt = $scope.upcomingEndDt;
        }
        var currentdt = new Date();
        //var from = new Date(currentdt.getFullYear(), currentdt.getMonth(),currentdt.getDate()+1);
        var from = new Date(currentdt.getFullYear(), currentdt.getMonth(),currentdt.getDate());
        var to  = new Date(currentdt.getFullYear()+30, currentdt.getMonth(),currentdt.getDate());
        var ipObj1;
        ipObj1 = {
            callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                if (type == 'S') {
                    $scope.upcomingStartDt = new Date(val);
                    $scope.upcomingDisplayStartDt = itemPathService.formatDate($scope.upcomingStartDt, 'dd MMM yyyy');
                }
                else {
                    $scope.upcomingEndDt = new Date(val);
                    $scope.upcomingDisplayEndDt = itemPathService.formatDate($scope.upcomingEndDt, 'dd MMM yyyy');
                }
                $scope.chooseUpcomingCalendarView();
            },
            inputDate: $scope.dt || from,      //Optional
            mondayFirst: true,          //Optional
            closeOnSelect: false,       //Optional
            weeksList: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            setLabel: 'Select',
            templateType: 'popup',
            from:from,
            to:to,
            showTodayButton:true
        };
        ionicDatePicker.openDatePicker(ipObj1);
    };

    $scope.chooseUpcomingCalendarView = function(){
        if($scope.upcomingStartDt && $scope.upcomingEndDt && $scope.upcomingStartDt<=$scope.upcomingEndDt){
            $scope.UpcomingCalendarSelectMessage = "";
            $scope.getTrainingList( 'F','CALENDAR VIEW');
        }
        else{
            $scope.UpcomingCalendarSelectMessage = "This can not be past date.";
            if(!$scope.upcomingStartDt)
                $scope.UpcomingCalendarSelectMessage+=" Please input Start Date.";
            if(!$scope.upcomingEndDt)
                $scope.UpcomingCalendarSelectMessage+=" Please input End Date.";
            if($scope.upcomingStartDt>$scope.upcomingEndDt)
                $scope.UpcomingCalendarSelectMessage+=" Start Date should be less than or equal to End date.";
        }
    }

    //type = 'S', 'E'
    //'S' = Start Date
    //'E' = end date
    $scope.openPastDatePicker = function(type){
        $scope.dt = null;
        if(type == 'S'){
            $scope.dt = $scope.pastStartDt;
        }
        else{
            $scope.dt = $scope.pastEndDt;
        }
        var currentdt = new Date();
        var from = new Date(currentdt.getFullYear()-30, currentdt.getMonth(),currentdt.getDate());
        //var to  = new Date(currentdt.getFullYear(), currentdt.getMonth(),currentdt.getDate()-1);
        var to  = new Date(currentdt.getFullYear(), currentdt.getMonth(),currentdt.getDate());
        var ipObj2;
        ipObj2 = {
            callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                if (type == 'S') {
                    $scope.pastStartDt = new Date(val);
                    $scope.pastDisplayStartDt = itemPathService.formatDate($scope.pastStartDt, 'dd MMM yyyy');
                }
                else {
                    $scope.pastEndDt = new Date(val);
                    $scope.pastDisplayEndDt = itemPathService.formatDate($scope.pastEndDt, 'dd MMM yyyy');
                }
                $scope.choosePastCalendarView();
            },
            inputDate: $scope.dt || to,      //Optional
            mondayFirst: true,          //Optional
            closeOnSelect: false,       //Optional
            weeksList: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            setLabel: 'Select',
            templateType: 'popup',
            from:from,
            to:to,
            showTodayButton:false,
        };
        ionicDatePicker.openDatePicker(ipObj2);
    };

    $scope.choosePastCalendarView = function(){
        if($scope.pastStartDt && $scope.pastEndDt && $scope.pastStartDt<=$scope.pastEndDt){
            $scope.PastCalendarSelectMessage="";
            $scope.getTrainingList( 'P','CALENDAR VIEW');
        }
        else{
            $scope.PastCalendarSelectMessage = "This can not be future date.";
            if(!$scope.pastStartDt)
                $scope.PastCalendarSelectMessage+=" Please input Start Date.";
            if(!$scope.pastEndDt)
                $scope.PastCalendarSelectMessage+=" Please input End Date.";
            if($scope.pastStartDt>$scope.pastEndDt)
                $scope.PastCalendarSelectMessage+=" Start Date should be less than or equal to End date.";
        }
    }

    //TabCategory = 'C', 'P' , 'F'
    ////filterSelect = "THIS WEEK", "LAST WEEK", "THIS MONTH"
    $scope.getTrainingList= function( TabCategory,filterSelect){
        $scope.upcomingCalendarViewSelect = false;
        $scope.pastCalendarViewSelect = false;
        var AuthorIDType = 4;
        var FacilityID;
        var st;
        var dt;
        var isValidDt = true;
        //$scope.now used for unit test
        var now = $scope.now?$scope.now:new Date();
        var currentDt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
        var currentDateTime = new Date(now.getUTCFullYear(), now.getUTCMonth(),now.getUTCDate(),
            now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds());
        var currentLocalDt = new Date(now.getFullYear(),now.getMonth(),now.getDate());
        $ionicLoading.show();
        switch(TabCategory){
            case 'P':
                $scope.PastTrainingList = [];

                $scope.filterPast = filterSelect;
                $scope.showPastSelect = false;
                switch(filterSelect){
                    case "THIS WEEK":
                        if(!methods.isMonday(currentDt)){
                            st = methods.getMonday(currentDt); //this monday
                            currentDt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                            //dt = new Date(currentDt.getFullYear(),currentDt.getMonth(),currentDt.getDate()-1,23,59,59); //yesterday
                            dt = currentDateTime;
                        }
                        else{
                            st = currentDt;
                            dt = currentDateTime;
                        }
                        break;
                    case "LAST WEEK":
                        st = methods.getLastMonday(currentDt); //last monday
                        currentDt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                        dt = methods.getLastSunday(currentDt); //last sunday
                        break;
                    case "THIS MONTH":
                        if(!methods.isFirstDayOfMonth(currentDt)){
                            st = methods.getFirstDayOfMonth(currentDt);//the first day of this month
                            //dt = new Date(currentDt.getFullYear(),currentDt.getMonth(),currentDt.getDate()-1,23,59,59);//yesterday
                            dt = currentDateTime;
                        }
                        else{
                            st =currentDt;
                            dt = currentDateTime;
                        }
                        break;
                    case "CALENDAR VIEW":
                        st = $scope.pastStartDt;
                        dt = $scope.pastEndDt;
                        if($scope.pastStartDt.getTime() == currentLocalDt.getTime()){
                            st = currentDt;
                        }
                        if($scope.pastEndDt.getTime() == currentLocalDt.getTime()){
                            dt = currentDateTime;
                        }
                        $scope.filterPast = $scope.pastDisplayStartDt +' - '+$scope.pastDisplayEndDt;
                        $scope.pastCalendarViewSelect = "CALENDAR VIEW";
                        break;
                    default:
                        cnosole.log("getCompletedTrainingList: the parameter is incorrect."+filter);
                        break;
                }
                break;
            case 'C':
                $scope.CurrentTrainingList = [];
                var st = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),0,0,0);
                var dt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                break;
            case 'F':
                $scope.UpcomingTrainingList = [];
                $scope.showUpcomingSelect = false;
                $scope.filterUpcoming = filterSelect;
                switch(filterSelect){
                    case "THIS WEEK":
                        if(!methods.isSunday(currentDt)){
                            //st =new Date(currentDt.getFullYear(),currentDt.getMonth(),currentDt.getDate()+1,0,0,0); //tomorrow
                            st = currentDateTime;
                            currentDt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                            dt = methods.getSunday(currentDt); //this sunday
                        }
                        else{
                            //isValidDt = false;
                            st = currentDateTime;
                            dt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                        }
                        break;
                    case "NEXT WEEK":
                        st = methods.getNextMonday(currentDt); //next monday
                        currentDt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                        dt = methods.getNextSunday(currentDt); //next sunday
                        break;
                    case "THIS MONTH":
                        if(!methods.isLastDayOfMonth(currentDt)){
                            //st =new Date(currentDt.getFullYear(),currentDt.getMonth(),currentDt.getDate()+1,0,0,0); //tomorrow
                            st = currentDateTime;
                            currentDt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                            dt = methods.getLastDayOfMonth(currentDt);
                        }
                        else{
                            //isValidDt = false;
                            st = currentDateTime;
                            dt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                        }
                        break;
                    case "CALENDAR VIEW":
                        st = $scope.upcomingStartDt;
                        dt = $scope.upcomingEndDt;
                        if($scope.upcomingStartDt.getTime() == currentLocalDt.getTime()){
                            st = currentDateTime;
                        }
                        if($scope.upcomingEndDt.getTime() == currentLocalDt.getTime()){
                            dt = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),23,59,59);
                        }
                        $scope.filterUpcoming = $scope.upcomingDisplayStartDt +' - '+$scope.upcomingDisplayEndDt;
                        $scope.upcomingCalendarViewSelect = "CALENDAR VIEW";
                        break;
                    default:
                        cnosole.log("getUpcomingTrainingList: the parameter is incorrect."+filter);
                        break;
                }
                break;
        }
        if (!isValidDt) {
            if(TabCategory == 'C'){
                $scope.finishGetCurrentTrainingList = true;
            }
            else if(TabCategory == 'P'){
                $scope.finishGetPastTrainingList = true;
            }
            else if(TabCategory == 'F'){
                $scope.finishGetUpcomingTrainingList = true;
            }
            messagesService.broadcast(constants.broadcast.finishLoadingAdminTraining);
        } else {

            var StartDt = itemPathService.formatDate(st,'MM-dd-yyyy HH:mm:ss');
            var EndDt = itemPathService.formatDate(dt,'MM-dd-yyyy HH:mm:ss');
            // StartDt = (st.getMonth() + 1 < 10 ? '0' : '') + (st.getMonth() + 1) + '-' + st.getDate() + '-' + st.getFullYear() + ' 00:00:00';
            //var EndDt = (dt.getMonth() + 1 < 10 ? '0' : '') + (dt.getMonth() + 1) + '-' + dt.getDate() + '-' + dt.getFullYear() + ' 23:59:59';


            $scope.getAdminTrainingList(StartDt, EndDt, AuthorIDType, FacilityID, TabCategory);
        }

    };

    $scope.$on(constants.broadcast.finishLoadingAdminTraining, function () {
            if($scope.finishGetCurrentTrainingList && $scope.finishGetUpcomingTrainingList && $scope.finishGetPastTrainingList){
                if ($scope.refresh) {
                    $scope.refresh = false;
                    $scope.$broadcast('scroll.refreshComplete');
                }
                else{
                    $scope.showTip();
                    $ionicLoading.hide();
                }
            }
        });
}]);// End controller