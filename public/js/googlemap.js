var googlemap;
var markers = new Array();
var infoWindows = new Array();

(function(){
    var plugins = {
        // click items activation
        sharegeolocation: {
            func: function sharegeolocation(uniqueurl,position){
                var mylatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //create map
                var mapOptions = {
                    zoom: 16,
                    center: mylatlng,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                googlemap = new google.maps.Map(document.getElementById("map"),mapOptions);
                ref.child('sharemap').child(uniqueurl).child('users').once("value", function(snapshot) {
                    snapshot.forEach(function(data) {
                        if(data.val() && data.val()["latitude"]){
                            createMarker(data.val()["latitude"], data.val()["longitude"], data.val()["name"], data.key(),markercreate);
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
     window.dragmarkerPlugins = [
        plugins.dragMarker
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
        //google drag event(common)
        google.maps.event.addListener(
            markers[key],
            'drag',
        function(event) {
            if(infoWindows[key]){
                infoWindows[key].close();
            }
        });
        google.maps.event.addListener(
            markers[key],
            'dragend',
        function(event) {
            if(infoWindows[key]){
                infoWindows[key].position=new google.maps.LatLng(this.position.lat(), this.position.lng());
                infoWindows[key].open(googlemap);
                
            }
        });
    }
}

// marker changeposition
function markerchange(latitude,longitude,key) {
    markers[key].setPosition(new google.maps.LatLng(latitude, longitude));
    
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
