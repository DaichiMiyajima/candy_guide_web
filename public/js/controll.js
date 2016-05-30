google.maps.event.addDomListener(window, 'load', init);

// Firebase
var ref = new Firebase("https://candyguide.firebaseio.com/");
var pathname = window.location.pathname;
var uniqueurl = pathname.split("/");
var mes = new Array();

var myapp = angular.module('mapper', ["firebase"]);

//setting of toastr
toastr.options.closeButton = true; 
toastr.options.timeOut = 5000;

/* When loading screen */
function init() {
    console.log($(".mdl-layout__drawer"));
    $(".mdl-layout__drawer").css('left','""');
    
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
                    if(!window.sessionStorage.getItem([uniqueurl[2]])){
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
                            window.sessionStorage.setItem([uniqueurl[2]],[postID]);
                            window.sessionStorage.setItem([name],[inputValue]);
                            swal("Nice!", "You are " + inputValue, "success");
                        });
                    }else{
                        //when re-loading, update location
                        ref.child('sharemap').child(uniqueurl[2]).child('users').child(window.sessionStorage.getItem([uniqueurl[2]])).update({
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
    $scope.yourid = window.sessionStorage.getItem([uniqueurl[2]]);
    $scope.messages = $firebaseArray(message);
});


