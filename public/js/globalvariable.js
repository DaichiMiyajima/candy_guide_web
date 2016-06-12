// Firebase
var ref = new Firebase("https://candyguide.firebaseio.com/");
var pathname = window.location.pathname;
var uniqueurl = pathname.split("/");
var mes = new Array();
var myapp = angular.module('mapper', ["firebase"]);

//setting of toastr
toastr.options.closeButton = true; 
toastr.options.timeOut = 5000;
toastr.options.progressBar = true; 

var googlemap;
var markers = new Array();
var markers_meet = new Array();
var infoWindows = new Array();
var infoWindows_meet = new Array();
var watchID;

var yourlatitude;
var yourlongtitude;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();


function setlocation(latitude,longtitude){
    yourlatitude = latitude;
    yourlongtitude = longtitude;
}