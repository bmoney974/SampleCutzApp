
var childwindow = window.open('/#/audio','_self');
var myApp = angular.module('myApp')
    .controller('LoginCtrl', function($scope, $http, $state){
        $scope.login = function (){
            $http.post('/login', {username:$scope.username, password:$scope.password})
                .then(function(data){
                  console.log(data);
                  localStorage.setItem('username', $scope.username);
                    childwindow.location.reload();
                    //$state.go('audio');

                });
        };


    });