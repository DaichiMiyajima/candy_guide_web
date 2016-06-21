myapp.service('candyService', function () {
    //Addmarker
    this.registerMessage = function (messageInput) {
        console.log('call method:' + messageInput);
        var key = window.localStorage.getItem([uniqueurl[2]]);
        var name = window.localStorage.getItem([name]);
        var postsRef = ref.child("sharemap").child(uniqueurl[2]).child("message");
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('sharemap').child(uniqueurl[2]).child("message").child(postID).set({
            key : key ,
            name : name,
            time : Firebase.ServerValue.TIMESTAMP,
            kind : "message",
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