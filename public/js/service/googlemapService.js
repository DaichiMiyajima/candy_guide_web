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
                "featureType":"landscape",
                "stylers":[
                    {"hue":"#FFBB00"},
                    {"saturation":43.400000000000006},
                    {"lightness":37.599999999999994},
                    {"gamma":1}
                ]
            },
            {
                "featureType":"road.highway",
                "stylers":[
                    {"hue":"#FFC200"},
                    {"saturation":-61.8},
                    {"lightness":45.599999999999994},
                    {"gamma":1}
                ]
            },
            {
                "featureType":"road.arterial",
                "stylers":[
                    {"hue":"#FF0300"},
                    {"saturation":-100},
                    {"lightness":51.19999999999999},
                    {"gamma":1}
                ]
            },
            {
                "featureType":"road.local",
                "stylers":[
                    {"hue":"#FF0300"},
                    {"saturation":-100},
                    {"lightness":52},
                    {"gamma":1}
                ]
            },
            {
                "featureType":"water",
                "stylers":[
                    {"hue":"#0078FF"},
                    {"saturation":-13.200000000000003},
                    {"lightness":2.4000000000000057},
                    {"gamma":1}
                ]
            },
            {
                "featureType":"poi",
                "stylers":[
                    {"hue":"#00FF6A"},
                    {"saturation":-1.0989010989011234},
                    {"lightness":11.200000000000017},
                    {"gamma":1}
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
    // Remove meet up marker
    this.removeMarker = function (removedata,key){
        GOOGLE.markers[ROOMID.roomid + key].setMap(null);
        delete GOOGLE.markers[ROOMID.roomid + key];
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
