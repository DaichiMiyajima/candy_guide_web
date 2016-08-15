/*global candy, angular, Firebase */
'use strict';

candy.service('authService', function ($q,$rootScope,$firebaseObject,firebaseService,popupService,GOOGLE,FirebaseAuth) {
    this.userauthentication = function (position,kind) {
        var deferred = $q.defer();
        if(FirebaseAuth.auth.$getAuth() && FirebaseAuth.auth.$getAuth().uid){
            var userDatas = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.auth.$getAuth().uid));
            userDatas.$loaded().then(function(userData) {
                if(!userData.displayname){
                    popupService.swal_init_on(function(){
                        FirebaseAuth.userInfo = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.auth.$getAuth().uid));
                        $rootScope.userInfo = FirebaseAuth.userInfo;
                        //UpdateUser
                        firebaseService.updateUser(position,kind);
                        FirebaseAuth.userInfo.$loaded().then(function(user) {
                            FirebaseAuth.displayname = user.displayname;
                            deferred.resolve();
                        });
                    });
                }else{
                    //UpdateUser
                    firebaseService.updateUser(position,kind).then(function () {
                        deferred.resolve();
                    });
                }
            });
        }else{
            firebaseService.registerAuth().then(function(user){
                FirebaseAuth.userAuth = user;
                popupService.swal_init_on(function(){
                    FirebaseAuth.userInfo = $firebaseObject(firebaseService.selectLoginUser(FirebaseAuth.auth.$getAuth().uid));
                    $rootScope.userInfo = FirebaseAuth.userInfo;
                    //UpdateUser
                    firebaseService.updateUser(position,kind);
                    deferred.resolve();
                });
            });
        }
        return deferred.promise;
    }
})