(function(){
    console.log(window.navigator.userAgent.toLowerCase());
    if(window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1){
    }else if(window.navigator.userAgent.toLowerCase().indexOf('safari') != -1){
        if(window.navigator.userAgent.toLowerCase().indexOf('iphone') != -1){
            $("#map").css("height","83vh");
        }
    }
    
    
    $("#messagebutton").click(function(){
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
                var key = window.sessionStorage.getItem([uniqueurl[2]]);
                var name = window.sessionStorage.getItem([name]);
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
    });
})()
