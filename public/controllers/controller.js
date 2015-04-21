

var myApp = angular.module('myApp',[
    'ui.router',
    'wavesurfer.angular',
'angularUtils.directives.dirPagination',
    'flow'



])
    .config(['$urlRouterProvider', '$stateProvider', '$sceDelegateProvider','paginationTemplateProvider', function($urlRouterProvider, $stateProvider, $sceDelegateProvider, paginationTemplateProvider){
       $urlRouterProvider.otherwise('/');

        paginationTemplateProvider.setPath('bower_components/angular-utils-pagination/dirPagination.tpl.html');
        $stateProvider

           .state('account', {
               url:'/account/:id',
               templateUrl:'partials/account.html',
               controller: 'AccountCtrl'
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
           .state('audio', {
               url:'/',
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
           })
           .state('dl', {
               url:'/dl',
               templateUrl:'partials/dl.html',
               controller: 'AppCtrl'
           })
            .state('video_page', {
               url:'/video_page/:id',
               templateUrl:'partials/single_video.html',
               controller: 'SingleVideoCtrl'
           })
            .state('login', {
                url:'/login',
                templateUrl:'partials/login.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url:'/register',
                templateUrl:'partials/register.html',
                controller: 'AppCtrl'
        });









        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'http://samplecutz.com/**',
            'https://www.youtube.com/**'
        ]);

    }]).run(function($rootScope){


        $rootScope.refreshLogin = function(){
            $rootScope.username = localStorage.getItem('username');

            $rootScope.promptLogin = function () {
                var result = confirm('Please log in to download');
                if (result){
                    $state.go('login');
                }
            };

            $rootScope.isloggedin = !!$rootScope.username;
        };
        $rootScope.refreshLogin();
    });



myApp.controller('AppCtrl', function($scope, $http, $state){
    console.log("Hello World from controller");

    $scope.lout = function (){
        $http.post('/logout').then(function () {
            console.log('logged out');
            localStorage.removeItem('username');
           $scope.refreshLogin();
            $state.go('audio');

        });

    };

    // password confirm

    $scope.passConfrim = function(){
        var pass = document.getElementById('password').value();
        var conpass = document.getElementById('conpassword').value();

        if(pass != conpass){
            alert("Passwords don't match");
            return false;
        }else {
            document.getElementById('signup').submit();
        }

    };


    //wave surfer options
    $scope.options = {
        waveColor      : '#c5c1be',
        progressColor  : '#2A9FD6',
        normalize      : true,
        hideScrollbar  : true,
        skipLength     : 15,
        height         : 53,
        cursorColor    : '#2A9FD6'
    };

    var refresh = function(){

        $http.get('/videos').success(function(response){
            $scope.videos= response;

        });

        $http.get('/users').success(function(response){
            $scope.users= response;

        });
//register
        $scope.registerUser = function(form){
            console.log($scope.user);
            if (!form.email.$valid){
                return;
            }
            if( $scope.user.password !== $scope.conpassword){
                $scope.noPassMatch = true ;
                return;
            }
            $http.post('/users', $scope.user).success(function(response){

            }).then(function(response){
                console.log(response);
                $http.post('/login', {username:$scope.user.username, password:$scope.user.password})
                    .then(function(data){
                        console.log(data);
                        localStorage.setItem('username', $scope.username);
                        $scope.refreshLogin();

                        $state.go('account');

                    });

            });


        };

        $http.get('/sounds').success(function(response){
            console.log("I got the data i requested")
            $scope.sounds= response;
            $scope.sound ="";





            $scope.categories = [
                {name:"Drums" },
                {name:"Loop"},
                {name:"One Shots"}
            ];

            $scope.videoCategories = [
                {name:"Sound Design" },
                {name:"Audio Editing"},
                {name:"Recording"}
            ];


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

        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
        };

        $scope.reset();


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

    $scope.dl_window = function (){
        var link = $scope.sound.audio_link ;
        var name = $scope.sound.file_name;

        window.open("/#/dl","mywin", "width=300, height=300");

    };



});

myApp.filter('keys', function () {
    return function (object) {
        return Object.keys(object || {}).filter(function (key) {
            return key !== '$$hashKey';
        });
    };
});

