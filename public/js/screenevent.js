(function(){
    var crios = !!navigator.userAgent.match(/crios/i);
    var safari = !!navigator.userAgent.match(/safari/i);
    var iphone = !!navigator.userAgent.match(/iphone/i);
    var line = !!navigator.userAgent.match(/Line/i);
    
    if(safari && !crios && iphone && !line){
        $("#map").css("height","83vh");
    }

    $("#messagebutton").click(function(){
        swal_addmessage();
    });

    $("#currentposition").click(function(){
        $('#currentposition').css("background","white");
        $('#spin').addClass("is-active");
        var count = 0;
        if(watchID){
            navigator.geolocation.clearWatch(watchID);
            watchID = navigator.geolocation.watchPosition(
                // onSuccess Geolocation
                function(position) {
                    //within 50m → update user
                    if(position.coords.accuracy <= 5000){
                        ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.localStorage.getItem([uniqueurl[2]])).update({
                            latitude : position.coords.latitude,
                            longitude : position.coords.longitude
                        });//set
                        //set location into variable
                        setlocation(position.coords.latitude,position.coords.longitude);
                        if(count < 1){
                            count = count + 1;
                            //panto
                            googlemap.panTo(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                        }
                    }else{
                        if(count < 1){
                            count = count + 1;
                            toastr.clear();
                            toastr.error('Accuracy of gps is bad. Try again!');
                        }
                    }
                    //最低限1秒続ける
                    setTimeout(function loop(){
                        $('#currentposition').css("background","rgb(255,110,64)");
                        $('#spin').removeClass("is-active");
                    },2000);
                },
                // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                function(error) {
                    toastr.clear();
                    toastr.error('Gps is error. Try again!');
                },
                {enableHighAccuracy: true,maximumAge: 1}
            );
        }else{
            swal_relocation();
            $('#currentposition').css("background","rgb(255,110,64)");
            $('#spin').removeClass("is-active");
        }
    });

    $("#addlocationbutton").click(function(){
        toastr.clear();
        $('#placeSearch').show();
        /*
        if(Object.keys(markers_meet).length < 1){
            var latlng = googlemap.getCenter();
            var postsRef = ref.child("sharemap").child(uniqueurl[2]).child("meetup");
            var newPostRef = postsRef.push();
            var postID = newPostRef.key();
            //Set meetup
            ref.child('sharemap').child(uniqueurl[2]).child('meetup').child(postID).update({
                key : window.localStorage.getItem([uniqueurl[2]]),
                latitude : latlng.lat(),
                longitude : latlng.lng()
            });//set
            
            setmarkerlocation(latlng.lat(),latlng.lng());
            
            var postsmessageRef = ref.child("sharemap").child(uniqueurl[2]).child('message');
            var newmessagePostRef = postsmessageRef.push();
            var messagepostID = newmessagePostRef.key();
            //set message
            ref.child('sharemap').child(uniqueurl[2]).child('message').child(messagepostID).set({
                key : window.localStorage.getItem([uniqueurl[2]]),
                name : window.localStorage.getItem([name]),
                time : Firebase.ServerValue.TIMESTAMP,
                kind : "meetup",
                message : window.localStorage.getItem([name]) + " add marker"
            });//set
        }else{
            swal_remove_meetUpMarkers();
        }
        */
    });

    $("#messageaccount").click(function(){
        toastr.remove();
        toastr.clear()
        $('#messagebox_all').show();
    });

    $("#messagebox_overlay").click(function(){
        $('#messagebox_all').hide();
    });
    /*
    $("#usercount").click(function(){
        toastr.remove();
        toastr.clear()
        $('#userbox_all').show();
    });

    $("#userbox_overlay").click(function(){
        $('#userbox_all').hide();
    });
    */
})()
