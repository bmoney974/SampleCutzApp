var myApp = angular.module('myApp')
.controller('SingleVideoCtrl', function($scope, $http, $stateParams){
            $http.get('/video/'+$stateParams.id).success(function(response){
                $scope.video = response;

            });

});