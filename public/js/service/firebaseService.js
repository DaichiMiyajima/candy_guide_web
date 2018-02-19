/*global candy, angular, Firebase */
'use strict';

candy.service('firebaseService', function ($q,$firebaseAuth,$firebaseArray,$firebaseObject,googlemapService,GOOGLE,ROOMID,FirebaseAuth) {
    var ref;
    var storage;
    // Initialize
    this.initialize = function(){
        // Initialize Firebase
        ref = firebase.database().ref();
        storage = firebase.storage().ref();
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
        var deferred = $q.defer();
        FirebaseAuth.auth.$signInAnonymously().then(function(firebaseUser) {
        }).catch(function(error) {
            console.log("error");
        });
        FirebaseAuth.auth.$onAuthStateChanged(function(firebaseUser) {
            if(firebaseUser){
                deferred.resolve(firebaseUser);
            }
        });
        return deferred.promise;
    }
    //GetAuth
    this.getAuth = function(){
        return FirebaseAuth.auth.$getAuth();
    }
    //Add User
    this.registerUser = function(userinfo,provider){
        ref.child('users').child(userinfo.uid).update({
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
        return ref.child('users').child(uid);
    }
    //Add new room
    this.registerSharemap = function(url,inputgroupname,callback){
        ref.child("room").child(url).set({
            name : inputgroupname
        },callback);
    }
    //Init create marker
    this.initloadUser = function(users,callback){
        $firebaseObject(users).$loaded().then(function(user) {
            angular.forEach(user, function(value, key) {
                if(value.share == "on"){
                    var userslocation = callback(key);
                    $firebaseObject(userslocation).$loaded().then(function(userlocation) {
                        if(userlocation.displayname && userlocation.latitude && userlocation.longitude){
                            googlemapService.createMarker(userlocation.latitude, userlocation.longitude, userlocation.displayname, key, userlocation.provider, userlocation.photoURL,googlemapService.markercreate);
                        }
                    });
                }
            });
        });
    }
    //create infowindow
    this.loadinfowindow = function(infomessages){
        $firebaseObject(infomessages).$loaded().then(function() {
            angular.forEach(infomessages, function(value, key) {
                // create and handle info window
                googlemapService.createInfoWindow(value,key);
                googlemapService.handleInfoWindow(value,key);
            });
        });
    }
    //SelectUser once
    this.referenceUserOnce = function(){
        return ref.child('room').child(ROOMID.roomid).child('roomusers').orderByChild("share").equalTo("on");
    }
    //watch add user
    this.referenceAddUser = function(callback){
        ref.child('room').child(ROOMID.roomid).child('roomusers').on('child_added', function(snapshot, addChildKey) {
            var userslocation = callback(snapshot.key);
            if(snapshot.val().share == "on"){
                $firebaseObject(userslocation).$loaded().then(function(userlocation) {
                    if(userlocation.displayname && userlocation.latitude && userlocation.longitude){
                        googlemapService.createMarker(userlocation.latitude, userlocation.longitude, userlocation.displayname, snapshot.key, userlocation.provider, userlocation.photoURL,googlemapService.markercreate);
                    }
                });
            }
        });
    }
    //watch change user
    this.referenceChangeUser = function(callback){
        ref.child('room').child(ROOMID.roomid).child('roomusers').on('child_changed', function(snapshot, changeChildKey) {
            if(snapshot.val().share == "on"){
                var userslocation = callback(snapshot.key);
                $firebaseObject(userslocation).$loaded().then(function(userlocation) {
                    if(userlocation.displayname && userlocation.latitude && userlocation.longitude){
                        googlemapService.changeMarker(userlocation,snapshot.key);
                        //IF share is off to on, this logic works
                        googlemapService.createMarker(userlocation.latitude, userlocation.longitude, userlocation.displayname, snapshot.key, userlocation.provider, userlocation.photoURL,googlemapService.markercreate);
                    }
                });
            }else{
                googlemapService.removeMarker(snapshot.val(),snapshot.key);
            }
        });
    }
    //watch delete user
    this.referenceDeleteUser = function(){
        ref.child('room').child(ROOMID.roomid).child('roomusers').on('child_removed', function(snapshot, changeChildKey) {
            googlemapService.removeMarker(snapshot.val(),snapshot.key);
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
                //Materialize.toast("[" + adddata.displayname + "]" + " : " + adddata.message, 5000, 'rounded message') 
            }else if(adddata.kind=="attend" || adddata.kind=="meetup"){
                //Materialize.toast(adddata.message , 5000, 'rounded attend meetup');
            }else if(adddata.kind=="meetupremove"){
                //Materialize.toast(adddata.message , 5000, 'rounded meetupremove');
            }else if(adddata.kind=="meetupchange"){
                //Materialize.toast(adddata.message , 5000, 'rounded meetupchange');
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
    this.registerRoomUser = function (name,share) {
        ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
            displayname : name,
            provider : "anonymous"
        });
        ref.child('room').child(ROOMID.roomid).child('roomusers').child(FirebaseAuth.auth.$getAuth().uid).update({
            share : share,
            time : new Date().getTime()
        });//set
    }
    //UpdateUSer
    this.updateUser = function (position,share) {
        var deferred = $q.defer();
        if(share == "on"){
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                time : new Date().getTime()
            });//set
            ref.child('room').child(ROOMID.roomid).child('roomusers').child(FirebaseAuth.auth.$getAuth().uid).update({
                share : share,
                time : new Date().getTime()
            });//set
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(ROOMID.roomid).set({
                time : new Date().getTime()
            });//set
            deferred.resolve();
        }else{
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
                time : new Date().getTime()
            });//set
            ref.child('room').child(ROOMID.roomid).child('roomusers').child(FirebaseAuth.auth.$getAuth().uid).update({
                share : share,
                time : new Date().getTime()
            });//set
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(ROOMID.roomid).set({
                time : new Date().getTime()
            });//set
            deferred.resolve();
        }
        return deferred.promise;
    }
    
    //update location
    this.updateUserLocation = function (position,share) {
        if(share == "on"){
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                time : new Date().getTime()
            });//set
            ref.child('room').child(ROOMID.roomid).child('roomusers').child(FirebaseAuth.auth.$getAuth().uid).update({
                share : share,
                time : new Date().getTime()
            });//set
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(ROOMID.roomid).update({
                time : new Date().getTime()
            });//set
        }else{
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                time : new Date().getTime()
            });//set
            ref.child('room').child(ROOMID.roomid).child('roomusers').child(FirebaseAuth.auth.$getAuth().uid).update({
                share : share,
                time : new Date().getTime()
            });//set
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(ROOMID.roomid).update({
                time : new Date().getTime()
            });//set
        }
    }
    //select Message
    this.referenceMessage = function () {
        return ref.child('room').child(ROOMID.roomid).child('message').orderByChild("time");
    }
    //Join User and message
    this.joinUserandMessage = function(selectLoginUser,message){
        var deferred = $q.defer();
        var usermessage = new Array();
        var i = 0;
        message.$loaded().then(function(messageData) {
            angular.forEach(messageData, function(value, key) {
                if(value.kind == "message"){
                    var user = selectLoginUser(value.key);
                    $firebaseObject(user).$loaded().then(function(userinfo) {
                        value["displayname"] = userinfo.displayname;
                        value["photoURL"] = userinfo.photoURL;
                    });
                    usermessage[i] = value;
                    i = i + 1;
                }
            });
            deferred.resolve(usermessage);
        });
        return deferred.promise;
    }
    //AddMessage
    this.registerMessage = function (kind,messageInput) {
        var postsRef = ref.child("room").child(ROOMID.roomid).child("message");
        var newPostRef = postsRef.push();
        newPostRef.set({
            key : FirebaseAuth.auth.$getAuth().uid ,
            time : new Date().getTime(),
            kind : kind,
            message : messageInput
        });//set
    }
    //Add MeetUp Marker
    this.registerMeetUpMarker = function (place) {
        var postsRef = ref.child("room").child(ROOMID.roomid).child("meetup");
        var newPostRef = postsRef.push();
        //Set meetup
        newPostRef.update({
            key : window.localStorage.getItem([ROOMID.roomid]),
            latitude : place.geometry.location.lat(),
            longitude : place.geometry.location.lng(),
            kind : "search"
        });//set
    }
    //Add MeetUp Marker from nothing
    this.registerMeetUpMarkerNothing = function () {
        var latlng = GOOGLE.googlemap.getCenter();
        var postsRef = ref.child("room").child(ROOMID.roomid).child("meetup");
        var newPostRef = postsRef.push();
        //Set meetup
        newPostRef.update({
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
    
    this.referenceUserrooms = function(){
        return ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child('rooms');
    }
    
    //Select User Room and return user room info
    this.joinUserandRoom = function(userRooms){
        var deferred = $q.defer();
        var userRoomsArray = new Array();
        var i = 0;
        userRooms.$loaded().then(function(userRoom) {
            angular.forEach(userRoom, function(value, key) {
                var room = ref.child('room').child(value.$id);
                /*
                var roomimages = storage.child('room').child(value.$id).child('roomimage').child(value.$id);
                roomimages.getDownloadURL().then(function(url) {
                    console.log(url);
                }).catch(function(error) {
                    // Handle any errors
                    console.log("error");
                });
                */
                
                $firebaseObject(room).$loaded().then(function(roominfo) {
                    value["name"] = roominfo.name;
                    value["photoURL"] = roominfo.photoURL;
                    value["description"] = roominfo.description;
                    value["userNumber"] = Object.keys(roominfo.roomusers).length;
                    if(roominfo.roomusers[FirebaseAuth.auth.$getAuth().uid]){
                        value["share"] = roominfo.roomusers[FirebaseAuth.auth.$getAuth().uid].share;
                    }
                });
                userRoomsArray[i] = value;
                i = i + 1;
            });
            deferred.resolve(userRoomsArray);
        });
        return deferred.promise;
    }
    //update MeetUp MArker
    this.updateLocationSettings = function (kind,userroom) {
        //Set meetup
        ref.child('room').child(userroom.$id).child('roomusers').child(FirebaseAuth.auth.$getAuth().uid).update({
            share : kind,
            time : new Date().getTime()
        });//set
        ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child('rooms').child(userroom.$id).update({
            time : new Date().getTime()
        });//set
    }
    //upload Room image file
    this.uploadRoomImage = function (userroominfo,imageFile){
        if(!userroominfo.description){
            userroominfo.description = "";
        }
        if(imageFile){
            var uploadTask = storage.child('room/' + userroominfo.$id + '/roomimage/' + userroominfo.$id).put(imageFile);
            uploadTask.on('state_changed', function(snapshot){
            }, function(error) {
            }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                var downloadURL = uploadTask.snapshot.downloadURL;
                console.log(downloadURL);
                ref.child('room').child(userroominfo.$id).update({
                    name : userroominfo.name,
                    photoURL : downloadURL,
                    description : userroominfo.description,
                    time : new Date().getTime()
                });//set
                ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(userroominfo.$id).update({
                    time : new Date().getTime()
                });//set
            });
        }else{
            ref.child('room').child(userroominfo.$id).update({
                name : userroominfo.name,
                description : userroominfo.description,
                time : new Date().getTime()
            });//set
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(userroominfo.$id).update({
                time : new Date().getTime()
            });//set
        }
    }
    //upload User image file
    this.uploadUserImage = function (userinfo,imageFile){
        if(!userinfo.description){
            userinfo.description = "";
        }
        if(imageFile){
            var uploadTask = storage.child('users/' + FirebaseAuth.auth.$getAuth().uid + '/userimage/' + FirebaseAuth.auth.$getAuth().uid).put(imageFile);
            uploadTask.on('state_changed', function(snapshot){
            }, function(error) {
            }, function() {
                var downloadURL = uploadTask.snapshot.downloadURL;
                ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
                    displayname : userinfo.displayname,
                    photoURL : downloadURL,
                    description : userinfo.description,
                    time : new Date().getTime()
                });//set
            });
        }else{
            ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).update({
                displayname : userinfo.displayname,
                description : userinfo.description,
                time : new Date().getTime()
            });//set
        }
    }
    //leave the particular room
    this.deleteRoomUser = function(userroom){
        ref.child('room').child(userroom.$id).child("roomusers").child(FirebaseAuth.auth.$getAuth().uid).remove();
        ref.child('users').child(FirebaseAuth.auth.$getAuth().uid).child("rooms").child(userroom.$id).remove();
    }
    
    this.test = function(){
        ref.child('.info').on('value', function(snapshot, addChildKey) {
            console.log(snapshot.val());
        });
        var idle = new Idle({
            onHidden : function(){console.log(new Date().getTime()+":User is not looking at page")},
			onVisible : function(){console.log(new Date().getTime()+":User started looking at page again")},
			onAway : function(){console.log(new Date().getTime()+":away")},
			onAwayBack : function(){console.log(new Date().getTime()+":back")},
            awayTimeout : 10000
        }).start();
    }
})
