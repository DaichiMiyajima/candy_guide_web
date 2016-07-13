/*global candy, angular, Firebase */
'use strict';

//Message Include
myapp.controller('messageController', function ($firebaseArray,firebaseService,ROOMURL) {
    var message = firebaseService.referenceMessage(ROOMURL);
    this.messages = $firebaseArray(message);
});