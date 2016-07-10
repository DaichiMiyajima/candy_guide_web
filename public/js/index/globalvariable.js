// Firebase
//https://candyguideweb-d7d76.firebaseio.com/
//https://candyguide.firebaseio.com/
var ref = new Firebase("https://candyguideweb-d7d76.firebaseio.com/");
var pathname = window.location.pathname;
var uniqueurl = pathname.split("/");
var mes = new Array();
var myapp = angular.module('candy', ['firebase','ngTouch','ngTouchstart']);

var googlemap;
var markers = new Array();
var markers_meet = new Array();
var infoWindows = new Array();
var infoWindows_meet = new Array();
var watchID;

var yourname;

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

var resize_count = 0;
var resize;
var browser;

var messageInputHeight;

function setlocation(latitude,longitude){
    yourlatitude = latitude;
    yourlongitude = longitude;
}

function setmarkerlocation(latitude,longitude){
    markerlatitude = latitude;
    markerlongitude = longitude;
}

(function(){
    var crios = !!navigator.userAgent.match(/crios/i);
    var safari = !!navigator.userAgent.match(/safari/i);
    var iphone = !!navigator.userAgent.match(/iphone/i);
    var line = !!navigator.userAgent.match(/Line/i);
    if(safari && !crios && iphone && !line){
        $("#map").css("height","90vh");
        browser = "safari";
    }
    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $(".button-collapse").sideNav();
    
})()