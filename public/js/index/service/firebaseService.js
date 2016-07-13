myapp.service('firebaseService', function (googlemapService,FIREBASE_URL,GOOGLE,ROOMURL) {
    var ref = new Firebase(FIREBASE_URL); 
    
    //SelectUser once
    this.referenceUserOnce = function(ROOMURL){
        return ref.child('sharemap').child(ROOMURL).child('users').orderByChild("share").equalTo("on");
    }
    //watch add user
    this.referenceAddUser = function(ROOMURL){
        ref.child('sharemap').child(ROOMURL).child('users').orderByChild("share").equalTo("on").on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            var difference_time = (new Date().getTime()-adddata["time"]) / (1000 * 60 * 60 * 24);
            if(adddata["time"] && difference_time < 1){
                googlemapService.createMarker(adddata.latitude, adddata.longitude, adddata.name, snapshot.key(),googlemapService.markercreate);
            }
        });
    }
    //watch change user
    this.referenceChangeUser = function(ROOMURL){
        ref.child('sharemap').child(ROOMURL).child('users').orderByChild("share").equalTo("on").on('child_changed', function(snapshot, changeChildKey) {
            var changedata = snapshot.val();
            googlemapService.changeMarker(changedata,snapshot.key());
        });
    }
    //watch addmessage
    this.referenceAddMessage = function(ROOMURL){
        ref.child('sharemap').child(ROOMURL).child('message').limitToLast(1).on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            // create and handle info window
            googlemapService.createInfoWindow(adddata,snapshot.key());
            googlemapService.handleInfoWindow(adddata,snapshot.key());
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
    this.referenceAddMeetup = function(ROOMURL){
        ref.child('sharemap').child(ROOMURL).child('meetup').on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            //create meetup
            googlemapService.meetupCreateMarkers(adddata,snapshot.key(),function(){});
        });
    }
    //watch addmeetup
    this.referenceChangeMeetup = function(ROOMURL){
        ref.child('sharemap').child(ROOMURL).child('meetup').on('child_changed', function(snapshot, changeChildKey) {
            var changedata = snapshot.val();
            //change meetup
            googlemapService.meetupChangeMarkers(changedata,snapshot.key());
        });
    }
    //watch removemeetup
    this.referenceRemoveMeetup = function(ROOMURL){
        ref.child('sharemap').child(ROOMURL).child('meetup').on('child_removed', function(snapshot, changeChildKey) {
            var removedata = snapshot.val();
            //Remove meetup
            googlemapService.meetupRemoveMarkers(removedata,snapshot.key());
            
        });
    }

    //SelectSharemap
    this.referenceSharemap = function(){
        return ref.child('sharemap');
    }
    //select User for getting location
    this.referenceUserOn = function (ROOMURL) {
        return ref.child('sharemap').child(ROOMURL).child('users').orderByChild("share").equalTo("on").limitToLast(1);
    }
    //AddUser
    this.registerUser = function (name,position,share) {
        var postsRef = ref.child("sharemap").child(ROOMURL).child('users');
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        if(position){
            ref.child('sharemap').child(ROOMURL).child('users').child(postID).set({
                name : name,
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }else{
            ref.child('sharemap').child(ROOMURL).child('users').child(postID).set({
                name : name,
                latitude : "",
                longitude : "",
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }
        return postID;
    }
    //UpdateUSer
    this.updateUser = function (position,ROOMURL,share) {
        if(position){
            ref.child('sharemap').child(ROOMURL).child('users').child(window.localStorage.getItem([ROOMURL])).update({
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }else{
            ref.child('sharemap').child(ROOMURL).child('users').child(window.localStorage.getItem([ROOMURL])).update({
                latitude : "",
                longitude : "",
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }
    }
    //select Message
    this.referenceMessage = function (ROOMURL) {
        return ref.child('sharemap').child(ROOMURL).child('message').orderByChild("time");
    }
    //AddMessage
    this.registerMessage = function (kind,messageInput) {
        var postsRef = ref.child("sharemap").child(ROOMURL).child("message");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('sharemap').child(ROOMURL).child("message").child(postID).set({
            key : window.localStorage.getItem([ROOMURL]) ,
            name : window.localStorage.getItem([ROOMURL+"name"]),
            time : Firebase.ServerValue.TIMESTAMP,
            kind : kind,
            message : messageInput
        });//set
    }
    //Add MeetUp MArker
    this.registerMeetUpMarker = function (place) {
        var postsRef = ref.child("sharemap").child(ROOMURL).child("meetup");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        //Set meetup
        ref.child('sharemap').child(ROOMURL).child('meetup').child(postID).update({
            key : window.localStorage.getItem([ROOMURL]),
            latitude : place.geometry.location.lat(),
            longitude : place.geometry.location.lng(),
            kind : "search"
        });//set
    }
    //Add MeetUp MArker from nothing
    this.registerMeetUpMarkerNothing = function () {
        var latlng = GOOGLE.googlemap.getCenter();
        var postsRef = ref.child("sharemap").child(ROOMURL).child("meetup");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        //Set meetup
        ref.child('sharemap').child(ROOMURL).child('meetup').child(postID).update({
            key : window.localStorage.getItem([ROOMURL]),
            latitude : latlng.lat(),
            longitude : latlng.lng(),
            kind : "nothing"
        });//set
    }
    //update MeetUp MArker
    this.updateMeetUpMarkerNothing = function (key,position) {
        //Set meetup
        ref.child('sharemap').child(ROOMURL).child('meetup').child(key).update({
            latitude : position.lat(),
            longitude : position.lng()
        });//set
    }
    this.removeMeetUpMarker = function(){
        ref.child('sharemap').child(ROOMURL).child("meetup").remove();
    }
})