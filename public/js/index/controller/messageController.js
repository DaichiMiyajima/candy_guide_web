//Message Include
myapp.controller('messageController', function ($scope, $firebaseArray,firebaseService) {
    var message = firebaseService.referenceMessage(uniqueurl[2]);
    $scope.messages = $firebaseArray(message);
});