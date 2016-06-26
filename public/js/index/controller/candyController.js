myapp.controller('candyController', function ($scope, $firebaseObject, $firebaseArray,candyService) {
    $("[class^=firsthide]").hide();
    $('.collapsible').collapsible();
    //Init function load map and etc......
    var sharemaps = candyService.referenceSharemap();
    $firebaseObject(sharemaps).$loaded().then(function(sharemap) {
        if(sharemap[uniqueurl[2]]){
            //Set GroupName
            $scope.grouname = sharemap[uniqueurl[2]].name;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    //If session doesn't exist, sweetalert
                    if(!window.localStorage.getItem([uniqueurl[2]]) && !window.localStorage.getItem([uniqueurl[2]+"name"])){
                        swal_init_on(candyService,uniqueurl[2],ref,position);
                    }else{
                        yourname = window.localStorage.getItem([uniqueurl[2]+"name"]);
                        //UpdateUser
                        candyService.updateUser(position,uniqueurl[2],"on");
                        //set location into variable
                        setlocation(position.coords.latitude,position.coords.longitude);
                    }
                    //ifでもelseでも実行
                    var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    indexPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2],mylatlng);
                    });//forEach
                    ref.child('sharemap').child(uniqueurl[2]).child('message').once("value", function(snapshot) {
                        snapshot.forEach(function(data) {
                            infoPlugins.forEach(function(plugin){
                                plugin.func.call(function(){},uniqueurl[2],data.val(),snapshot.key());
                            });
                        });
                    })
                    locationPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2]);
                    });//forEach
                    firebasePlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2]);
                    });//forEach
                    //show function
                }, 
                // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                function(error) {
                    if(!window.localStorage.getItem([uniqueurl[2]])){
                        swal_locationoff(uniqueurl[2],ref);
                    }else{
                        ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.localStorage.getItem([uniqueurl[2]])).update({
                            share : "off",
                            time : Firebase.ServerValue.TIMESTAMP
                        });//set
                        //UpdateUser
                        candyService.updateUser("",uniqueurl[2],"off");
                    }
                    $("[id = geolocationOff]").show();
                    //Location on のユーザーがいればそのlocationを参照
                    ref.child('sharemap').child(uniqueurl[2]).child('users').orderByChild("share").equalTo("on").limitToLast(1).once("value", function(snapshot) {
                        var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                        //if length doesn't equal to 0
                        if(sharemap[uniqueurl[2]]){
                            snapshot.forEach(function(data) {
                                mylatlng = new google.maps.LatLng(data.val().latitude, data.val().longitude);
                                //ifでもelseでも実行
                                indexPlugins.forEach(function(plugin){
                                    plugin.func.call(function(){},uniqueurl[2],mylatlng);
                                });//forEach
                            });
                        }else{
                            //ifでもelseでも実行
                            indexPlugins.forEach(function(plugin){
                                plugin.func.call(function(){},uniqueurl[2],mylatlng);
                            });//forEach
                        }
                        firebasePlugins.forEach(function(plugin){
                            plugin.func.call(function(){},uniqueurl[2]);
                        });//forEach
                    })
                });
            }else{
                if(!window.localStorage.getItem([uniqueurl[2]])){
                    swal_locationoff(uniqueurl[2],ref);
                }else{
                    ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.localStorage.getItem([uniqueurl[2]])).update({
                        share : "off",
                        time : Firebase.ServerValue.TIMESTAMP
                    });//set
                }
                $("[id = geolocationOff]").show();
                //Location on のユーザーがいればそのlocationを参照
                ref.child('sharemap').child(uniqueurl[2]).child('users').orderByChild("share").equalTo("on").limitToLast(1).once("value", function(snapshot) {
                    var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                    //if length doesn't equal to 0
                    if(data[uniqueurl[2]]){
                        snapshot.forEach(function(data) {
                            mylatlng = new google.maps.LatLng(data.val().latitude, data.val().longitude);
                            //ifでもelseでも実行
                            indexPlugins.forEach(function(plugin){
                                plugin.func.call(function(){},uniqueurl[2],mylatlng);
                            });//forEach
                        });
                    }else{
                        //ifでもelseでも実行
                        indexPlugins.forEach(function(plugin){
                            plugin.func.call(function(){},uniqueurl[2],mylatlng);
                        });//forEach
                    }
                    firebasePlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2]);
                    });//forEach
                })
            }
        }else{
            //url doesn't exist
            swal_url();
        }
    })
    .catch(function(error) {
        console.error("Error:", error);
    });
    //Open messageModal
    $scope.messageModal = function(){
        $('#messageModal').openModal();
    }
    //Open placeModal
    $scope.placeModal = function(){
        $('#placeModal').openModal();
    }
    //Make pin from SearchPlace
    $scope.makeMeetUpMarker = function(place){
        if(Object.keys(markers_meet).length < 1){
            candyService.registerMeetUpMarker(place);
            //panto
            googlemap.panTo(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
            $('#modal2').closeModal();
        }else{
            swal_remove_meetUpMarkers();
        }
    }
    //Only Panto
    $scope.navigation = function(place){
        googlemap.panTo(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
    }
    // Direction Done.Delete Render
    $scope.directionDone = function(){
        directionsToMarker({lat: yourlatitude, lng: yourlongitude},{lat: markerlatitude, lng: markerlongitude},google.maps.TravelMode.WALKING,"navigationDone");
        $('#modal2').closeModal();
    }
    //Make pin from Nothing
    $scope.addlocationbutton = function(){
        if(Object.keys(markers_meet).length < 1){
            candyService.registerMessage("meetup",yourname+" add marker");
            candyService.registerMeetUpMarkerNothing();
        }else{
            swal_remove_meetUpMarkers();
        }
    }
    //Direction
    $scope.direction = function(){
        if(Object.keys(markers_meet).length > 0){
            $('#travelModeModal').openModal();
        }else{
            swal_must_register_meetupMarker();
        }
    }
    $scope.direction_car = function(){
        directionsToMarker({lat: yourlatitude, lng: yourlongitude},{lat: markerlatitude, lng: markerlongitude},google.maps.TravelMode.DRIVING,"navigation");
        travelMode = google.maps.TravelMode.DRIVING;
        $('#travelModeModal').closeModal();
    }
    $scope.direction_walk = function(){
        directionsToMarker({lat: yourlatitude, lng: yourlongitude},{lat: markerlatitude, lng: markerlongitude},google.maps.TravelMode.WALKING,"navigation");
        travelMode = google.maps.TravelMode.WALKING;
        $('#travelModeModal').closeModal();
    }
    $scope.directionDone = function(){
        directionsToMarker({lat: yourlatitude, lng: yourlongitude},{lat: markerlatitude, lng: markerlongitude},google.maps.TravelMode.WALKING,"navigationDone");
    }
    $scope.currentposition = function(){
        var count = 0;
        if(watchID){
            navigator.geolocation.clearWatch(watchID);
            watchID = navigator.geolocation.watchPosition(
                // onSuccess Geolocation
                function(position) {
                    //within 50m → update user
                    if(position.coords.accuracy <= 5000){
                        //UpdateUser
                        candyService.updateUser(position,uniqueurl[2],"on");
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
        }else{
            swal_relocation();
        }
    }
});