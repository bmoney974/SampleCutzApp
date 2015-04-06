var myApp = angular.module('myApp')
    .controller('accountCtrl', function($scope, $http, $stateParams){
        $http.get('/user/'+$stateParams.id).success(function(response){
            $scope.user = response;

        });

    });