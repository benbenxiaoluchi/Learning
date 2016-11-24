/**
 * Created by huaifei.zhang on 2016/9/19.
 */
'use strict';

factories.factory('itemPathService', ['$filter',
    function ($filter) {
        return {
            'itemPath' : function (item) {
                if (item.PATH != 'RLC - St. Charles Q Center' && item.PATH != 'RLC - Kuala Lumpur Sheraton Imperial' && item.PATH != 'RLC - Madrid NH Collection Eurobuilding' && item.PATH != 'RLC - Bengaluru Marriott Hotel' && item.PATH != 'RLC - London Wokefield Park') {
                    item.imgName = 'DefaultVenue';
                    item.showNonPic = false;
                } else {
                    item.imgName = item.PATH;
                    item.showNonPic = true;
                }
                item.startDate = $filter('date')(new Date(item.startDtLOCAL), 'M/d/y hh:mma');
                if (item.PickRule == 1) {
                    item.userType = 'ion-ios-person';
                } else if (item.PickRule == 0) {
                    item.userType = 'ion-ios-people';
                }
                return item;
            },
            'myTrainingFilter': function (item) {
                function monthEqual(startDate, endDate){
                    return startDate.getMonth() == endDate.getMonth() &&
                        startDate.getYear() == endDate.getYear();
                }

                item.dateDuration = monthEqual(new Date(item.startDtLOCAL), new Date(item.endDtLOCAL)) ? ($filter('date')(new Date(item.startDtLOCAL), 'd') + ' - ' + $filter('date')(new Date(item.endDtLOCAL), 'd MMM y')) : ($filter('date')(new Date(item.startDtLOCAL), 'd MMM') + ' - ' + $filter('date')(new Date(item.endDtLOCAL), 'd MMM y'));
                if (item.PickRule == 1) {
                    item.userType = 'ion-ios-person';
                } else if (item.PickRule == 0) {
                    item.userType = 'ion-ios-people';
                }
                return item;
            },
            'myTrainingCardDurationFilter': function (item) {
                function monthEqual(startDate, endDate){
                    return startDate.getMonth() == endDate.getMonth();
                }

                item.dateDuration = monthEqual(new Date(item.startDtLOCAL), new Date(item.endDtLOCAL)) ? ($filter('date')(new Date(item.startDtLOCAL), 'MMM d') + ' - ' + $filter('date')(new Date(item.endDtLOCAL), 'd')) : ($filter('date')(new Date(item.startDtLOCAL), 'MMM d') + ' - ' + $filter('date')(new Date(item.endDtLOCAL), 'MMM d'));
                if (item.PickRule == 1) {
                    item.userType = 'ion-ios-person';
                } else if (item.PickRule == 0) {
                    item.userType = 'ion-ios-people';
                }
                return item;
            },
            'UpcomingPath' : function (item) {
                var startdt = item.StartDtLOCAL;
                var enddt = item.EndDtLOCAL;
                var startDate = $filter('date')(startdt, 'd');
                var startMonth = $filter('date')(startdt, 'M');
                var startYear = $filter('date')(startdt, 'y');
                var endDate = $filter('date')(enddt, 'd');
                var endMonth = $filter('date')(enddt, 'M');
                var endYear = $filter('date')(enddt, 'y');
                if (startYear == endYear) {
                    if (startMonth == endMonth) {
                        if(startDate == endDate){
                            item.startDate = $filter('date')(enddt, 'd MMM y');
                        }
                        else{
                            item.startDate = startDate + " - " + $filter('date')(enddt, 'd MMM y');
                        }
                    }
                    else {
                        item.startDate = $filter('date')(startdt, 'd MMM') + " - " + $filter('date')(enddt, 'd MMM y');
                    }
                }
                else {
                    item.startDate = $filter('date')(startdt, 'd MMM y') + " - " + $filter('date')(enddt, 'd MMM y');
                }
                return item;
            },
            //convert to MM-DD-YYYY HH:MM:SS (in 24HRs format)
            formatTo24HRs: function (dt) {
                return $filter('date')(dt, 'M-d-y hh:mm:ss');
            },

            formatDate: function(dt, type){
                return $filter('date')(dt, type);
            }
        }

        

    }]
);


services.service('getFacilityInfoService',['$ionicLoading', function ($ionicLoading) {

    function initCenterImage() {
        var centerImages = [];
        var centerImg = ["RLC - St. Charles Q Center.jpg",
            "RLC - Kuala Lumpur Sheraton Imperial.jpg",
            "RLC - Madrid NH Collection Eurobuilding.jpg",
            "RLC - Bengaluru Marriott Hotel.jpg",
            "RLC - London Wokefield Park.jpg",
            "Dublin_Learning_Center.jpg",
            "DefaultVenue.jpg"
        ];
        angular.forEach(centerImg,function (item) {
            var thisUrl = "url(img/" + encodeURI(item) + ")";
            var centerImageTemp = {
                "background":thisUrl,
                "background-size": "100% 220px"
            };
            centerImages.push(centerImageTemp);
        });

        return {
            centerImages : centerImages,
            centerImageList : centerImg
        };
    }

    function filterCenterImage(facilityId) {
        var theImg;
        var CenterImg = initCenterImage().centerImageList;
        if(facilityId == 1){
            theImg = CenterImg[0];
        } else if (facilityId == 737){
            theImg = CenterImg[1];
        } else if (facilityId == 2612){
            theImg = CenterImg[2];
        } else if (facilityId == 4404){
            theImg = CenterImg[3];
        } else if (facilityId == 4790){
            theImg = CenterImg[4];
        } else if (facilityId == 6176){
            theImg = CenterImg[5];
        } else {
            theImg = CenterImg[6];
        }
        return theImg;
    }

    return {
        'getCenterImageList' : initCenterImage,
        'filterCenterImage' : filterCenterImage
    }

}]);

