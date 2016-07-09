myapp.service('gpslocationService', function (firebaseService) {
    this.currentPosition = function (watchID,uniqueurl) {
        var count = 0;
        if(watchID){
            if(watchID != "init"){
                navigator.geolocation.clearWatch(watchID);
            }
            watchID = navigator.geolocation.watchPosition(
                // onSuccess Geolocation
                function(position) {
                    //within 50m → update user
                    if(position.coords.accuracy <= 10000){
                        //UpdateUser
                        candyService.updateUser(position,uniqueurl,"on");
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
                            Materialize.toast('Accuracy of gps is bad. Try again!' , 5000, 'rounded meetupremove');
                        }
                    }
                },
                // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                function(error) {
                    Materialize.toast('Gps is error. Try again!' , 5000, 'rounded meetupremove');
                },
                {enableHighAccuracy: true,maximumAge: 1}
            );
            return watchID;
        }else{
            swal_relocation();
        }
    }
})