/*global angular */
'use strict';

/**
 * The main candy app module
 */

var myapp = 
    angular.module('candy', ['firebase','ngTouch','ngTouchstart'])
    //https://candyguideweb-d7d76.firebaseio.com/
    //https://candyguide.firebaseio.com/
    .constant('FIREBASE_URL', 'https://candyguide.firebaseio.com/')
    .constant('ROOMURL', window.location.pathname.split("/")[2])
    .factory('MARKER',function(){
        return {
            latitude : "",
            longitude : ""
        }
    })
    .factory('GOOGLE',function(){
        return {
            googlemap : "",
            markers : new Array(),
            markers_meet : new Array(),
            infoWindows :new Array(),
            placeService : "",
            watchID : "init"
        }
    })
    .factory('SCREEN',function(){
        return {
            resize_count : 0,
            resizeClass : "",
            messageInputHeight :""
        }
    })
    // after starting the application
    .run(function($rootScope,$firebaseObject, $firebaseArray,firebaseService,screenEventService,gpslocationService,googlemapService,popupService,ROOMURL,GOOGLE,SCREEN){
        var crios = !!navigator.userAgent.match(/crios/i);
        var safari = !!navigator.userAgent.match(/safari/i);
        var iphone = !!navigator.userAgent.match(/iphone/i);
        var line = !!navigator.userAgent.match(/Line/i);
        if(safari && !crios && iphone && !line){
            $("#map").css("height","90vh");
        }
        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
        $(".button-collapse").sideNav();
        $('.firsthide').hide();
        $('.collapsible').collapsible();
        $rootScope.candy_map_tab = {
            "min-height" : 50 + "vh",
            "max-height" : 50 + "vh"
        }
        $rootScope.flex_box = {
            "min-height" : 50 + "vh",
            "max-height" : 50 + "vh"
        }
        SCREEN.messageInputHeight = $('.messageInputAreaDiv').height();
        //Init function load map and etc......
        var sharemaps = firebaseService.referenceSharemap();
        $firebaseObject(sharemaps).$loaded().then(function(sharemap) {
            if(sharemap[ROOMURL]){
                //Set GroupName
                $rootScope.groupname = sharemap[ROOMURL].name;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        //If session doesn't exist, sweetalert
                        if(!window.localStorage.getItem([ROOMURL]) && !window.localStorage.getItem([ROOMURL+"name"])){
                            popupService.swal_init_on(ROOMURL,position,function(){
                                $rootScope.yourId = window.localStorage.getItem(ROOMURL);
                            });
                        }else{
                            $rootScope.yourId = window.localStorage.getItem(ROOMURL);
                            //UpdateUser
                            firebaseService.updateUser(position,ROOMURL,"on");
                        }
                        //ifでもelseでも実行
                        var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        
                        // select User
                        var users = firebaseService.referenceUserOnce(ROOMURL);
                        //init MAp
                        googlemapService.loadMap(mylatlng);
                        $firebaseObject(users).$loaded().then(function(user) {
                            angular.forEach(user, function(value, key) {
                                if(value){
                                    var difference_time = (new Date().getTime() - value["time"]) / (1000 * 60 * 60 * 24);
                                    if(value["time"] && difference_time < 1){
                                        googlemapService.createMarker(value["latitude"], value["longitude"], value["name"], key,googlemapService.markercreate);
                                    }
                                }
                            });
                        });
                        var infomessages = $firebaseObject(firebaseService.referenceMessage(ROOMURL));
                        infomessages.$loaded().then(function() {
                            angular.forEach(infomessages, function(value, key) {
                                // create and handle info window
                                googlemapService.createInfoWindow(ROOMURL,value,key);
                                googlemapService.handleInfoWindow(ROOMURL,value,key);
                            });
                        });
                        //watch position
                        GOOGLE.watchID = gpslocationService.currentPosition();
                        //watch add user
                        firebaseService.referenceAddUser(ROOMURL);
                        //watch change user
                        firebaseService.referenceChangeUser(ROOMURL);
                        //watch addmessage
                        firebaseService.referenceAddMessage(ROOMURL);
                        //watch addmessage
                        firebaseService.referenceAddMeetup(ROOMURL);
                        //watch changemessage
                        firebaseService.referenceChangeMeetup(ROOMURL);
                        //watch Removemessage
                        firebaseService.referenceRemoveMeetup(ROOMURL);
                    }, 
                    // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                    function(error) {
                        if(!window.localStorage.getItem([ROOMURL])){
                            popupService.swal_locationoff(function(){
                                $rootScope.yourId = window.localStorage.getItem(ROOMURL);
                            });
                        }else{
                            //UpdateUser
                            firebaseService.updateUser("",ROOMURL,"off");
                        }
                        GOOGLE.watchID = "off";
                        //Location on のユーザーがいればそのlocationを参照
                        var userlocation = firebaseService.referenceUserOn(ROOMURL);
                        $firebaseObject(userlocation).$loaded().then(function(userlocation) {
                            var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                            angular.forEach(userlocation, function(value, key) {
                                mylatlng = new google.maps.LatLng(value.latitude, value.longitude);
                            });
                            // select User
                            var users = firebaseService.referenceUserOnce(ROOMURL);
                            //LocationOnのユーザーのLocationを中心地として表示 init MAp
                            googlemapService.loadMap(mylatlng);
                            $firebaseObject(users).$loaded().then(function(user) {
                                angular.forEach(user, function(value, key) {
                                    if(value){
                                        var difference_time = (new Date().getTime() - value["time"]) / DAY_MILLISECOND;
                                        if(value["time"] && difference_time < 1){
                                            googlemapService.createMarker(value["latitude"], value["longitude"], value["name"], key,googlemapService.markercreate);
                                        }
                                    }
                                });
                            });
                            var infomessages = $firebaseObject(firebaseService.referenceMessage(ROOMURL));
                            infomessages.$loaded().then(function() {
                                angular.forEach(infomessages, function(value, key) {
                                    // create and handle info window
                                    googlemapService.createInfoWindow(value,key);
                                    googlemapService.handleInfoWindow(value,key);
                                });
                            });
                            //watch add user
                            firebaseService.referenceAddUser(ROOMURL);
                            //watch change user
                            firebaseService.referenceChangeUser(ROOMURL);
                            //watch addmessage
                            firebaseService.referenceAddMessage(ROOMURL);
                            //watch addmessage
                            firebaseService.referenceAddMeetup(ROOMURL);
                            //watch changemessage
                            firebaseService.referenceChangeMeetup(ROOMURL);
                            //watch Removemessage
                            firebaseService.referenceRemoveMeetup(ROOMURL);
                        });
                    });
                }else{
                }
            }else{
                //url doesn't exist
                popupService.swal_url();
            }
        })
        .catch(function(error) {
        });
    });