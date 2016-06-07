google.maps.event.addDomListener(window, 'load', init);

// Firebase
var ref = new Firebase("https://candyguide.firebaseio.com/");
var pathname = window.location.pathname;
var uniqueurl = pathname.split("/");
var mes = new Array();

var myapp = angular.module('mapper', ["firebase"]);

//setting of toastr
toastr.options.closeButton = true; 
toastr.options.timeOut = 35000;

/* When loading screen */
function init() {
    //judge exist or not
    ref.child('sharemap').once("value", function(snapshot) {
        if(snapshot.val() && uniqueurl[2] in snapshot.val()){
            //Set GroupName
            var groupname = snapshot.val()[uniqueurl[2]].name;
            $(".title span").text(groupname);
            $(".title span").attr("data-shadow-text", groupname);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    //If session doesn't exist, sweetalert
                    if(!window.localStorage.getItem([uniqueurl[2]])){
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
                            var postsRef = ref.child("sharemap").child(uniqueurl[2]).child('users');
                            var newPostRef = postsRef.push();
                            var postID = newPostRef.key();
                            ref.child('sharemap').child(uniqueurl[2]).child('users').child(postID).set({
                                name : inputValue,
                                latitude : position.coords.latitude,
                                longitude : position.coords.longitude
                            });//set
                            var postsmessageRef = ref.child("sharemap").child(uniqueurl[2]).child('message');
                            var newmessagePostRef = postsmessageRef.push();
                            var messagepostID = newmessagePostRef.key();
                            ref.child('sharemap').child(uniqueurl[2]).child('message').child(messagepostID).set({
                                key : postID ,
                                name : inputValue,
                                time : Firebase.ServerValue.TIMESTAMP,
                                kind : "attend",
                                message : inputValue + " attend"
                            });//set
                            // Store session
                            window.localStorage.setItem([uniqueurl[2]],[postID]);
                            window.localStorage.setItem([name],[inputValue]);
                            swal("Nice!", "You are " + inputValue, "success");
                        });
                    }else{
                        //when re-loading, update location
                        ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.localStorage.getItem([uniqueurl[2]])).update({
                            latitude : position.coords.latitude,
                            longitude : position.coords.longitude
                        });//set
                    }
                    //ifでもelseでも実行
                    indexPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2],position);
                    });//forEach
                    
                    //create infowindow(common)
                    ref.child('sharemap').child(uniqueurl[2]).child('message').once("value", function(snapshot) {
                        snapshot.forEach(function(data) {
                            infoPlugins.forEach(function(plugin){
                                plugin.func.call(function(){},uniqueurl[2],data.val(),snapshot.key());
                            });
                        });
                    })
                    firebasePlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl[2]);
                    });//forEach
                    
                });
            }else{
                 //popup
                 swal({
                    title: "GPS FUNCTION",
                    text: "Turn on location",
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                    },
                 function(isConfirm){
                    if (isConfirm) {
                        window.location.reload();
                    }
                 });
            }
        }else{
            //popup
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
    });//end ref(initial)
}


myapp.controller('messageController', function ($scope, $firebaseArray) {
    var message = ref.child('sharemap').child(uniqueurl[2]).child('message').orderByChild("time");
    $scope.yourid = window.localStorage.getItem([uniqueurl[2]]);
    $scope.messages = $firebaseArray(message);
});

myapp.controller('messagecon', function ($scope, $firebaseArray) {
    var messages = ref.child('sharemap').child(uniqueurl[2]).child('message').orderByChild("kind");
    $scope.messagesnumber = $firebaseArray(messages);
});

/*
myapp.controller('userController', function ($scope, $q , $firebaseArray) {
    var your_latitude;
    var your_longitude;
    var geocoder = new google.maps.Geocoder;
    var user = ref.child('sharemap').child(uniqueurl[2]).child('users').orderByChild("time");
    var angularuser = $firebaseArray(user);
    // to take an action after the data loads, use the $loaded() promise
    angularuser.$loaded().then(function() {
         var i = 0;
         var data = [];
        // To iterate the key/value pairs of the object, use angular.forEach()
        angular.forEach(angularuser, function(value, key) {
           if(value.$id == window.localStorage.getItem([uniqueurl[2]])){
               your_latitude = value.latitude;
               your_longitude = value.longitude;
           }
        });
        angular.forEach(angularuser, function(value, key) {
           var _pow = Math.pow( 10 , 2 ) ;
           if(value.$id == window.localStorage.getItem([uniqueurl[2]])){
               dist = 0;
           }else{
               dist = Math.round( GeoFire.distance([your_latitude,your_longitude], [value.latitude,value.longitude]) * _pow ) / _pow;
           }
           angularuser[key].distance = dist;
           var latlng = {lat: value.latitude, lng: value.longitude};
           var geo = geocoder.geocode({'location': latlng}, function(results, status) {
               i = i + 1;
               if (status === google.maps.GeocoderStatus.OK) {
                   console.log(results[1].formatted_address);
                   angularuser[key].address = results[1].formatted_address;
                   
                   console.log("pass0");
                   console.log(angularuser[key]);
                   console.log(angularuser[key]);
                   data.push(angularuser[key]);
                   if(i == angularuser.length){
                       console.log("pass");
                       console.log(data);
                       $scope.users = data;
                       console.log("pass2");
                       console.log($scope.users);
                   }
               }else{
                   console.log("error:" + status);
               }
           });
        },data);
        
    });
});

myapp.controller('usercon', function ($scope, $firebaseArray) {
    var users = ref.child('sharemap').child(uniqueurl[2]).child('users');
    $scope.usersnumber = $firebaseArray(users);
});
*/
