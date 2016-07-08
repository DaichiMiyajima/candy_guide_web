//Place Include
myapp.controller('placeController', function ($scope, $firebaseArray,firebaseService) {
    //SearchPlace
    $scope.searchPlace = function(text){
        if($("#search_place").val() && $("#search_place").val().length > 0){
            var request = {
                location: googlemap.getCenter(),
                radius: '500',
                query: $("#search_place").val()
            };
            placeService = new google.maps.places.PlacesService(googlemap);
            placeService.textSearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                      var place = results[i];
                    }
                    $scope.places = results;
                    $scope.$apply();
                    $('.collapsible').collapsible();
                }
                
            });
        }
    }
    //Click More
    $scope.placeclick = function(place){
        var request = {
            placeId: place.place_id
        };
        placeService.getDetails(request, function(placeDetail, status) {
            $scope.rating ="error";
            $scope.photos = null;
            $scope.placeDetail = null;
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log(placeDetail);
                if(placeDetail.rating){
                    var rating = "rate rate" + Math.floor(placeDetail.rating) + "_" + Math.floor((placeDetail.rating - Math.floor(placeDetail.rating)) * 10);
                    $scope.rating = rating;
                }else{
                    $scope.rating = "error"
                }
                $('#modalPlaceDetail').openModal();
                var photos = new Array();
                if(placeDetail.photos){
                    angular.forEach(placeDetail.photos, function(value, key) {
                        photos[key] = value.getUrl({'maxWidth': 300, 'maxHeight': 300});
                    });
                }
                $scope.photos = photos;
                $scope.placeDetail = placeDetail;
                $scope.$apply();
                $('.carousel').carousel();
            }
        });
    }
});