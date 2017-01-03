var app = angular.module("ut", ["ngRoute", 'ui.select', 'ngSanitize']);

app.config(function($routeProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
        templateUrl: "/partial-search.html",
        controller: "InitCtrl"
    })
    .otherwise({
        redirectTo: '/'
    });
    
});

app.factory("Fields", function() {
    var factory = {
        fields: []
    };
    
    factory.setFields = function(fields) {
        factory.fields = fields;
    }

    return factory;
});

app.controller("InitCtrl", function($scope, $http, Fields) {
    
    $scope.loadFields = function() {
        $http.get('/init').then(function(response) {

            Fields.setFields(JSON.parse(response.data));
            $scope.fields = Fields.fields;

        }, function(response){

            $scope.error = "Something went wrong";
            angular.element(document.querySelector("#results")).addClass("ng-hide");
            angular.element(document.querySelector("#danger")).removeClass("ng-hide");

        })
    }

    $scope.loadCourses = function(field) {
        $http.get('/search/field/' + field[1]).then(function(response) {
            $scope.courses = response.data;
        });
    }

    $scope.displayCourse = function(course) {
        var arr = [];
        arr.push(course)
        $scope.array = arr;
        console.log(arr);

        angular.element(document.querySelector("#results")).removeClass("ng-hide");
        angular.element(document.querySelector("#danger")).addClass("ng-hide");
    }

});

/*
app.controller("SearchCtrl", function($scope, $http, $location){
    $scope.search = function() {
        if($scope.course){
            $http.get('/search/' + $scope.course).then(function(response){
                if(typeof response.data == 'object' && 'Name' in response.data[0] && response.data[0].Name){
                    $scope.array = response.data;
                    $scope.resultNum = response.data.length;

                    angular.element(document.querySelector("#results")).removeClass("ng-hide");
                    angular.element(document.querySelector("#danger")).addClass("ng-hide");
                }
                else {
                    $scope.error = response.data;

                    angular.element(document.querySelector("#results")).addClass("ng-hide");
                    angular.element(document.querySelector("#danger")).removeClass("ng-hide");
                }

            }, function(response){
                $scope.error = "Something went wrong.";
                angular.element(document.querySelector("#results")).addClass("ng-hide");
                angular.element(document.querySelector("#danger")).removeClass("ng-hide");
            });
        }
        else{
            $scope.error = "Cannot search with empty field";
            angular.element(document.querySelector("#results")).addClass("ng-hide");
            angular.element(document.querySelector("#danger")).removeClass("ng-hide");
        }
    }


});

*/