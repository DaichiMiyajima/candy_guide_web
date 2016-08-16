/*global candy, angular, Firebase */
'use strict';

candy.directive('fileModel', ["$parse", function ($parse) {
    return {
        restrict : 'A',
        link     : function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            element.bind("change", function () {
                scope.$apply(function () {
                    model.assign(scope, element[0].files);
                });
            });
        }
    };
}]);

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
    $scope.roomsetting = function(userroom){
        $scope.userroominfo = userroom;
        $scope.photosPreview = [];
        $('#roomSettingModal').openModal();
    }
    //select image
    $scope.$watch('imageFile',function(imageFile){
        if(imageFile){
            $scope.photosPreview = [];
            for(var i=0; i<imageFile.length; i++){
                if(!imageFile[i] || !imageFile[i].type.match("image.*")){
                    console.log('このファイルは写真ではありません。 : ' + imageFile[i].name); 
                    return;
                }
                var reader = new FileReader();
                reader.readAsDataURL(imageFile[i]);
                reader.onload = function(theFile){
                    $scope.$apply(function(){
                        $scope.photosPreview.push(theFile.target.result);
                    });
                }
            }
        }
    });
    //Room Setting
    $scope.roomSettingChange = function(userroominfo,imageFile){
        if(!imageFile){
            imageFile = ""
        }else{
            imageFile = imageFile[0]
        }
        firebaseService.uploadRoomImage(userroominfo,imageFile);
    }
    //Room Leave
    $scope.roomleave = function(userroom){
        popupService.swal_leave_room(userroom);
    }
    //user setting modal
    $scope.usersetting = function(){
        $scope.userInfo = FirebaseAuth.userInfo;
        $('#userSettingModal').openModal();
    }
    $scope.userSettingChange = function(userinfo,imageFile){
        if(!imageFile){
            imageFile = ""
        }else{
            imageFile = imageFile[0]
        }
        firebaseService.uploadUserImage(userinfo,imageFile);
    }
});