/*global angular */
'use strict';

/**
 * The main candy app module
 */

var candy = 
    angular.module('candy', ['firebase','ngTouch','ngTouchstart','ngRoute'])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
     }])
    //https://candyguideweb-d7d76.firebaseio.com/
    //https://candyguide-test.firebaseio.com/
    .constant('FIREBASE_URL', 'https://candyguide-test.firebaseio.com/')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: '/views/top/top.htm',
                reloadOnSearch: false
            })
            .when('/sharemap/:roomid', {
                templateUrl: '/views/room/room.htm',
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
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
    .factory('ROOMID',function(){
        return {
            roomid : window.location.pathname.split("/")[2]
        }
    })
    .factory("FirebaseAuth", ["$firebaseAuth",function($firebaseAuth) {
        return {
            auth : "",
            userAuth : "",
            userInfo : ""
        }
     }])
    // after starting the application
    .run(function($route,$routeParams,$location,$rootScope,$firebaseAuth,$firebaseObject, $firebaseArray,firebaseService,screenEventService,gpslocationService,googlemapService,popupService,ROOMID,GOOGLE,SCREEN,FirebaseAuth){
        //initialize firebase
        firebaseService.initialize();
        firebaseService.facebookRedirect(firebaseService.registerUser).then(function(user){
            console.log(user);
            FirebaseAuth.userAuth = firebaseService.getAuth();
            FirebaseAuth.userInfo = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.userAuth.uid));
            $rootScope.userInfo = FirebaseAuth.userInfo;
        });
        FirebaseAuth.userAuth = firebaseService.getAuth();
        $rootScope.userAuth = FirebaseAuth.userAuth;
        console.log(FirebaseAuth.userAuth);
        if(FirebaseAuth.userAuth && FirebaseAuth.userAuth.uid){
            FirebaseAuth.userInfo = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.userAuth.uid));
            $rootScope.userInfo = FirebaseAuth.userInfo;
        }else{
            console.log("test NG!!!");
            firebaseService.registerAuth();
            var tete = firebaseService.getAuth();
            console.log(tete);
        }
        
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            //Init function load map and etc......
            var rooms = firebaseService.referenceSharemap();
            $firebaseObject(rooms).$loaded().then(function(room) {
                if(room[ROOMID.roomid]){
                    var crios = !!navigator.userAgent.match(/crios/i);
                    var safari = !!navigator.userAgent.match(/safari/i);
                    var iphone = !!navigator.userAgent.match(/iphone/i);
                    var line = !!navigator.userAgent.match(/Line/i);
                    if(safari && !crios && iphone && !line){
                        $("#map").css("height","90vh");
                    }
                    $rootScope.candy_map_tab = {
                        "min-height" : 50 + "vh",
                        "max-height" : 50 + "vh"
                    }
                    $rootScope.flex_box = {
                        "min-height" : 50 + "vh",
                        "max-height" : 50 + "vh"
                    }
                    SCREEN.messageInputHeight = $('.messageInputAreaDiv').height();
                    //Set GroupName
                    $rootScope.groupname = room[ROOMID.roomid].name;
                    if (navigator.geolocation) {
                        if(GOOGLE.watchID != "init"){
                            navigator.geolocation.clearWatch(GOOGLE.watchID);
                        }
                        navigator.geolocation.getCurrentPosition(function(position) {
                            //If session doesn't exist, sweetalert
                            if(!window.localStorage.getItem([ROOMID.roomid]) && !window.localStorage.getItem([ROOMID.roomid+"name"])){
                                popupService.swal_init_on(position,function(){
                                    $rootScope.yourId = window.localStorage.getItem(ROOMID.roomid);
                                });
                            }else{
                                $rootScope.yourId = window.localStorage.getItem(ROOMID.roomid);
                                //UpdateUser
                                firebaseService.updateUser(position,"on");
                            }
                            //ifでもelseでも実行
                            var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            
                            // select User
                            var users = firebaseService.referenceUserOnce();
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
                            var infomessages = $firebaseObject(firebaseService.referenceMessage());
                            infomessages.$loaded().then(function() {
                                angular.forEach(infomessages, function(value, key) {
                                    // create and handle info window
                                    googlemapService.createInfoWindow(value,key);
                                    googlemapService.handleInfoWindow(value,key);
                                });
                            });
                            //watch position
                            GOOGLE.watchID = gpslocationService.currentPosition();
                            //watch add user
                            firebaseService.referenceAddUser();
                            //watch change user
                            firebaseService.referenceChangeUser();
                            //watch addmessage
                            firebaseService.referenceAddMessage();
                            //watch addmessage
                            firebaseService.referenceAddMeetup();
                            //watch changemessage
                            firebaseService.referenceChangeMeetup();
                            //watch Removemessage
                            firebaseService.referenceRemoveMeetup();
                        }, 
                        // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                        function(error) {
                            if(!window.localStorage.getItem([ROOMID.roomid])){
                                popupService.swal_locationoff(function(){
                                    $rootScope.yourId = window.localStorage.getItem(ROOMID.roomid);
                                });
                            }else{
                                //UpdateUser
                                firebaseService.updateUser("","off");
                            }
                            GOOGLE.watchID = "off";
                            //Location on のユーザーがいればそのlocationを参照
                            var userlocation = firebaseService.referenceUserOn();
                            $firebaseObject(userlocation).$loaded().then(function(userlocation) {
                                var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                                angular.forEach(userlocation, function(value, key) {
                                    mylatlng = new google.maps.LatLng(value.latitude, value.longitude);
                                });
                                // select User
                                var users = firebaseService.referenceUserOnce();
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
                                var infomessages = $firebaseObject(firebaseService.referenceMessage());
                                infomessages.$loaded().then(function() {
                                    angular.forEach(infomessages, function(value, key) {
                                        // create and handle info window
                                        googlemapService.createInfoWindow(value,key);
                                        googlemapService.handleInfoWindow(value,key);
                                    });
                                });
                                //watch add user
                                firebaseService.referenceAddUser();
                                //watch change user
                                firebaseService.referenceChangeUser();
                                //watch addmessage
                                firebaseService.referenceAddMessage();
                                //watch addmessage
                                firebaseService.referenceAddMeetup();
                                //watch changemessage
                                firebaseService.referenceChangeMeetup();
                                //watch Removemessage
                                firebaseService.referenceRemoveMeetup();
                            });
                        });
                    }else{
                    }
                }else{
                    //url doesn't exist
                    $location.path('/');
                }
            })
        });
    });