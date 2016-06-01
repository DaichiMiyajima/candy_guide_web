(function(){
    $('#messagebox_slide').hide();

    var crios = !!navigator.userAgent.match(/crios/i);
    var safari = !!navigator.userAgent.match(/safari/i);
    var iphone = !!navigator.userAgent.match(/iphone/i);
    if(safari && !crios && iphone){
        $("#map").css("height","83vh");
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

    $("#currentposition").click(function(){
        $('#currentposition').css("background","black");
        navigator.geolocation.clearWatch(watchID);
        watchID = navigator.geolocation.watchPosition(
            // onSuccess Geolocation
            function(position) {
                //within 50m → update user
                if(position.coords.accuracy <= 100){
                    ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.sessionStorage.getItem([uniqueurl[2]])).update({
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    });//set
                }
                $('#currentposition').css("background","rgb(83,109,254)");
            },
            // エラー時のコールバック関数は PositionError オブジェクトを受けとる
            function(error) {console.log(error);},
            {enableHighAccuracy: true,maximumAge: 0}
        );
    });

    $("#messageaccount").click(function(){
        toastr.remove();
        toastr.clear()
        $('#messagebox_slide').show();
    });

    $("#map").click(function(){
        $('#messagebox_slide').hide();
    });
})()
