/*global candy, angular, Firebase */
'use strict';

//Message Include
candy.controller('messageController', function ($firebaseArray,firebaseService,ROOMID) {
    var message = firebaseService.referenceMessage(ROOMID.roomid);
    this.messages = $firebaseArray(message);
});