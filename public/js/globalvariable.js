// Firebase
var ref = new Firebase("https://candyguide.firebaseio.com/");
var pathname = window.location.pathname;
var uniqueurl = pathname.split("/");
var mes = new Array();

var myapp = angular.module('mapper', ["firebase"]);

//setting of toastr
toastr.options.closeButton = true; 
toastr.options.timeOut = 35000;

var googlemap;
var markers = new Array();
var infoWindows = new Array();

var watchID;
