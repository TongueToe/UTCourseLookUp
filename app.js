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
                if(typeof response.data == 'object' && 'Name' in response.data[0] && response.data[0].Name){
                    $scope.array = response.data;
                    angular.element(document.querySelector("#results")).removeClass("ng-hide");
                    angular.element(document.querySelector("#danger")).addClass("ng-hide");

                    $scope.resultNum = response.data.length;
                }
                else {
                    angular.element(document.querySelector("#results")).addClass("ng-hide");

                    angular.element(document.querySelector("#danger")).removeClass("ng-hide");
                    $scope.error = response.data;
                }

            }, function(response){
                $scope.error = "Something went wrong.";
            });
        }
        else{
            console.log($scope.course);
        }
    }
});