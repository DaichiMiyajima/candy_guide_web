//Message Include
myapp.controller('messageController', function ($scope, $firebaseArray,candyService) {
    var message = candyService.referenceMessage(uniqueurl[2]);
    $scope.messages = $firebaseArray(message);
    //sendMessage
    $scope.sendMessage = function(messageInput){
        if(messageInput && messageInput.length > 0){
            candyService.registerMessage(messageInput);
            $scope.messageInput = "";
            
        }
    }
});