function swal_init_on(uniqueurl,ref,position){
    swal({
        title: "SHARE YOUR LOCATION!",
        text: "Write your name or nickname:",
        type: "input",
        showCancelButton: false,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write your NAME"
    }, function(inputValue){
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("You need to write your name!");
            return false
        }
        var postsRef = ref.child("sharemap").child(uniqueurl).child('users');
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('sharemap').child(uniqueurl).child('users').child(postID).set({
            name : inputValue,
            latitude : position.coords.latitude,
            longitude : position.coords.longitude,
            share : "on"
        });//set
        var postsmessageRef = ref.child("sharemap").child(uniqueurl).child('message');
        var newmessagePostRef = postsmessageRef.push();
        var messagepostID = newmessagePostRef.key();
        ref.child('sharemap').child(uniqueurl).child('message').child(messagepostID).set({
            key : postID ,
            name : inputValue,
            time : Firebase.ServerValue.TIMESTAMP,
            kind : "attend",
            message : inputValue + " attend"
        });//set
        // Store session
        window.localStorage.setItem([uniqueurl],[postID]);
        window.localStorage.setItem([name],[inputValue]);
        swal("Nice!", "You are " + inputValue, "success");
    });
}

function swal_locationoff(uniqueurl,ref){
    swal({
        title: "SEE FRIEND'S LOCATION!",
        text: "Write your name or nickname:(your location doesn't share)",
        type: "input",
        showCancelButton: false,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write your NAME"
    }, function(inputValue){
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("You need to write your name!");
            return false
        }
        var postsRef = ref.child("sharemap").child(uniqueurl).child('users');
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('sharemap').child(uniqueurl).child('users').child(postID).set({
            name : inputValue,
            latitude : "",
            longitude : "",
            share : "off"
        });//set
        var postsmessageRef = ref.child("sharemap").child(uniqueurl).child('message');
        var newmessagePostRef = postsmessageRef.push();
        var messagepostID = newmessagePostRef.key();
        ref.child('sharemap').child(uniqueurl).child('message').child(messagepostID).set({
            key : postID ,
            name : inputValue,
            time : Firebase.ServerValue.TIMESTAMP,
            kind : "attend",
            message : inputValue + " attend"
        });//set
        // Store session
        window.localStorage.setItem([uniqueurl],[postID]);
        window.localStorage.setItem([name],[inputValue]);
        swal("Nice!", "You are " + inputValue + "(your location doesn't share)", "success");
    });
}

function swal_url(){
    swal({
        title: "RIGHT?",
        text: "You url doesn't exist! Confirm right url!",
        type: "warning",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK",
        closeOnConfirm: false
        },
    function(isConfirm){
        if (isConfirm) {
            window.location.href = "/" ;
        }
    });
}

function swal_relocation(){
    swal({
        title: "RIGHT?",
        text: "You geolocation is off. If you can share your location, I would like yout to re-login.",
        type: "warning",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK",
        closeOnConfirm: true,
        showCancelButton: true
        },
    function(isConfirm){
        if (isConfirm) {
            localStorage.removeItem(uniqueurl);
            window.location.reload();
        }
    });
}

function swal_addmessage(){
    swal({
        title: "SHARE YOUR MESSAGE!",
        text: "Write your message:",
        type: "input",
        showCancelButton: true,
        animation: "slide-from-top",
        inputPlaceholder: "Write your NAME",
        closeOnConfirm: true,
        closeOnCancel: true
    }, function(inputValue){
        if (inputValue === false) return false;
        if (inputValue !== "") {
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
            message : inputValue
        });//set
        }
    });
}


function swal_remove_meetUpMarker(key){
    swal({
        title: "Remove Marker?",
        type: "warning",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK",
        closeOnConfirm: true,
        showCancelButton: true
        },
    function(isConfirm){
        if (isConfirm) {
            ref.child('sharemap').child(uniqueurl[2]).child("meetup").child(key).remove();
        }
    });
}

function swal_remove_meetUpMarkers(){
    swal({
        title: "Remove Marker?",
        type: "warning",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK",
        closeOnConfirm: true,
        showCancelButton: true
        },
    function(isConfirm){
        if (isConfirm) {
            ref.child('sharemap').child(uniqueurl[2]).child("meetup").remove();
            //Delete route
            if(directionsDisplay){
                directionsDisplay.setMap(null);
                directionsDisplay.setDirections(null);
            }
            var postsmessageRef = ref.child("sharemap").child(uniqueurl[2]).child('message');
            var newmessagePostRef = postsmessageRef.push();
            var messagepostID = newmessagePostRef.key();
            ref.child('sharemap').child(uniqueurl[2]).child('message').child(messagepostID).set({
                key : window.localStorage.getItem([uniqueurl[2]]),
                name : window.localStorage.getItem([name]),
                time : Firebase.ServerValue.TIMESTAMP,
                kind : "meetupremove",
                message : window.localStorage.getItem([name]) + " remove marker"
            });//set
        }
    });
}

