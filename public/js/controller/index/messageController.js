/*global candy, angular, Firebase */
'use strict';

//Message Include
myapp.controller('messageController', function ($firebaseArray,firebaseService,ROOMID) {
    var message = firebaseService.referenceMessage(ROOMID.roomid);
    this.messages = $firebaseArray(message);
});