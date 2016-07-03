//Message Include
myapp.controller('messageController', function ($scope, $firebaseArray,candyService) {
    var message = candyService.referenceMessage(uniqueurl[2]);
    $scope.messages = $firebaseArray(message);
});