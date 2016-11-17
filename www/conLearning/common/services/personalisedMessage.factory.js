/**
 * Created by booker on 2016/10/21.
 */
'use strict';
factories.factory('personalisedMessageData', function () {
    return {
        allParticipantsList: null, // using for group list of sending message
        checkInList: null,         // using for group list of sending message
        checkOutList: null,        // using for group list of sending message
        activityID: null,          // param used for post message api
        groupID: null,              // between newMessage and sendToList for disable grouped eid
        sendToGroupSelected: '',   // keep selected group text in send to display
        messageBody: '',           // keep typed message
        flag: '',                  // display the group list or not in newMessage page
        MessageInfo: [],
        unreadCount: null,
        backViewFlag: null,        // mark if click close button
        _dayTime: ''                // keep the dayCount in Attendance so after close newMessage still know the day
    };
});