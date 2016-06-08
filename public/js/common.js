function swal_init(uniqueurl,ref){
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
        var postsRef = ref.child("sharemap").child(uniqueurl[2]).child('users');
        var newPostRef = postsRef.push();
        var postID = newPostRef.key();
        ref.child('sharemap').child(uniqueurl[2]).child('users').child(postID).set({
            name : inputValue,
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });//set
        var postsmessageRef = ref.child("sharemap").child(uniqueurl[2]).child('message');
        var newmessagePostRef = postsmessageRef.push();
        var messagepostID = newmessagePostRef.key();
        ref.child('sharemap').child(uniqueurl[2]).child('message').child(messagepostID).set({
            key : postID ,
            name : inputValue,
            time : Firebase.ServerValue.TIMESTAMP,
            kind : "attend",
            message : inputValue + " attend"
        });//set
        // Store session
        window.localStorage.setItem([uniqueurl[2]],[postID]);
        window.localStorage.setItem([name],[inputValue]);
        swal("Nice!", "You are " + inputValue, "success");
    });
}
