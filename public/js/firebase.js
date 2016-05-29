(function(){
    var plugins = {
        //when moving to somewhere
        watchlocation: {
            func: function sharegeolocation(uniqueurl){
                watchID = navigator.geolocation.watchPosition(
                    // onSuccess Geolocation
                    function(position) {
                        //within 50m → update user
                        if(position.coords.accuracy <= 100){
                            ref.child('sharemap').child(uniqueurl).child('users').child(window.sessionStorage.getItem([uniqueurl])).update({
                                latitude : position.coords.latitude,
                                longitude : position.coords.longitude
                            });//set
                        }
                     }, 
                     // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                     function(error) {console.log(error);},
                     {enableHighAccuracy: false,maximumAge: 0}
                );
            }
        },
        //when adding user's
        addusers: {
            func: function addusers(uniqueurl){
                ref.child('sharemap').child(uniqueurl).child('users').on('child_added', function(snapshot, addChildKey) {
                    var adddata = snapshot.val();
                    addPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
                    });
                });
            }
        },
        //when changing user's location
        changeusers: {
            func: function changeusers(uniqueurl){
                ref.child('sharemap').child(uniqueurl).child('users').on('child_changed', function(snapshot, changeChildKey) {
                    var changedata = snapshot.val();
                    changePlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl,changedata,snapshot.key());
                    });
                });
            }
        },
        addmessage: {
            func: function addmessage(uniqueurl){
                //when adding the message
                ref.child('sharemap').child(uniqueurl).child('message').limitToLast(3).on('child_added', function(snapshot, addChildKey) {
                    var adddata = snapshot.val();
                    infoPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
                    });
                    if(adddata.kind=="message"){
                        toastr.info("[" + adddata.name + "]" + " : " + adddata.message);
                    }else{
                        toastr.success(adddata.message);
                    }
                });
            }
        }
    }


    window.firebasePlugins = [
        plugins.watchlocation,
        plugins.addusers,
        plugins.changeusers,
        plugins.addmessage
    ];
})()
