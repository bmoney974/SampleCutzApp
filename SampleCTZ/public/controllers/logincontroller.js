var myApp = angular.module('myApp')
    .controller('LoginCtrl', function($scope, $http, $stateParams){
        $scope.login = function (){
            $http.post('/login', {username:$scope.username, password:$scope.password})
                .then(function(data){
                  console.log(data);
                  localStorage.setItem('username', $scope.username);
                    window.open('http://localhost:3000/#/audio', '_self')
                })
        };






    });