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
                    if(position.coords.accuracy <= 100){
                        ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.localStorage.getItem([uniqueurl[2]])).update({
                            latitude : position.coords.latitude,
                            longitude : position.coords.longitude
                        });//set
                        yourlatitude = position.coords.latitude;
                        yourlongitude = position.coords.longitude;
                        
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
                    toastr.error('Accuracy of gps is bad. Try again!');
                },
                {enableHighAccuracy: true,maximumAge: 0}
            );
        }else{
            swal_relocation();
            $('#currentposition').css("background","rgb(255,110,64)");
            $('#spin').removeClass("is-active");
        }
    });

    $("#addlocationbutton").click(function(){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(yourlatitude, yourlongitude),
            map: googlemap,
            draggable: true
        });
        markers_meet[window.localStorage.getItem([uniqueurl[2]])] = marker;
        google.maps.event.addListener(
            markers[window.localStorage.getItem([uniqueurl[2]])],
            'drag',
        function(event) {
            if(infoWindows_meet[window.localStorage.getItem([uniqueurl[2]])]){
                infoWindows_meet[window.localStorage.getItem([uniqueurl[2]])].close();
            }
        });
        google.maps.event.addListener(
            markers[window.localStorage.getItem([uniqueurl[2]])],
            'dragend',
        function(event) {
            if(infoWindows_meet[window.localStorage.getItem([uniqueurl[2]])]){
                infoWindows_meet[window.localStorage.getItem([uniqueurl[2]])].position=new google.maps.LatLng(this.position.lat(), this.position.lng());
                infoWindows_meet[window.localStorage.getItem([uniqueurl[2]])].open(googlemap);
                
            }
        });
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
