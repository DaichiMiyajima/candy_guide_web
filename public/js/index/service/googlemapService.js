myapp.service('googlemapService', function ($firebaseObject,firebaseService) {
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
        var users = firebaseService.referenceUserOnce(uniqueurl);
        $firebaseObject(users).$loaded().then(function(user) {
            angular.forEach(user, function(value, key) {
                console.log(value);
                if(value){
                    var difference_time = (new Date().getTime() - value["time"]) / DAY_MILLISECOND;
                    if(value["time"] && difference_time < 1){
                        createMarker(value["latitude"], value["longitude"], value["name"], key,markercreate);
                    }
                }
            });
        });
    }
    //create marker
    this.createMarkers = function (uniqueurl,adddata,key){
        createMarker(adddata.latitude, adddata.longitude, adddata.name, key,markercreate);
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
})
