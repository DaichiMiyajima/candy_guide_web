myapp.service('firebaseService', function () {
    //SelectUser once
    this.referenceUserOnce = function(uniqueurl){
        return ref.child('sharemap').child(uniqueurl).child('users').orderByChild("share").equalTo("on");
    }
    //watch add user
    this.referenceAddUser = function(uniqueurl){
        ref.child('sharemap').child(uniqueurl).child('users').orderByChild("share").equalTo("on").on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            var difference_time = (new Date().getTime()-adddata["time"]) / DAY_MILLISECOND;
            if(adddata["time"] && difference_time < 1){
                addPlugins.forEach(function(plugin){
                    plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
                });
            }
        });
    }
    //watch change user
    this.referenceChangeUser = function(uniqueurl){
        ref.child('sharemap').child(uniqueurl).child('users').on('child_changed', function(snapshot, changeChildKey) {
            var changedata = snapshot.val();
            changePlugins.forEach(function(plugin){
                plugin.func.call(function(){},uniqueurl,changedata,snapshot.key());
            });
        });
    }
    //watch addmessage
    this.referenceAddMessage = function(uniqueurl){
        ref.child('sharemap').child(uniqueurl).child('message').limitToLast(1).on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            infoPlugins.forEach(function(plugin){
                plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
            });
            if(adddata.kind=="message"){
                Materialize.toast("[" + adddata.name + "]" + " : " + adddata.message, 5000, 'rounded message') 
            }else if(adddata.kind=="attend" || adddata.kind=="meetup"){
                Materialize.toast(adddata.message , 5000, 'rounded attend meetup');
            }else if(adddata.kind=="meetupremove"){
                Materialize.toast(adddata.message , 5000, 'rounded meetupremove');
            }
        });
    }
    //watch addmeetup
    this.referenceAddMeetup = function(uniqueurl){
        ref.child('sharemap').child(uniqueurl).child('meetup').on('child_added', function(snapshot, addChildKey) {
            var adddata = snapshot.val();
            addmeetupPlugins.forEach(function(plugin){
                plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
            });
        });
    }
    //watch addmeetup
    this.referenceChangeMeetup = function(uniqueurl){
        ref.child('sharemap').child(uniqueurl).child('meetup').on('child_changed', function(snapshot, changeChildKey) {
            var changedata = snapshot.val();
            changemeetupPlugins.forEach(function(plugin){
                plugin.func.call(function(){},uniqueurl,changedata,snapshot.key());
            });
        });
    }
    //watch removemeetup
    this.referenceRemoveMeetup = function(uniqueurl){
        ref.child('sharemap').child(uniqueurl).child('meetup').on('child_removed', function(snapshot, changeChildKey) {
            var removedata = snapshot.val();
            removemeetupPlugins.forEach(function(plugin){
                plugin.func.call(function(){},uniqueurl,removedata,snapshot.key());
            });
        });
    }

    //SelectSharemap
    this.referenceSharemap = function(){
        return ref.child('sharemap');
    }
    //select User for getting location
    this.referenceUserOn = function (uniqueurl) {
        return ref.child('sharemap').child(uniqueurl).child('users').orderByChild("share").equalTo("on").limitToLast(1);
    }
    //AddUser
    this.registerUser = function (name,position,uniqueurl,share,postID) {
        if(position){
            ref.child('sharemap').child(uniqueurl).child('users').child(postID).set({
                name : name,
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }else{
            ref.child('sharemap').child(uniqueurl).child('users').child(postID).set({
                name : name,
                latitude : "",
                longitude : "",
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }
    }
    //UpdateUSer
    this.updateUser = function (position,uniqueurl,share) {
        if(position){
            ref.child('sharemap').child(uniqueurl).child('users').child(window.localStorage.getItem([uniqueurl])).update({
                latitude : position.coords.latitude,
                longitude : position.coords.longitude,
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }else{
            ref.child('sharemap').child(uniqueurl).child('users').child(window.localStorage.getItem([uniqueurl])).update({
                latitude : "",
                longitude : "",
                share : share,
                time : Firebase.ServerValue.TIMESTAMP
            });//set
        }
    }
    //select Message
    this.referenceMessage = function (uniqueurl) {
        return ref.child('sharemap').child(uniqueurl).child('message').orderByChild("time");
    }
    //AddMessage
    this.registerMessage = function (kind,messageInput) {
        var key = window.localStorage.getItem([uniqueurl[2]]);
        var postsRef = ref.child("sharemap").child(uniqueurl[2]).child("message");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('sharemap').child(uniqueurl[2]).child("message").child(postID).set({
            key : key ,
            name : yourname,
            time : Firebase.ServerValue.TIMESTAMP,
            kind : kind,
            message : messageInput
        });//set
    }
    //Add MeetUp MArker
    this.registerMeetUpMarker = function (place) {
        var postsRef = ref.child("sharemap").child(uniqueurl[2]).child("meetup");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        //Set meetup
        ref.child('sharemap').child(uniqueurl[2]).child('meetup').child(postID).update({
            key : window.localStorage.getItem([uniqueurl[2]]),
            latitude : place.geometry.location.lat(),
            longitude : place.geometry.location.lng(),
            kind : "search"
        });//set
    }
    //Add MeetUp MArker from nothing
    this.registerMeetUpMarkerNothing = function () {
        var latlng = googlemap.getCenter();
        var postsRef = ref.child("sharemap").child(uniqueurl[2]).child("meetup");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        //Set meetup
        ref.child('sharemap').child(uniqueurl[2]).child('meetup').child(postID).update({
            key : window.localStorage.getItem([uniqueurl[2]]),
            latitude : latlng.lat(),
            longitude : latlng.lng(),
            kind : "nothing"
        });//set
    }
})