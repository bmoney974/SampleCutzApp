var myApp = angular.module('myApp',[
    'ui.router'
])
    .config(['$urlRouterProvider', '$stateProvider', '$sceDelegateProvider', function($urlRouterProvider, $stateProvider, $sceDelegateProvider){
       $urlRouterProvider.otherwise('/');

       $stateProvider
           .state('home', {
               url:'/',
               templateUrl: 'partials/home.html',
               controller: 'AppCtrl'
           })
           .state('account', {
               url:'/account',
               templateUrl:'partials/account.html',
               controller: 'AppCtrl'
           })
           .state('download', {
               url:'/download',
               templateUrl:'partials/download.html',
               controller: 'AppCtrl'
           })
           .state('about', {
               url:'/about',
               templateUrl:'partials/about.html',
               controller: 'AppCtrl'
           })
           .state('genre', {
               url:'/genre',
               templateUrl:'partials/genre.html',
               controller: 'AppCtrl'
           })
           .state('learning', {
               url:'/learning',
               templateUrl:'partials/learning.html',
               controller: 'AppCtrl'
           })
           .state('sounds', {
               url:'/sounds',
               templateUrl:'partials/sounds.html',
               controller: 'AppCtrl'
           })
           .state('topics', {
               url:'/topics',
               templateUrl:'partials/topics.html',
               controller: 'AppCtrl'
           })
           .state('video', {
               url:'/video',
               templateUrl:'partials/video.html',
               controller: 'AppCtrl'
           });

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'http://samplecutz.com/**'
        ]);
    }]);



myApp.controller('AppCtrl', function($scope, $http){
    console.log("Hello World from controller");
    var refresh = function(){
        $http.get('/sounds').success(function(response){
            console.log("I got the data i requested")
            $scope.sounds= response
            $scope.sound ="";


        });
        $scope.orderProp = '_id';
    };
    refresh();
   $scope.addContact = function(){
       console.log($scope.contact);
       $http.post('/contactlist', $scope.contact).success(function(response){
           console.log(response);
           refresh();

       });
   };

    $scope.remove = function(id){
        console.log(id);
        $http.delete('/contactlist/' + id).success(function(response){
            refresh();
        });
    }

    $scope.edit = function(id){
      console.log(id);
        $http.get('/contactlist/' + id).success(function(response){
           $scope.contact = response;

        });
    };

    $scope.update = function(){
        console.log($scope.contact._id);
        $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
           refresh();
        });
    };

    $scope.deselect = function(){
        $scope.contact= "";
    }

});

