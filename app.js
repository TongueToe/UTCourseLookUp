var app = angular.module("ut", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('home', {
        url: "/",
        templateUrl: "partial-search.html",
        controller: "InitCtrl"
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

            // [
            //  ...
            //  ["Biochemistry", "BCH"]
            //  ...
            // ]

        }, function(response){

            $scope.error = "Something went wrong";

        })
    }

    $scope.loadCourses = function(field) {
        $http.get('/search/field/' + field).then(function(response) {
            $scope.currentField = field;
            
            var arr = response.data;
            $scope.courses=[];
            
            if($scope.courseDiv == "both"){
                $scope.courses = arr;
            }
            else if($scope.courseDiv == "lower"){
                for (let a of arr) {
                    if(parseInt(a.Number.substr(1,1)) < 2){
                        $scope.courses.push(a);
                    }
                }
            }
            else {
                for (let a of arr) {
                    if(parseInt(a.Number.substr(1,1)) > 1){
                        $scope.courses.push(a)
                    }
                }
            }
        });

    }

    $scope.setDiv = function() {
        $scope.courseDiv = "both";
    }

    $scope.updateCourseDiv = function() {
        if(!$scope.currentField) {
            return;
        }

        $scope.loadCourses($scope.currentField);
    }

    $scope.updateTable = function(course, $select) {
        var arr = [];
        arr.push(course)
        $scope.array = arr;

    }

});


app.filter("filterCourses", function() {
    return function(inputCourses, searchString) {
        if(searchString){
            var arr = [];
            for (i = 0; i < inputCourses.length; i++){
                if (inputCourses[i].Name.toUpperCase().includes(searchString.toUpperCase()) || inputCourses[i].Number.includes(searchString.toUpperCase())){
                    arr.push(inputCourses[i]);
                }
            }
            return arr;
        }
        else return inputCourses;
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