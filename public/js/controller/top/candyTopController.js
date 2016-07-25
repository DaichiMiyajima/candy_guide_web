/*global candy, angular, Firebase */
'use strict';

candy.controller('candyTopController', function ($scope,$route,$location,firebaseService,ROOMID,FirebaseAuth) {
    $scope.intomap = function(inputgroupname){
        if(inputgroupname && inputgroupname.length > 0){
            var url = new Date().getTime().toString(16) + new Date().getMilliseconds().toString(16) + Math.floor(10000*Math.random()).toString(16);
            firebaseService.registerSharemap(url,inputgroupname,function(){
                ROOMID.roomid = url;
                $scope.inputgroupname = "";
                $location.path("/sharemap/"+url);
                $route.reload();
            });
        }
    }
    $scope.login = function(){
        
    }
    $scope.facebooklogin = function(){
        firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider());
    }
});