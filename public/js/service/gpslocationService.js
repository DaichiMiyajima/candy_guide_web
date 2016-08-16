/*global candy, angular, Firebase */
'use strict';

candy.service('gpslocationService', function (firebaseService,popupService,ROOMID,GOOGLE) {
    this.currentPosition = function () {
        var count = 0;
        if(GOOGLE.watchID != "off"){
            if(GOOGLE.watchID != "init"){
                navigator.geolocation.clearWatch(GOOGLE.watchID);
            }
            var watchID = navigator.geolocation.watchPosition(
                // onSuccess Geolocation
                function(position) {
                    //within 50m → update user
                    if(position.coords.accuracy <= 10000){
                        //UpdateUser
                        firebaseService.updateUserLocation(position,ROOMID.roomshare);
                        if(count < 1){
                            count = count + 1;
                            //panto
                            GOOGLE.googlemap.panTo(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
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
            popupService.swal_relocation();
        }
    }
})