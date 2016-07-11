myapp.service('popupService', function (firebaseService) {
    this.swal_init_on = function (uniqueurl,position,callback) {
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
            var postsRef = ref.child("sharemap").child(uniqueurl).child('users');
            var newPostRef = postsRef.push();
            var postID = newPostRef.key();
            //AddUser
            firebaseService.registerUser(inputValue,position,uniqueurl,"on",postID);
            // Store session
            window.localStorage.setItem([uniqueurl],[postID]);
            window.localStorage.setItem([uniqueurl+"name"],[inputValue]);
            yourname = inputValue;
            //AddMessage
            firebaseService.registerMessage("attend",yourname + " attend");
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
                var postsRef = ref.child("sharemap").child(uniqueurl[2]).child('users');
                var newPostRef = postsRef.push();
                var postID = newPostRef.key();
                //CreateUser
                firebaseService.registerUser(inputValue,"",uniqueurl[2],"off",postID);
                // Store session
                window.localStorage.setItem([uniqueurl[2]],[postID]);
                window.localStorage.setItem([uniqueurl[2]+"name"],[inputValue]);
                //UpdateUser
                firebaseService.registerMessage("attend",inputValue + " attend");
                yourname = inputValue;
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
                localStorage.removeItem(uniqueurl);
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
                ref.child('sharemap').child(uniqueurl[2]).child("meetup").remove();
                delete(markers_meet);
                //Delete route
                if(directionsDisplayArray[direction_number]){
                    directionsDisplayArray[direction_number].setMap(null);
                    directionsDisplayArray[direction_number].setDirections(null);
                }
                firebaseService.registerMessage("meetupremove", yourname + " remove marker");
            }
        });
    }
    this.swal_dragend = function (uniqueurl,key,position) {
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
                    setmarkerlocation(position.lat(),position.lng());
                }else{
                    markers_meet[key].setPosition(new google.maps.LatLng(markerlatitude, markerlongitude));
                }
            });
    }
})