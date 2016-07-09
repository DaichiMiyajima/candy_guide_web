(function(){
    var plugins = {
        // click items activation
        sharegeolocation: {
            func: function sharegeolocation(uniqueurl,mylatlng){
                var newLatlng = new google.maps.LatLng(mylatlng.lat()-0.02, mylatlng.lng());
                //create map
                var mapOptions = {
                    zoom: 13,
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
                //Show Marker
                ref.child('sharemap').child(uniqueurl).child('users').orderByChild("share").equalTo("on").once("value", function(snapshot) {
                    snapshot.forEach(function(data) {
                        var difference_time = (new Date().getTime()-data.val()["time"]) / DAY_MILLISECOND;
                        if(data.val()["time"] && difference_time < 1){
                            if(data.val()){
                                createMarker(data.val()["latitude"], data.val()["longitude"], data.val()["name"], data.key(),markercreate);
                            }
                        }
                    });
                })
            }
        },
        createMarkers:{
            func: function createMarkers(uniqueurl,adddata,key){
                createMarker(adddata.latitude, adddata.longitude, adddata.name, key,markercreate);
            }
        },
        changeMarkers:{
            func: function changeMarkers(uniqueurl,changedata,key){
                if(infoWindows[key]){
                    infoWindows[key].close();
                    infoWindows[key].position=new google.maps.LatLng(changedata.latitude, changedata.longitude);
                    infoWindows[key].open(googlemap);
                }
                markerchange(changedata.latitude, changedata.longitude, key);
            }
        },
        createinfowindow:{
            func: function createinfowindow(uniqueurl,adddata,key){
                createinfo(uniqueurl,adddata,key);
            }
        },
        handleInfoWindow:{
            func : function handleInfoWindow(uniqueurl,adddata,key) {
                if(infoWindows && infoWindows[adddata.key]){
                    infoWindows[adddata.key].open(googlemap);
                }
            }
        },
        meetupCreateMarkers:{
            func: function meetupCreateMarkers(uniqueurl,adddata,key){
                createMeetUpMarker(adddata.latitude, adddata.longitude, adddata.key, key,uniqueurl);
            }
        },
        meetupChangeMarkers:{
            func: function meetupChangeMarkers(uniqueurl,changedata,key){
                if(infoWindows[key]){
                    infoWindows[key].close();
                    infoWindows[key].position=new google.maps.LatLng(changedata.latitude, changedata.longitude);
                    infoWindows[key].open(googlemap);
                }
                markerMeetUpchange(changedata.latitude, changedata.longitude, key);
            }
        },
        meetupRemoveMarkers:{
            func: function meetupRemoveMarkers(uniqueurl,removedata,key){
                markers_meet[key].setMap(null);
                delete markers_meet[key];
                
            }
        }
    }


    window.indexPlugins = [
        plugins.sharegeolocation
    ];
    window.addPlugins = [
        plugins.createMarkers
    ];
     window.changePlugins = [
        plugins.changeMarkers
    ];
     window.infoPlugins = [
        plugins.createinfowindow,
        plugins.handleInfoWindow
    ];
    window.addmeetupPlugins = [
        plugins.meetupCreateMarkers
    ];
     window.changemeetupPlugins = [
        plugins.meetupChangeMarkers
    ];
    window.removemeetupPlugins = [
        plugins.meetupRemoveMarkers
    ];
})()

// createinfowindow
function createinfo(uniqueurl,adddata,key) {
    if(markers[adddata.key] && markers[adddata.key].position){
        //delete infowindow
        if(infoWindows[adddata.key]){infoWindows[adddata.key].close()}
        //create infowindow
        infowindow = new google.maps.InfoWindow({
            content: adddata.message,
            position:markers[adddata.key].position,
            pixelOffset: new google.maps.Size( -8 , -50 ),
            disableAutoPan: true
        });
        infoWindows[adddata.key] = infowindow;
    }

}

// marker作成
function markercreate(latitude,longitude,title,key,imagepath) {
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

// marker作成
function createMeetUpMarker(latitude,longitude,userkey,key,uniqueurl) {
    if(!markers_meet[key]){
        if(userkey == window.localStorage.getItem([uniqueurl])){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: googlemap,
                icon : "../img/meetUpMarker.png",
                draggable: true
            });
            setmarkerlocation(latitude, longitude);
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
                var isConfirm = swal_dragend(
                    function(isConfirm){
                        if(isConfirm){
                            //update
                            ref.child('sharemap').child(uniqueurl).child('meetup').child(key).update({
                                latitude : position.lat(),
                                longitude : position.lng()
                            });//set
                            setmarkerlocation(position.lat(),position.lng());
                        }else{
                            markers_meet[key].setPosition(new google.maps.LatLng(markerlatitude, markerlongitude));
                        }
                    }
                );
            });
        }else{
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                icon : "../img/meetUpMarker.png",
                map: googlemap
            });
            markers_meet[key] = marker;
        }
    }
}

// marker changeposition : yourposition
function markerchange(latitude,longitude,key) {
    markers[key].setPosition(new google.maps.LatLng(latitude, longitude));
}

// marker_meet changeposition
function markerMeetUpchange(latitude,longitude,key) {
    markers_meet[key].setPosition(new google.maps.LatLng(latitude, longitude));
}

// canvasでimage加工
function createMarker(latitude,longitude,title,key,callback) {
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
