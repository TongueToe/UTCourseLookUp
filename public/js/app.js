var app = angular.module("ut", ["ui.router", "ui.bootstrap", "ngDragDrop"]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
    
    .state('home', {
        url: "/",
        templateUrl: "home.html",
        controller: "InitCtrl"
    })

    .state('syllabus', {
        //url: "/1",
        url: "/",
        templateUrl: "syllabus.html",
        controller: "SyllabusCtrl"
    })

    .state('dplan', {
        //url: "/2",
        url: "/", 
        templateUrl: "dplan.html",
        controller: "DegreeCtrl"
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
    
    //ng-init for search form
    $scope.loadFields = function() {
        $scope.searchToggle = false; //if true, show all classes; if false, show 1 class
        $scope.courseDiv = "both"; //default radio button

        $http.get('/init').then(function(response) {

            Fields.setFields(JSON.parse(response.data));
            $scope.fields = Fields.fields;

            // Structure of fields
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
            $scope.searchToggle = true;
            
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

    $scope.updateCourseDiv = function() {
        if($scope.currentField) {
            $scope.loadCourses($scope.currentField);
            $scope.searchToggle = true;
        }
    }

    $scope.loadCourse = function(course) {
        if(course){
            $scope.courseResult = course;
            $scope.searchToggle = false;
        }
    }

});

app.controller("SyllabusCtrl", function($scope, $http, $window){
    $scope.submit = function(course) {
        course = course.replace(/ /g, "");
        
        var field;
        var number;

        for(i = 0; i < course.length; i++){
            if(!isNaN(course.charAt(i))){
                field = course.substring(0, i);
                number = course.substring(i, course.length);
                break;
            }
        }

        $http.get("/search/" + field + "/" + number).then(function(response){
            field = response.data.Abbr.replace(/ /g, "+");
            number = response.data.Number;
   
            if(field.length === 1)
                field += "++";

            var url = "https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?semester=&department=" + field + 
                "&course_number=" + number + "&course_title=&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search";
    
            $window.open(url, "_blank");
        });

    }
});

app.controller("DegreeCtrl", function($scope, $http){
    $scope.defaultInit = function(){ 
        $scope.defaultLDCores = [
            {number: "E E 302", name: "Introduction to Electrical Engineering"},
            {number: "E E 306", name: "Introduction to Computing"},
            {number: "E E 319K", name: "Introduction to Embedded Systems"},
            {number: "E E 411", name: "Circuit Theory"},
            {number: "E E 312", name: "Software Design and Implementation I"},
            {number: "E E 313", name: "Linear Systems and Signals"}
        ]
        
        $scope.defaultUDCores = [
            {number: "E E 333T", name: "Engineering Communication"},
            {number: "E E 351K", name: "Probability and Random Processes"},
            {number: "E E 364D", name: "Introduction to Senior Design"},
            {number: "E E 364E", name: "Interdisciplinary Entrepreneurship"},
            {number: "E E 464G", name: "Multidisciplinary Senior Design Project"},
            {number: "E E 464H", name: "Honors Senior Design Project"},
            {number: "E E 464K", name: "Senior Design Project"},
            {number: "E E 464R", name: "Research Senior Design Project"},
            {number: "E E 464S", name: "Startup Senior Design Project"}
        ]

        $scope.ldc = [];
        angular.copy($scope.defaultLDCores, $scope.ldc);
        
        $scope.udc = [];
        angular.copy($scope.defaultUDCores, $scope.udc);
        
        $scope.years = [];
        $scope.yearID = 0;

        $scope.years.push(
            {id: $scope.yearID++, fall: [], spring: []}
        );
    }

    $scope.reset = function(){
        $scope.years= [];
        $scope.years.push(
            {id: 0, fall: [], spring: []}
        );

        angular.copy($scope.defaultLDCores, $scope.ldc);
        angular.copy($scope.defaultUDCores, $scope.udc);
    }

    $scope.addYear = function() {
        $scope.years.push(
            {id: $scope.yearID++, fall: [], spring: []}
        );
    }

});

/*
 *
 *
            {number: "E E 302", name: "Introduction to Electrical Engineering"},
            {number: "E E 306", name: "Introduction to Computing"},
            {number: "E E 319K", name: "Introduction to Embedded Systems"},
            {number: "E E 411", name: "Circuit Theory"},
            {number: "E E 312", name: "Software Design and Implementation I"},
            {number: "E E 313", name: "Linear Systems and Signals"}
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
*/

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
