var myApp = angular.module('myApp')
    .controller('AccountCtrl', function($scope, $http, $timeout){
        $http.get('/user').success(function(response){
            $scope.user = response;

        });


        $scope.uploadSuccess = function() {
            $scope.profileImgSrc = '/profile-pic?time='+new Date().getTime();
        };

        $scope.uploadSuccess();

        $scope.uploadSuccessDelayed = function() {
            $timeout(function () {
                $scope.uploadSuccess();
            }, 100);

        };

        $scope.updateTest = function () {
            $http.put('/users', $scope.user).success(function(response){

            }).then(function(response){
                console.log(response);
                alert("updated");

            });

        }



    });