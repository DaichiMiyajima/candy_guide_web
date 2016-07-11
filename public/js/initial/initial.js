// Firebase
//https://candyguideweb-d7d76.firebaseio.com/
//https://candyguide.firebaseio.com/
var ref = new Firebase("https://candyguideweb-d7d76.firebaseio.com/");

(function(){
    $("#create_url").click(function(){
        //create unique url
        var oncomplete = function(error){
            if(error){
            }else{
                window.location.href = "./sharemap/" + url ;
            }
        }
        
        if($("#groupname").val()){
            var url = new Date().getTime().toString(16) + new Date().getMilliseconds().toString(16) + Math.floor(10000*Math.random()).toString(16);
            //window.location.href = "./sharemap/" + url ;
            window.unique = url ;
            ref.child("sharemap").child(url).set({
                name:$("#groupname").val()
            },oncomplete);
        }else{
            alert("required groupname");
        }
    });
    
    //hide address bar
    window.scrollTo(0,0);
})()

//init side navi
$(document).ready(function () {
    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $(".button-collapse").sideNav();
});
