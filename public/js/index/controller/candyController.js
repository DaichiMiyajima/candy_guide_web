myapp.controller('candyController', function ($scope, $firebaseObject, $firebaseArray,firebaseService,screenEventService,gpslocationService,googlemapService) {
    $('.firsthide').hide();
    $('.collapsible').collapsible();
    messageInputHeight = $('.messageInputAreaDiv').height();
    //Init function load map and etc......
    var sharemaps = firebaseService.referenceSharemap();
    $firebaseObject(sharemaps).$loaded().then(function(sharemap) {
        if(sharemap[uniqueurl[2]]){
            //Set GroupName
            $scope.grouname = sharemap[uniqueurl[2]].name;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    //If session doesn't exist, sweetalert
                    if(!window.localStorage.getItem([uniqueurl[2]]) && !window.localStorage.getItem([uniqueurl[2]+"name"])){
                        swal_init_on(firebaseService,uniqueurl[2],ref,position);
                    }else{
                        yourname = window.localStorage.getItem([uniqueurl[2]+"name"]);
                        //UpdateUser
                        firebaseService.updateUser(position,uniqueurl[2],"on");
                        //set location into variable
                        setlocation(position.coords.latitude,position.coords.longitude);
                    }
                    //ifでもelseでも実行
                    var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    //init MAp
                    googlemapService.loadMap(uniqueurl[2],mylatlng);
                    
                    var infomessages = $firebaseObject(firebaseService.referenceMessage(uniqueurl[2]));
                    infomessages.$loaded().then(function() {
                        angular.forEach(infomessages, function(value, key) {
                            infoPlugins.forEach(function(plugin){
                                plugin.func.call(function(){},uniqueurl[2],value,key);
                            });
                        });
                    });
                    
                    //watch position
                    watchID = gpslocationService.currentPosition("init",uniqueurl[2]);
                    //watch add user
                    firebaseService.referenceAddUser(uniqueurl[2]);
                    //watch change user
                    firebaseService.referenceChangeUser(uniqueurl[2]);
                    //watch addmessage
                    firebaseService.referenceAddMessage(uniqueurl[2]);
                    //watch addmessage
                    firebaseService.referenceAddMeetup(uniqueurl[2]);
                    //watch changemessage
                    firebaseService.referenceChangeMeetup(uniqueurl[2]);
                    //watch Removemessage
                    firebaseService.referenceRemoveMeetup(uniqueurl[2]);
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
                                firebaseService.registerUser(inputValue,"",uniqueurl[2],"off",postID);
                                //UpdateUser
                                firebaseService.registerMessage("attend",inputValue + " attend");
                                
                                // Store session
                                window.localStorage.setItem([uniqueurl[2]],[postID]);
                                window.localStorage.setItem([uniqueurl[2]+"name"],[inputValue]);
                                yourname = inputValue;
                                swal("Nice!", "You are " + inputValue + "(your location doesn't share)", "success");
                            }
                        );
                    }else{
                        //UpdateUser
                        firebaseService.updateUser("",uniqueurl[2],"off");
                    }
                    //Location on のユーザーがいればそのlocationを参照
                    var userlocation = firebaseService.referenceUserOn(uniqueurl[2]);
                    $firebaseObject(userlocation).$loaded().then(function(userlocation) {
                        var mylatlng = new google.maps.LatLng("35.690921", "139.700258");
                        angular.forEach(userlocation, function(value, key) {
                            mylatlng = new google.maps.LatLng(value.latitude, value.longitude);
                        });
                        //LocationOnのユーザーのLocationを中心地として表示
                        indexPlugins.forEach(function(plugin){
                            plugin.func.call(function(){},uniqueurl[2],mylatlng);
                        });//forEach
                        
                        //watch add user
                        firebaseService.referenceAddUser(uniqueurl[2]);
                        //watch change user
                        firebaseService.referenceChangeUser(uniqueurl[2]);
                        //watch addmessage
                        firebaseService.referenceAddMessage(uniqueurl[2]);
                        //watch addmessage
                        firebaseService.referenceAddMeetup(uniqueurl[2]);
                        //watch changemessage
                        firebaseService.referenceChangeMeetup(uniqueurl[2]);
                        //watch Removemessage
                        firebaseService.referenceRemoveMeetup(uniqueurl[2]);
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
            firebaseService.registerMeetUpMarker(place);
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
    //Make pin from Nothing
    $scope.addlocationbutton = function(){
        if(Object.keys(markers_meet).length < 1){
            firebaseService.registerMessage("meetup",yourname+" add marker");
            firebaseService.registerMeetUpMarkerNothing();
        }else{
            swal_remove_meetUpMarkers();
        }
    }
    $scope.currentposition = function(){
        watchID = gpslocationService.currentPosition(watchID,uniqueurl[2]);
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
            firebaseService.registerMessage("message",messageInput);
            $scope.messageInput = "";
        }
    }
    $scope.onfocus = function(){
        screenEventService.onFocus();
    }
    $scope.onblur = function(){
        screenEventService.onBlur();
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
    // Direction Done.Delete Render
    /*
    $scope.directionDone = function(){
        directionsToMarker({lat: yourlatitude, lng: yourlongitude},{lat: markerlatitude, lng: markerlongitude},google.maps.TravelMode.WALKING,"navigationDone");
        $('#modal2').closeModal();
    }
    */
});