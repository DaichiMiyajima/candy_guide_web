/*global candy, angular, Firebase */
'use strict';

//Place Include
candy.controller('placeController', function ($scope, $firebaseArray,firebaseService,popupService,ROOMID,GOOGLE) {
    //SearchPlace
    $scope.searchPlace = function(text){
        if($("#search_place").val() && $("#search_place").val().length > 0){
            var request = {
                location: GOOGLE.googlemap.getCenter(),
                radius: '500',
                query: $("#search_place").val()
            };
            GOOGLE.placeService = new google.maps.places.PlacesService(GOOGLE.googlemap);
            GOOGLE.placeService.textSearch(request, function(results, status) {
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
    //Make pin from SearchPlace
    $scope.makeMeetUpMarker = function(place){
        if(Object.keys(GOOGLE.markers_meet).length < 1){
            firebaseService.registerMeetUpMarker(place);
            firebaseService.registerMessage("meetup", window.localStorage.getItem([ROOMID.roomid+"name"])+" add marker");
            //panto
            GOOGLE.googlemap.panTo(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
            $('#modal2').closeModal();
        }else{
            popupService.swal_remove_meetUpMarkers();
        }
    }
    //Only Panto
    $scope.navigation = function(place){
        GOOGLE.googlemap.panTo(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
    }
    //Click More
    $scope.placeclick = function(place){
        var request = {
            placeId: place.place_id
        };
        GOOGLE.placeService.getDetails(request, function(placeDetail, status) {
            $scope.rating ="error";
            $scope.photos = null;
            $scope.placeDetail = null;
            if (status == google.maps.places.PlacesServiceStatus.OK) {
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