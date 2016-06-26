// Firebase
var ref = new Firebase("https://candyguide.firebaseio.com/");

(function(){
    $("#create_url").click(function(){
        //create unique url
        if($("#groupname").val()){
            var url = new Date().getTime().toString(16) + new Date().getMilliseconds().toString(16) + Math.floor(10000*Math.random()).toString(16);
            window.location.href = "./sharemap/" + url ;
            window.unique = url ;
            ref.child("sharemap").child(url).set({
                name:$("#groupname").val()
            });
        }else{
            alert("required groupname")
        }
    });
})()
