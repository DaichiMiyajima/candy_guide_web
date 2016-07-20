/*global candy, angular, Firebase */
'use strict';

candy.service('firebaseService', function ($q,$firebaseAuth,googlemapService,FIREBASE_URL,GOOGLE,ROOMID,FirebaseAuth) {
    var ref;
    var authObj;
    // Initialize
    this.initialize = function(){
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCgH8GYpKZcG_1uOsGY0yaoQDYPjunClvg",
            authDomain: "candyguide-test.firebaseapp.com",
            databaseURL: "https://candyguide-test.firebaseio.com",
            storageBucket: "candyguide-test.appspot.com",
        };
        firebase.initializeApp(config);
        ref = firebase.database().ref();
        FirebaseAuth.auth = $firebaseAuth();
    }
    //Facebook
    this.facebookRedirect = function(callback){
        var deferred = $q.defer();
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                var credential = firebase.auth.FacebookAuthProvider.credential(result.credential.accessToken);
                FirebaseAuth.userInfo = FirebaseAuth.auth.$getAuth();
                callback(FirebaseAuth.auth.$getAuth(),"facebook");
                deferred.resolve(result.user);
            }
        }).catch(function(error) {
            console.log("error");
        });
        return deferred.promise;
    }
    //RegisterAuth
    this.registerAuth = function(){
        console.log("registerAuth");
        FirebaseAuth.auth.$signInAnonymously().then(function(firebaseUser) {
            console.log("through");
            console.log(firebaseUser);
        }).catch(function(error) {
            console.log("error");
        });
    }
    //GetAuth
    this.getAuth = function(){
        return FirebaseAuth.auth.$getAuth();
    }
    //Add User
    this.registerUser = function(userinfo,provider){
        ref.child('user').child(userinfo.uid).set({
            displayname : userinfo.displayName,
            photoURL : userinfo.photoURL,
            provider : provider,
            latitude : "",
            longitude : "",
            time : new Date().getTime()
        });//set
    }
    //Select User
    this.selectLoginUser = function(uid){
        return ref.child('user').child(uid);
    }
    //Add new room
    this.registerSharemap = function(url,inputgroupname,callback){
        ref.child("room").child(url).set({
            name : inputgroupname
        },callback);
    }
    
    //SelectUser once
    this.referenceUserOnce = function(){
        return ref.child('room').child(ROOMID.roomid).child('users').orderByChild("share").equalTo("on");
    }
    //watch add user
    this.referenceAddUser = function(){
        ref.child('room').child(ROOMID.roomid).child('users').orderByChild("share").equalTo("on").on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            var difference_time = (new Date().getTime()-adddata["time"]) / (1000 * 60 * 60 * 24);
            if(adddata["time"] && difference_time < 1){
                googlemapService.createMarker(adddata.latitude, adddata.longitude, adddata.name, snapshot.key,googlemapService.markercreate);
            }
        });
    }
    //watch change user
    this.referenceChangeUser = function(){
        ref.child('room').child(ROOMID.roomid).child('users').orderByChild("share").equalTo("on").on('child_changed', function(snapshot, changeChildKey) {
            var changedata = snapshot.val();
            googlemapService.changeMarker(changedata,snapshot.key);
        });
    }
    //watch addmessage
    this.referenceAddMessage = function(){
        ref.child('room').child(ROOMID.roomid).child('message').limitToLast(1).on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            // create and handle info window
            googlemapService.createInfoWindow(adddata,snapshot.key);
            googlemapService.handleInfoWindow(adddata,snapshot.key);
            if(adddata.kind=="message"){
                Materialize.toast("[" + adddata.name + "]" + " : " + adddata.message, 5000, 'rounded message') 
            }else if(adddata.kind=="attend" || adddata.kind=="meetup"){
                Materialize.toast(adddata.message , 5000, 'rounded attend meetup');
            }else if(adddata.kind=="meetupremove"){
                Materialize.toast(adddata.message , 5000, 'rounded meetupremove');
            }else if(adddata.kind=="meetupchange"){
                Materialize.toast(adddata.message , 5000, 'rounded meetupchange');
            }
        });
    }
    //watch addmeetup
    this.referenceAddMeetup = function(){
        ref.child('room').child(ROOMID.roomid).child('meetup').on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            //create meetup
            googlemapService.meetupCreateMarkers(adddata,snapshot.key,function(){});
        });
    }
    //watch addmeetup
    this.referenceChangeMeetup = function(){
        ref.child('room').child(ROOMID.roomid).child('meetup').on('child_changed', function(snapshot, changeChildKey) {
            var changedata = snapshot.val();
            //change meetup
            googlemapService.meetupChangeMarkers(changedata,snapshot.key);
        });
    }
    //watch removemeetup
    this.referenceRemoveMeetup = function(){
        ref.child('room').child(ROOMID.roomid).child('meetup').on('child_removed', function(snapshot, changeChildKey) {
            var removedata = snapshot.val();
            //Remove meetup
            googlemapService.meetupRemoveMarkers(removedata,snapshot.key);
            
        });
    }

    //SelectSharemap
    this.referenceSharemap = function(){
        return ref.child('room');
    }
    //select User for getting location
    this.referenceUserOn = function () {
        return ref.child('room').child(ROOMID.roomid).child('users').orderByChild("share").equalTo("on").limitToLast(1);
    }
    //AddUser
    this.registerRoomUser = function (name,position,share) {
        var postsRef = ref.child("room").child(ROOMID.roomid).child('users');
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        if(position){
            ref.child('room').child(ROOMID.roomid).child('users').child(postID).set({
                name : name,
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                share : share,
                time : new Date().getTime()
            });//set
        }else{
            ref.child('room').child(ROOMID.roomid).child('users').child(postID).set({
                name : name,
                latitude : "",
                longitude : "",
                share : share,
                time : new Date().getTime()
            });//set
        }
        return postID;
    }
    //UpdateUSer
    this.updateUser = function (position,share) {
        if(position){
            ref.child('room').child(ROOMID.roomid).child('users').child(window.localStorage.getItem([ROOMID.roomid])).update({
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                share : share,
                time : new Date().getTime()
            });//set
        }else{
            ref.child('room').child(ROOMID.roomid).child('users').child(window.localStorage.getItem([ROOMID.roomid])).update({
                latitude : "",
                longitude : "",
                share : share,
                time : new Date().getTime()
            });//set
        }
    }
    //select Message
    this.referenceMessage = function () {
        return ref.child('room').child(ROOMID.roomid).child('message').orderByChild("time");
    }
    //AddMessage
    this.registerMessage = function (kind,messageInput) {
        var postsRef = ref.child("room").child(ROOMID.roomid).child("message");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('room').child(ROOMID.roomid).child("message").child(postID).set({
            key : window.localStorage.getItem([ROOMID.roomid]) ,
            name : window.localStorage.getItem([ROOMID.roomid+"name"]),
            time : new Date().getTime(),
            kind : kind,
            message : messageInput
        });//set
    }
    //Add MeetUp MArker
    this.registerMeetUpMarker = function (place) {
        var postsRef = ref.child("room").child(ROOMID.roomid).child("meetup");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        //Set meetup
        ref.child('room').child(ROOMID.roomid).child('meetup').child(postID).update({
            key : window.localStorage.getItem([ROOMID.roomid]),
            latitude : place.geometry.location.lat(),
            longitude : place.geometry.location.lng(),
            kind : "search"
        });//set
    }
    //Add MeetUp MArker from nothing
    this.registerMeetUpMarkerNothing = function () {
        var latlng = GOOGLE.googlemap.getCenter();
        var postsRef = ref.child("room").child(ROOMID.roomid).child("meetup");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        //Set meetup
        ref.child('room').child(ROOMID.roomid).child('meetup').child(postID).update({
            key : window.localStorage.getItem([ROOMID.roomid]),
            latitude : latlng.lat(),
            longitude : latlng.lng(),
            kind : "nothing"
        });//set
    }
    //update MeetUp MArker
    this.updateMeetUpMarkerNothing = function (key,position) {
        //Set meetup
        ref.child('room').child(ROOMID.roomid).child('meetup').child(key).update({
            latitude : position.lat(),
            longitude : position.lng()
        });//set
    }
    this.removeMeetUpMarker = function(){
        ref.child('room').child(ROOMID.roomid).child("meetup").remove();
    }
})