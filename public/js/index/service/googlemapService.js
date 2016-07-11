myapp.service('googlemapService', function ($injector) {
    this.loadMap = function (uniqueurl,mylatlng) {
        var newLatlng = new google.maps.LatLng(mylatlng.lat()-0.02, mylatlng.lng());
        //create map
        var mapOptions = {
            zoom: 12,
            center: newLatlng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        googlemap = new google.maps.Map(document.getElementById("map"),mapOptions);
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
        googlemap.mapTypes.set('Candy', candyType);
        googlemap.setMapTypeId('Candy');
    }
    // canvasでimage加工
    this.createMarker = function (latitude,longitude,title,key,callback) {
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
    // marker作成
    this.markercreate = function (latitude,longitude,title,key,imagepath) {
        if(!markers[key]){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: googlemap,
                icon: imagepath,
                title: title//,
                //draggable: true
            });
            markers[key] = marker;
        }
    }
    // marker Change
    this.changeMarker = function (uniqueurl,changedata,key) {
        if(infoWindows[key]){
            infoWindows[key].close();
            infoWindows[key].position=new google.maps.LatLng(changedata.latitude, changedata.longitude);
            infoWindows[key].open(googlemap);
        }
        markers[key].setPosition(new google.maps.LatLng(changedata.latitude, changedata.longitude));
    }
    // create info window
    this.createInfoWindow = function (uniqueurl,adddata,key) {
        if(markers[adddata.key] && markers[adddata.key].position){
            //delete infowindow
            if(infoWindows[adddata.key]){infoWindows[adddata.key].close()}
            //create infowindow
            var contentStr = '<div style="width: 150px;height: auto !important;word-wrap: break-word;">' + adddata.message + '</div>';
            infowindow = new google.maps.InfoWindow({
                content: contentStr,
                position:markers[adddata.key].position,
                pixelOffset: new google.maps.Size( -8 , -50 ),
                disableAutoPan: true
            });
            infoWindows[adddata.key] = infowindow;
        }
    }
    // handle info window
    this.handleInfoWindow = function (uniqueurl,adddata,key) {
        if(infoWindows && infoWindows[adddata.key]){
            infoWindows[adddata.key].open(googlemap);
        }
    }
    // create meetup marker
    this.meetupCreateMarkers = function (uniqueurl,adddata,key,callbak){
        if(!markers_meet[key]){
            if(adddata.key == window.localStorage.getItem([uniqueurl])){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(adddata.latitude, adddata.longitude),
                    map: googlemap,
                    icon : "../img/meetUpMarker.png",
                    draggable: true
                });
                setmarkerlocation(adddata.latitude, adddata.longitude);
                markers_meet[key] = marker;
                google.maps.event.addListener(
                    markers_meet[key],
                    'drag',
                function(event) {
                });
                google.maps.event.addListener(
                    markers_meet[key],
                    'dragend',
                function(event) {
                    var position = this.position;
                    $injector.invoke(['popupService', function(popupService){
                        popupService.swal_dragend(uniqueurl,key,position)
                    }]);
                });
            }else{
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(adddata.latitude, adddata.longitude),
                    icon : "../img/meetUpMarker.png",
                    map: googlemap
                });
                markers_meet[key] = marker;
            }
        }
    }
    // change meet up marker
    this.meetupChangeMarkers = function (uniqueurl,changedata,key){
        markers_meet[key].setPosition(new google.maps.LatLng(changedata.latitude, changedata.longitude));
    }
    // Remove meet up marker
    this.meetupRemoveMarkers = function (uniqueurl,removedata,key){
        markers_meet[key].setMap(null);
        delete markers_meet[key];
    }
})
