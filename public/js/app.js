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
        defaultldc = [
            {abbr: "EE", number: "302"},
            {abbr: "EE", number: "306"},
            {abbr: "EE", number: "319K"},
            {abbr: "EE", number: "411"},
            {abbr: "EE", number: "312"},
            {abbr: "EE", number: "313"}
        ]
        
        defaultudc = [
            {abbr: "EE", number: "333T"},
            {abbr: "EE", number: "351K"},
            {abbr: "EE", number: "364D"},
            {abbr: "EE", number: "364E"},
            {abbr: "EE", number: "464G"},
            {abbr: "EE", number: "464H"},
            {abbr: "EE", number: "464K"},
            {abbr: "EE", number: "464R"},
            {abbr: "EE", number: "464S"}
        ]

        $scope.ldc = [];
        for(let c of defaultldc)
            fetchCourse(function(a) {
                $scope.ldc.push(a);
            }, c);
        
        $scope.udc = [];
        for(let c of defaultudc)
            fetchCourse(function(a) {
                $scope.udc.push(a);
            }, c);

        console.log($scope.ldc);
        
        $scope.years = [];
        $scope.yearID = 0;

        $scope.years.push(
            {id: $scope.yearID++, fall: [], spring: []}
        );
    }
    
    fetchCourse = function(callback, course) {
        $http.get("/search/" + course.abbr + "/" + course.number).then(function(response) {
            callback(response.data);
        });
    }

    $scope.reset = function(){
    	$scope.defaultInit();
	}

    $scope.addYear = function() {
        $scope.years.push(
            {id: $scope.yearID++, fall: [], spring: []}
        );
    }

});

