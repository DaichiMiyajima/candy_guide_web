myapp.service('candyService', function () {
    //SelectSharemap
    this.referenceSharemap = function(){
        return ref.child('sharemap');
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
        }else{
        }
        ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.localStorage.getItem([uniqueurl])).update({
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
            share : share,
            time : Firebase.ServerValue.TIMESTAMP
        });//set
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