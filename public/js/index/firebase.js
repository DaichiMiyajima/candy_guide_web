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
                            //set location into variable
                            setlocation(position.coords.latitude,position.coords.longitude);
                        }
                     }, 
                     // エラー時のコールバック関数は PositionError オブジェクトを受けとる
                     function(error) {},
                     {enableHighAccuracy: false,maximumAge: 0}
                );
            }
        },
        //when adding user's
        addusers: {
            func: function addusers(uniqueurl){
                ref.child('sharemap').child(uniqueurl).child('users').orderByChild("share").equalTo("on").on('child_added', function(snapshot, addChildKey) {
                    var adddata = snapshot.val();
                    var difference_time = (new Date().getTime()-adddata["time"]) / DAY_MILLISECOND;
                    if(adddata["time"] && difference_time < 1){
                        addPlugins.forEach(function(plugin){
                            plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
                        });
                    }
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
                        Materialize.toast("[" + adddata.name + "]" + " : " + adddata.message, 35000, 'rounded message') 
                    }else if(adddata.kind=="attend" || adddata.kind=="meetup"){
                        Materialize.toast(adddata.message , 5000, 'rounded attend meetup');
                    }else if(adddata.kind=="meetupremove"){
                        Materialize.toast(adddata.message , 5000, 'rounded meetupremove');
                    }
                });
            }
        },
        //when adding meetup's
        addmeetup: {
            func: function addmeetup(uniqueurl){
                ref.child('sharemap').child(uniqueurl).child('meetup').on('child_added', function(snapshot, addChildKey) {
                    var adddata = snapshot.val();
                    addmeetupPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl,adddata,snapshot.key());
                    });
                });
            }
        },
        //when changing meetup's location
        changemeetup: {
            func: function changemeetup(uniqueurl){
                ref.child('sharemap').child(uniqueurl).child('meetup').on('child_changed', function(snapshot, changeChildKey) {
                    var changedata = snapshot.val();
                    changemeetupPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl,changedata,snapshot.key());
                    });
                });
            }
        },
        //when changing meetup's location
        removemeetup: {
            func: function removemeetup(uniqueurl){
                ref.child('sharemap').child(uniqueurl).child('meetup').on('child_removed', function(snapshot, changeChildKey) {
                    var removedata = snapshot.val();
                    removemeetupPlugins.forEach(function(plugin){
                        plugin.func.call(function(){},uniqueurl,removedata,snapshot.key());
                    });
                });
            }
        }
    }

    window.locationPlugins = [
        plugins.watchlocation
    ];
    window.firebasePlugins = [
        plugins.addusers,
        plugins.changeusers,
        plugins.addmessage,
        plugins.addmeetup,
        plugins.changemeetup,
        plugins.removemeetup
    ];
})()
