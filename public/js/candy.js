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
            roomid : window.location.pathname.split("/")[2],
            roomshare : ""
        }
    })
    .factory("FirebaseAuth", ["$firebaseAuth",function($firebaseAuth) {
        var config = {
            apiKey: "AIzaSyBO-hP85qXuHJVQmanTSdjPnsZbhdqWs7k",
            authDomain: "candyguide-1ddd8.firebaseapp.com",
            databaseURL: "https://candyguide-1ddd8.firebaseio.com",
            storageBucket: "candyguide-1ddd8.appspot.com",
        };
        firebase.initializeApp(config);
        return {
            auth : $firebaseAuth(),
            userAuth : "",
            userInfo : "",
            displayname : "",
            photoURL : ""
        }
     }])
    // after starting the application
    .run(function($q,$route,$routeParams,$location,$rootScope,$firebaseAuth,$firebaseObject,$firebaseArray,firebaseService,screenEventService,gpslocationService,googlemapService,authService,popupService,ROOMID,GOOGLE,SCREEN,FirebaseAuth){
        //initialize firebase
        firebaseService.initialize();
        firebaseService.facebookRedirect(firebaseService.registerUser).then(function(user){
            FirebaseAuth.userAuth = firebaseService.getAuth();
            FirebaseAuth.userInfo = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.userAuth.uid));
            $rootScope.userInfo = FirebaseAuth.userInfo;
        });
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            // wait for getAuth
            FirebaseAuth.auth.$waitForSignIn().then(function () {
                if(FirebaseAuth.auth.$getAuth()){
                    FirebaseAuth.userInfo = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.auth.$getAuth().uid));
                    $rootScope.userInfo = FirebaseAuth.userInfo;
                    FirebaseAuth.userInfo.$loaded().then(function(user) {
                        FirebaseAuth.displayname = user.displayname;
                        if(user.photoURL){
                            FirebaseAuth.photoURL = user.photoURL;
                        }
                    });
                }
                //Init function load map and etc......
                var rooms = firebaseService.referenceSharemap();
                $firebaseObject(rooms).$loaded().then(function(room) {
                    if(room[ROOMID.roomid] || ROOMID.roomid == "global"){
                        $rootScope.roomid = ROOMID.roomid;
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
                        SCREEN.messageInputHeight = 43;
                        
                        $rootScope.roominformation = room[ROOMID.roomid]
                        if (navigator.geolocation) {
                            if(GOOGLE.watchID != "init"){
                                navigator.geolocation.clearWatch(GOOGLE.watchID);
                            }
                            navigator.geolocation.getCurrentPosition(function(position) {
                                if(room[ROOMID.roomid] && room[ROOMID.roomid].roomusers && FirebaseAuth.auth.$getAuth() && room[ROOMID.roomid].roomusers[FirebaseAuth.auth.$getAuth().uid]){
                                    ROOMID.roomshare = room[ROOMID.roomid].roomusers[FirebaseAuth.auth.$getAuth().uid].share;
                                }else{
                                    ROOMID.roomshare = "on";
                                }
                                console.log(ROOMID.roomshare);
                                $rootScope.roomshare = ROOMID.roomshare;
                                authService.userauthentication(position,ROOMID.roomshare).then(function() {
                                    //ifでもelseでも実行
                                    var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                    //init MAp
                                    googlemapService.loadMap(mylatlng);
                                    // select User
                                    var users = firebaseService.referenceUserOnce();
                                    //init create Marker
                                    firebaseService.initloadUser(users,firebaseService.selectLoginUser);
                                    //infowindow
                                    var infomessages = firebaseService.referenceMessage();
                                    firebaseService.loadinfowindow(infomessages);
                                    
                                    firebaseService.test();
                                    //watch position
                                    GOOGLE.watchID = gpslocationService.currentPosition();
                                    //watch add user
                                    firebaseService.referenceAddUser(firebaseService.selectLoginUser);
                                    //watch change user
                                    firebaseService.referenceChangeUser(firebaseService.selectLoginUser);
                                    //watch delete user
                                    firebaseService.referenceDeleteUser();
                                    //watch addmessage
                                    firebaseService.referenceAddMessage();
                                    //watch addmessage
                                    firebaseService.referenceAddMeetup();
                                    //watch changemessage
                                    firebaseService.referenceChangeMeetup();
                                    //watch Removemessage
                                    firebaseService.referenceRemoveMeetup();
                                });
                            }, 
                            // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                            function(error) {//UpdateUser
                                authService.userauthentication("","off").then(function() {
                                    GOOGLE.watchID = "off";
                                    $rootScope.roomshare = "off";
                                    //Location on のユーザーがいればそのlocationを参照
                                    var userlocation = firebaseService.referenceUserOn();
                                    $firebaseObject(userlocation).$loaded().then(function(userlocation) {
                                        var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                                        angular.forEach(userlocation, function(value, key) {
                                            mylatlng = new google.maps.LatLng(value.latitude, value.longitude);
                                        });
                                        //LocationOnのユーザーのLocationを中心地として表示 init MAp
                                        googlemapService.loadMap(mylatlng);
                                        // select User
                                        var users = firebaseService.referenceUserOnce();
                                        //init create Marker
                                        firebaseService.initloadUser(users,firebaseService.selectLoginUser);
                                        //infowindow
                                        var infomessages = $firebaseObject(firebaseService.referenceMessage());
                                        firebaseService.loadinfowindow(infomessages);
                                        //watch add user
                                        firebaseService.referenceAddUser();
                                        //watch change user
                                        firebaseService.referenceChangeUser();
                                        //watch delete user
                                        firebaseService.referenceDeleteUser();
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
                            });
                        }else{
                        }
                    }else{
                        var userRooms = $firebaseArray(firebaseService.referenceUserrooms());
                        firebaseService.joinUserandRoom(userRooms).then(function(roomusers){
                            $rootScope.userrooms = roomusers;
                        });
                        userRooms.$watch(function(event) {
                            firebaseService.joinUserandRoom(userRooms).then(function(roomusers){
                                $rootScope.userrooms = roomusers;
                            });
                        });
                        //url doesn't exist
                        $location.path('/');
                        
                    }
                })
            });
        });
    });
