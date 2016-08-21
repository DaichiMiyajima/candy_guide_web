/*global candy, angular, Firebase */
'use strict';

//Message Include
candy.controller('messageController', function ($scope,$firebaseObject,$firebaseArray,firebaseService,ROOMID) {
    var message = $firebaseArray(firebaseService.referenceMessage(ROOMID.roomid));
    firebaseService.joinUserandMessage(firebaseService.selectLoginUser,message).then(function(message){
        $scope.messages = message;
    });
    message.$watch(function(event) {
        firebaseService.joinUserandMessage(firebaseService.selectLoginUser,message).then(function(message){
            $scope.messages = message;
        });
    });
});