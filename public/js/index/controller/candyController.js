/*global candy, angular, Firebase */
'use strict';

myapp.controller('candyController', function ($scope,$firebaseObject, $firebaseArray,firebaseService,screenEventService,gpslocationService,googlemapService,popupService,GOOGLE,ROOMURL,SCREEN) {
    //Open messageModal
    $scope.messageModal = function(){
        $('#messageModal').openModal();
    }
    //Open placeModal
    $scope.placeModal = function(){
        $('#placeModal').openModal();
    }
    //Make pin from Nothing
    $scope.addlocationbutton = function(){
        if(Object.keys(GOOGLE.markers_meet).length < 1){
            firebaseService.registerMessage("meetup", window.localStorage.getItem([ROOMURL+"name"])+" add marker");
            firebaseService.registerMeetUpMarkerNothing();
        }else{
            popupService.swal_remove_meetUpMarkers();
        }
    }
    //Position
    $scope.currentposition = function(){
        GOOGLE.watchID = gpslocationService.currentPosition();
    }
    /* Resize */
    $scope.resizeStart = function($event){
        if(SCREEN.resize_count == 0){
            SCREEN.resizeClass = $event.target.className;
        }
        var height = screenEventService.resizeBar(SCREEN.resizeClass,$event);
        if(height){
            $scope.candy_map_tab = {
                "min-height" : height.mapHeight + "px",
                "max-height" : height.mapHeight + "px"
            }
            $scope.flex_box = {
                "min-height" : height.flexBoxHeight + "px",
                "max-height" : height.flexBoxHeight + "px"
            }
        }
        SCREEN.resize_count = SCREEN.resize_count +1 ;
        
    }
    $scope.resizeEnd = function($event){
        SCREEN.resize_count = 0;
        SCREEN.resize = "";
    }
    // Resize for PC
    $scope.resizeStartMouse = function($event){
        if(SCREEN.resize_count == 0){
            SCREEN.resizeClass = $event.target.className;
        }
        var height = screenEventService.resizeBarPc(SCREEN.resizeClass,$event);
        if(height){
            $scope.candy_map_tab = {
                "min-height" : height.mapHeight + "px",
                "max-height" : height.mapHeight + "px"
            }
            $scope.flex_box = {
                "min-height" : height.flexBoxHeight + "px",
                "max-height" : height.flexBoxHeight + "px"
            }
        }
        SCREEN.resize_count = SCREEN.resize_count +1 ;
    }
    $scope.resizeEndMouse = function($event){
        SCREEN.resize_count = 0;
        SCREEN.resizeClass = "";
    }
    //sendMessage
    $scope.sendMessage = function(messageInput){
        if(messageInput && messageInput.length > 0){
            firebaseService.registerMessage("message",messageInput);
            $scope.messageInput = "";
        }
    }
    $scope.onfocus = function(){
        screenEventService.onFocus();
    }
    $scope.onblur = function(){
        screenEventService.onBlur();
    }
});