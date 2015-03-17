var myApp = angular.module('myApp',[
    'ui.router'
    //'ngResource',
    //'myApp.filters'
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



            $scope.categories = [
                {name:"Drums" },
                {name:"Loop"},
                {name:"One Shots"}
            ];


            //$scope.showAll = true;
            //$scope.checkChange = function() {
            //    for(t in $scope.genres){
            //        if($scope.genres[t].on){
            //            $scope.showAll = false;
            //            return;
            //        }
            //    }
            //    $scope.showAll = true;
            //};
            //
            //$scope.myFunc = function(a) {
            //    if($scope.showAll) { return true; }
            //
            //    var sel = false;
            //
            //    for(genre in $scope.genres){
            //        var t = $scope.genres[genre];
            //        console.log(t);
            //        if(t.on){
            //            if(a.genre.indexOf(t.name) == -1){
            //                return false;
            //            }else{
            //                sel = true;
            //            }
            //        }
            //    }
            //    return sel;
            //};

            $scope.filter = {};

            $scope.getOptionsFor = function (propName) {
                return ($scope.sounds || []).map(function (sound) {
                    return sound[propName];
                }).filter(function (sound, idx, arr) {
                    return arr.indexOf(sound) === idx;
                });
            };

            $scope.filterByProperties = function (sound) {



                // Use this snippet for matching with OR
                var matchesOR = true;
                for (var prop in $scope.filter) {
                    if (noSubFilter($scope.filter[prop])) continue;
                    if (!$scope.filter[prop][sound[prop]]) {
                        matchesOR = false;
                    } else {
                        matchesOR = true;
                        break;
                    }
                }
                return matchesOR;

            };

            function noSubFilter(subFilterObj) {
                for (var key in subFilterObj) {
                    if (subFilterObj[key]) return false;
                }
                return true;
            }
        });
        myApp.filter('capitalizeFirst', function () {
            return function (str) {
                str = str || '';
                return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
            };

        });

        myApp.filter('keys', function () {
            return function (object) {
                return Object.keys(object || {}).filter(function (key) {
                    return key !== '$$hashKey';
                });
            };



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
    };



});

myApp.filter('keys', function () {
    return function (object) {
        return Object.keys(object || {}).filter(function (key) {
            return key !== '$$hashKey';
        });
    };
});
