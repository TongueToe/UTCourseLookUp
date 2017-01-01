var app = angular.module("ut", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
        templateUrl: "partial-course.html"
    })
    .otherwise({
        redirectTo: '/'
    });
    
});

app.controller("MainCtrl", function($scope, $http, $location){
    $scope.fetch = function() {
        if($scope.course){
            $http.get('/fetch', {
                params: {
                    course: $scope.course
                }
            }).then(function(response){
                $scope.array = response.data;

            }, function(response){
                $scope.class = "Something went wrong.";
            });
        }
        else{
            console.log($scope.course);
        }
    }
});