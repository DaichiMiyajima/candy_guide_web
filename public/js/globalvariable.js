// Firebase
var ref = new Firebase("https://candyguide.firebaseio.com/");
var pathname = window.location.pathname;
var uniqueurl = pathname.split("/");
var mes = new Array();
var myapp = angular.module('mapper', ["firebase"]);

var googlemap;
var markers = new Array();
var markers_meet = new Array();
var infoWindows = new Array();
var infoWindows_meet = new Array();
var watchID;

var yourlatitude;
var yourlongitude;

var markerlatitude;
var markerlongitude;

//For placeService
var placeService;

// For Direction
var directionsService = new google.maps.DirectionsService();
var travelMode = google.maps.TravelMode.WALKING;
var directionsDisplayArray = new Array();
var direction_number = 0;
//For Distance and time
var distanceService = new google.maps.DistanceMatrixService();


var SECOND_MILLISECOND = 1000,
    MINUTE_MILLISECOND = 60 * SECOND_MILLISECOND,
    HOUR_MILLISECOND = 60 * MINUTE_MILLISECOND,
    DAY_MILLISECOND = 24 * HOUR_MILLISECOND,
    WEEK_MILLISECOND = 7 * DAY_MILLISECOND,
    YEAR_MILLISECOND = 365 * DAY_MILLISECOND;



function setlocation(latitude,longitude){
    yourlatitude = latitude;
    yourlongitude = longitude;
}

function setmarkerlocation(latitude,longitude){
    markerlatitude = latitude;
    markerlongitude = longitude;
}