myapp.controller('candyController', function ($scope, $firebaseObject, $firebaseArray,candyService,screenEventService,gpslocationService) {
    $('.firsthide').hide();
    $('.collapsible').collapsible();
    messageInputHeight = $('.messageInputAreaDiv').height();
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
                    var infomessages = $firebaseObject(candyService.referenceMessage(uniqueurl[2]));
                    infomessages.$loaded().then(function() {
                        angular.forEach(infomessages, function(value, key) {
                            infoPlugins.forEach(function(plugin){
                                plugin.func.call(function(){},uniqueurl[2],value,key);
                            });
                        });
                    });
                    locationPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2]);
                    });//forEach
                    firebasePlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2]);
                    });//forEach
                    //initial css * I haveto write this code because css doesn't affect
                    $('#candy_map_tab').css('min-height', window.innerHeight*0.65 + "px");
                    $('#candy_map_tab').css('max-height', window.innerHeight*0.65 + "px");
                    $('.flex-box').css('min-height', window.innerHeight*0.35 + "px");
                    $('.flex-box').css('max-height', window.innerHeight*0.35 + "px");
                }, 
                // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                function(error) {
                    if(!window.localStorage.getItem([uniqueurl[2]])){
                        swal_locationoff(
                            function(inputValue){
                                if (inputValue === false) return false;
                                if (inputValue === "") {
                                    swal.showInputError("You need to write your name !!!!!");
                                    return false
                                }
                                var postsRef = ref.child("sharemap").child(uniqueurl[2]).child('users');
                                var newPostRef = postsRef.push();
                                var postID = newPostRef.key();
                                //CreateUser
                                candyService.registerUser(inputValue,"",uniqueurl[2],"off",postID);
                                //UpdateUser
                                candyService.registerMessage("attend",inputValue + " attend");
                                
                                // Store session
                                window.localStorage.setItem([uniqueurl[2]],[postID]);
                                window.localStorage.setItem([uniqueurl[2]+"name"],[inputValue]);
                                yourname = inputValue;
                                swal("Nice!", "You are " + inputValue + "(your location doesn't share)", "success");
                            }
                        );
                    }else{
                        //UpdateUser
                        candyService.updateUser("",uniqueurl[2],"off");
                    }
                    //Location on のユーザーがいればそのlocationを参照
                    var userlocation = candyService.referenceUserOn(uniqueurl[2]);
                    $firebaseObject(userlocation).$loaded().then(function(userlocation) {
                        var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                        angular.forEach(userlocation, function(value, key) {
                            mylatlng = new google.maps.LatLng(value.latitude, value.longitude);
                        });
                        //LocationOnのユーザーのLocationを中心地として表示
                        indexPlugins.forEach(function(plugin){
                            plugin.func.call(function(){},uniqueurl[2],mylatlng);
                        });//forEach
                        firebasePlugins.forEach(function(plugin){
                            plugin.func.call(function(){},uniqueurl[2]);
                        });//forEach
                    });
                });
            }else{
            }
        }else{
            //url doesn't exist
            swal_url();
        }
    })
    .catch(function(error) {
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
    /*
    $scope.directionDone = function(){
        directionsToMarker({lat: yourlatitude, lng: yourlongitude},{lat: markerlatitude, lng: markerlongitude},google.maps.TravelMode.WALKING,"navigationDone");
        $('#modal2').closeModal();
    }
    */
    //Make pin from Nothing
    $scope.addlocationbutton = function(){
        if(Object.keys(markers_meet).length < 1){
            candyService.registerMessage("meetup",yourname+" add marker");
            candyService.registerMeetUpMarkerNothing();
        }else{
            swal_remove_meetUpMarkers();
        }
    }
    /*
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
    */
    $scope.currentposition = function(){
        gpslocationService.currentPosition(watchID);
    }
    /* Resize */
    $scope.resizeStart = function($event){
        if(resize_count == 0){
            resize = $event.target.className;
        }
        screenEventService.resizeBar(resize,resize_count,$event);
        resize_count = resize_count +1 ;
    }
    $scope.resizeEnd = function($event){
        resize_count = 0;
        resize = "";
    }
    
    $scope.resizeStartMouse = function($event){
        if(resize_count == 0){
            resize = $event.target.className;
        }
        screenEventService.resizeBarPc(resize,resize_count,$event);
        resize_count = resize_count +1 ;
    }
    $scope.resizeEndMouse = function($event){
        resize_count = 0;
        resize = "";
    }
    //sendMessage
    $scope.sendMessage = function(messageInput){
        if(messageInput && messageInput.length > 0){
            candyService.registerMessage("message",messageInput);
            $scope.messageInput = "";
        }
    }
    $scope.onfocus = function(){
        screenEventService.onFocus();
    }
    $scope.onblur = function(){
        screenEventService.onBlur();
    }
});