/*global candy, angular, Firebase */
'use strict';

candy.controller('candyTopController', function ($scope,$route,$location,firebaseService,ROOMID,FirebaseAuth,popupService) {
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
    $scope.gotomap = function(roomURL,roomshare){
        console.log(roomshare);
        if(roomURL != "global"){
            ROOMID.roomid = roomURL;
            ROOMID.roomshare = roomshare;
            $location.path('/sharemap/' + roomURL);
        }else{
            firebaseService.registerSharemap("global","GLOBAL",function(){
                ROOMID.roomid = "global";
                ROOMID.roomshare = roomshare;
                $scope.inputgroupname = "GLOBAL";
                $location.path("/sharemap/"+ROOMID.roomid);
                $route.reload();
            });
        }
    }
    $scope.changeShare = function(userroom,kind){
        popupService.swal_change_locationshare(kind,userroom);
    }
});