myapp.controller('candyController', function ($scope, $firebaseObject, $firebaseArray,firebaseService,screenEventService,gpslocationService,googlemapService,popupService) {
    $('.firsthide').hide();
    $('.collapsible').collapsible();
    $('#candy_map_tab').css('min-height', 60 + "vh");
    $('#candy_map_tab').css('max-height', 60 + "vh");
    $('.flex-box').css('min-height', 40 + "vh");
    $('.flex-box').css('max-height', 40 + "vh");
    
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
                        popupService.swal_init_on(uniqueurl[2],position,function(){
                            $scope.yourId = window.localStorage.getItem(uniqueurl[2]);
                        });
                    }else{
                        yourname = window.localStorage.getItem([uniqueurl[2]+"name"]);
                        $scope.yourId = window.localStorage.getItem(uniqueurl[2]);
                        //UpdateUser
                        firebaseService.updateUser(position,uniqueurl[2],"on");
                        //set location into variable
                        setlocation(position.coords.latitude,position.coords.longitude);
                    }
                    //ifでもelseでも実行
                    var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    
                    // select User
                    var users = firebaseService.referenceUserOnce(uniqueurl[2]);
                    //init MAp
                    googlemapService.loadMap(uniqueurl[2],mylatlng);
                    $firebaseObject(users).$loaded().then(function(user) {
                        angular.forEach(user, function(value, key) {
                            if(value){
                                var difference_time = (new Date().getTime() - value["time"]) / DAY_MILLISECOND;
                                if(value["time"] && difference_time < 1){
                                    googlemapService.createMarker(value["latitude"], value["longitude"], value["name"], key,googlemapService.markercreate);
                                }
                            }
                        });
                    });
                    var infomessages = $firebaseObject(firebaseService.referenceMessage(uniqueurl[2]));
                    infomessages.$loaded().then(function() {
                        angular.forEach(infomessages, function(value, key) {
                            // create and handle info window
                            googlemapService.createInfoWindow(uniqueurl,value,key);
                            googlemapService.handleInfoWindow(uniqueurl,value,key);
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
                        popupService.swal_locationoff(function(){
                            $scope.yourId = window.localStorage.getItem(uniqueurl[2]);
                        });
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
                        // select User
                        var users = firebaseService.referenceUserOnce(uniqueurl[2]);
                        //LocationOnのユーザーのLocationを中心地として表示 init MAp
                        googlemapService.loadMap(uniqueurl[2],mylatlng);
                        $firebaseObject(users).$loaded().then(function(user) {
                            angular.forEach(user, function(value, key) {
                                if(value){
                                    var difference_time = (new Date().getTime() - value["time"]) / DAY_MILLISECOND;
                                    if(value["time"] && difference_time < 1){
                                        googlemapService.createMarker(value["latitude"], value["longitude"], value["name"], key,googlemapService.markercreate);
                                    }
                                }
                            });
                        });
                        var infomessages = $firebaseObject(firebaseService.referenceMessage(uniqueurl[2]));
                        infomessages.$loaded().then(function() {
                            angular.forEach(infomessages, function(value, key) {
                                // create and handle info window
                                googlemapService.createInfoWindow(uniqueurl,value,key);
                                googlemapService.handleInfoWindow(uniqueurl,value,key);
                            });
                        });
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
            popupService.swal_url();
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
            popupService.swal_remove_meetUpMarkers();
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
            popupService.swal_remove_meetUpMarkers();
        }
    }
    //Position
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
    // Resize for PC
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
});