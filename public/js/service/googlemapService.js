/*global candy, angular, Firebase */
'use strict';

candy.service('googlemapService', function ($injector,GOOGLE,MARKER,ROOMID) {
    this.loadMap = function (mylatlng) {
        var newLatlng = new google.maps.LatLng(mylatlng.lat()-0.02, mylatlng.lng());
        //create map
        var mapOptions = {
            zoom: 12,
            center: newLatlng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        GOOGLE.googlemap = new google.maps.Map(document.getElementById("map"),mapOptions);
        //style
        var styleOptions = [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#aee2e0"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#abce83"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#769E72"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7B8758"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#EBF4A4"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#8dab68"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#5B5B3F"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ABCE83"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#A4C67D"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#9BBF72"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#EBF4A4"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#87ae79"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#7f2200"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "visibility": "on"
                    },
                    {
                        "weight": 4.1
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#495421"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ];
        var styledMapOptions = { name: 'Candy' }
        var candyType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
        GOOGLE.googlemap.mapTypes.set('Candy', candyType);
        GOOGLE.googlemap.setMapTypeId('Candy');
    }
    // canvasでimage加工
    this.createMarker = function (latitude, longitude, title, key, provider, photoURL, callback) {
        if(photoURL){
            var img =new Image();
            img.crossOrigin = "Anonymous";
            img.src = photoURL;
            img.onload = function(that){
                var bg = document.createElement("canvas");
                bg.width = 54;
                bg.height = 60;
                var bgCtx = bg.getContext("2d");
                // 黒枠の作成
                bgCtx.beginPath();
                bgCtx.fillStyle = "black";
                bgCtx.fillRect(0,0,54,54);
                bgCtx.fill();
                bgCtx.stroke();
                // 線の作成
                bgCtx.beginPath();
                bgCtx.moveTo(27,60);
                bgCtx.lineTo(24,54);
                bgCtx.moveTo(27,60);
                bgCtx.lineTo(30,54);
                bgCtx.stroke();
                bgCtx.drawImage(img, 2, 2,50,50);
                callback(latitude,longitude,title,key,bg.toDataURL());
            }
        }else{
            // attach image to bg canvas
            var bg = document.createElement("canvas");
            bg.width = 80;
            bg.height = 80;
            var bgCtx = bg.getContext("2d");
            // 線の作成
            bgCtx.beginPath();
            //bgCtx.lineCap = "round";
            bgCtx.strokeStyle = "black";
            bgCtx.fillStyle = "white";
            bgCtx.lineWidth = 6;
            bgCtx.moveTo(28,52);
            bgCtx.lineTo(35,63);
            bgCtx.lineTo(42,52);
            bgCtx.stroke();
            bgCtx.closePath();
            bgCtx.fill();
            //円の作成
            bgCtx.beginPath();
            bgCtx.lineWidth = 5;
            bgCtx.strokeStyle = "black";
            bgCtx.fillStyle = "white";
            bgCtx.arc(35, 35, 20, 70 * Math.PI / 180, 110 * Math.PI / 180, true);
            bgCtx.stroke();
            bgCtx.fill();
            //文字の長さ
            var metrics = bgCtx.measureText(title);
            bgCtx.lineWidth = 1;
            bgCtx.strokeStyle = "black";
            bgCtx.font = "10px 'Gilgongo'";
            if(metrics.width < 40){
                bgCtx.strokeText(title, 15+(40-metrics.width)/2, 39,36);
            }else{
                bgCtx.strokeText(title, 15, 39,39);
            }
            callback(latitude,longitude,title,key,bg.toDataURL());
        }
    }
    // marker作成
    this.markercreate = function (latitude,longitude,title,key,imagepath) {
        if(latitude && longitude && title && !GOOGLE.markers[ROOMID.roomid + key]){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: GOOGLE.googlemap,
                icon: imagepath,
                title: title//,
                //draggable: true
            });
            GOOGLE.markers[ROOMID.roomid + key] = marker;
        }
    }
    // marker Change
    this.changeMarker = function (changedata,key) {
        if(GOOGLE.infoWindows[ROOMID.roomid + key]){
            GOOGLE.infoWindows[ROOMID.roomid + key].close();
            GOOGLE.infoWindows[ROOMID.roomid + key].position=new google.maps.LatLng(changedata.latitude, changedata.longitude);
            GOOGLE.infoWindows[ROOMID.roomid + key].open(GOOGLE.googlemap);
        }
        if(GOOGLE.markers[ROOMID.roomid + key]){
            GOOGLE.markers[ROOMID.roomid + key].setPosition(new google.maps.LatLng(changedata.latitude, changedata.longitude));
        }
    }
    // Remove marker
    this.removeMarker = function (removedata,key){
        if(GOOGLE.markers[ROOMID.roomid + key]){
            GOOGLE.markers[ROOMID.roomid + key].setMap(null);
            delete GOOGLE.markers[ROOMID.roomid + key];
        }
    }
    // create info window
    this.createInfoWindow = function (adddata,key) {
        if(GOOGLE.markers[ROOMID.roomid + adddata.key] && GOOGLE.markers[ROOMID.roomid + adddata.key].position){
            //delete infowindow
            if(GOOGLE.infoWindows[ROOMID.roomid + adddata.key]){GOOGLE.infoWindows[ROOMID.roomid + adddata.key].close()}
            //create infowindow
            var contentStr = '<div style="width: 150px;height: auto !important;word-wrap: break-word;">' + adddata.message + '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentStr,
                position:GOOGLE.markers[ROOMID.roomid + adddata.key].position,
                pixelOffset: new google.maps.Size( -8 , -50 ),
                disableAutoPan: true
            });
            GOOGLE.infoWindows[ROOMID.roomid + adddata.key] = infowindow;
        }
    }
    // handle info window
    this.handleInfoWindow = function (adddata,key) {
        if(GOOGLE.infoWindows && GOOGLE.infoWindows[ROOMID.roomid + adddata.key]){
            GOOGLE.infoWindows[ROOMID.roomid + adddata.key].open(GOOGLE.googlemap);
        }
    }
    // create meetup marker
    this.meetupCreateMarkers = function (adddata,key,callbak){
        if(!GOOGLE.markers_meet[ROOMID.roomid + key]){
            if(adddata.key == window.localStorage.getItem([ROOMID.roomid])){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(adddata.latitude, adddata.longitude),
                    map: GOOGLE.googlemap,
                    icon : "../img/meetUpMarker.png",
                    draggable: true
                });
                GOOGLE.markers_meet[ROOMID.roomid + key] = marker;
                //MARKER VALUE
                MARKER.latitude = adddata.latitude;
                MARKER.longitude = adddata.longitude;
                
                google.maps.event.addListener(
                    GOOGLE.markers_meet[ROOMID.roomid + key],
                    'drag',
                function(event) {
                });
                google.maps.event.addListener(
                    GOOGLE.markers_meet[ROOMID.roomid + key],
                    'dragend',
                function(event) {
                    var position = this.position;
                    $injector.invoke(['popupService', function(popupService){
                        popupService.swal_dragend(key,position,adddata)
                    }]);
                });
            }else{
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(adddata.latitude, adddata.longitude),
                    icon : "../img/meetUpMarker.png",
                    map: GOOGLE.googlemap
                });
                GOOGLE.markers_meet[ROOMID.roomid + key] = marker;
            }
        }
    }
    // change meet up marker
    this.meetupChangeMarkers = function (changedata,key){
        GOOGLE.markers_meet[ROOMID.roomid + key].setPosition(new google.maps.LatLng(changedata.latitude, changedata.longitude));
    }
    // Remove meet up marker
    this.meetupRemoveMarkers = function (removedata,key){
        GOOGLE.markers_meet[ROOMID.roomid + key].setMap(null);
        delete GOOGLE.markers_meet[ROOMID.roomid + key];
    }
})
