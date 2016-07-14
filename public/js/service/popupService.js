myapp.service('popupService', function (firebaseService,GOOGLE,MARKER,ROOMID) {
    this.swal_init_on = function (position,callback) {
        swal({
            title: "SHARE YOUR LOCATION!",
            text: "Write your name or nickname:",
            type: "input",
            showCancelButton: false,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Write your NAME"
        }, function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to write your name!");
                return false
            }
            //AddUser
            var postID = firebaseService.registerUser(inputValue,position,"on");
            // Store session
            window.localStorage.setItem([ROOMID.roomid],[postID]);
            window.localStorage.setItem([ROOMID.roomid+"name"],[inputValue]);
            //AddMessage
            firebaseService.registerMessage("attend", window.localStorage.getItem([ROOMID.roomid+"name"]) + " attend");
            swal({
                title: "Thank you for Attend",
                type: "success",
                text: "You are " + inputValue,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
                showCancelButton: false
            },callback);
        });
    }
    this.swal_locationoff = function (callback) {
        swal({
            title: "SEE FRIEND'S LOCATION!",
            text: "Write your name or nickname:(your location doesn't share!!)",
            type: "input",
            showCancelButton: false,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Write your NAME"
        }, function(inputValue){
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("You need to write your name !!!!!");
                    return false
                }
                //CreateUser
                var postID = firebaseService.registerUser(inputValue,"","off");
                // Store session
                window.localStorage.setItem([ROOMID.roomid],[postID]);
                window.localStorage.setItem([ROOMID.roomid+"name"],[inputValue]);
                //UpdateUser
                firebaseService.registerMessage("attend",inputValue + " attend");
                swal("Nice!", "You are " + inputValue + "(your location doesn't share)", "success");
        },callback);
    }
    this.swal_url = function () {
        swal({
            title: "RIGHT?",
            text: "You url doesn't exist! Confirm right url!",
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK",
            closeOnConfirm: false
            },
        function(isConfirm){
            if (isConfirm) {
                window.location.href = "/" ;
            }
        });
    }
    this.swal_relocation = function () {
        swal({
            title: "RIGHT?",
            text: "You geolocation is off. If you can share your location, I would like yout to re-login.",
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK",
            closeOnConfirm: true,
            showCancelButton: true
            },
        function(isConfirm){
            if (isConfirm) {
                localStorage.removeItem(ROOMID.roomid);
                window.location.reload();
            }
        });
    }
    this.swal_remove_meetUpMarkers = function () {
        swal({
            title: "Remove Marker?",
            type: "warning",
            text: "You can put only one marker within your group:",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK",
            closeOnConfirm: true,
            showCancelButton: true
            },
        function(isConfirm){
            if (isConfirm) {
                //Remove Marker
                firebaseService.removeMeetUpMarker();
                GOOGLE.markers_meet = new Array();
                firebaseService.registerMessage("meetupremove",  window.localStorage.getItem([ROOMID.roomid+"name"]) + " remove marker");
            }
        });
    }
    this.swal_dragend = function (key,position,adddata) {
        swal({
            title: "Move Marker?",
            type: "warning",
            text: "Do you move marker ?",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK",
            closeOnConfirm: true,
            showCancelButton: true
            },function(isConfirm){
                if(isConfirm){
                    //update
                    firebaseService.updateMeetUpMarkerNothing(key,position);
                    firebaseService.registerMessage("meetupchange", window.localStorage.getItem([ROOMID.roomid+"name"])+" change marker");
                    //MARKER VALUE
                    MARKER.latitude = position.lat();
                    MARKER.longitude = position.lng();
                }else{
                    GOOGLE.markers_meet[key].setPosition(new google.maps.LatLng(MARKER.latitude, MARKER.longitude));
                }
            });
    }
})