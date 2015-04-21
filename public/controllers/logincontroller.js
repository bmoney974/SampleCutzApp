
var myApp = angular.module('myApp')
    .controller('LoginCtrl', function($scope, $http, $state){
        $scope.login = function (){
            $http.post('/login', {username:$scope.username, password:$scope.password})
                .then(function(data){
                  console.log(data);
                  localStorage.setItem('username', $scope.username);
                    $scope.refreshLogin();

                    $state.go('audio');

                },function (data){
                    if (data.status === 401){
                        alert("Password Incorrect");

                    }
                });


        };


    });