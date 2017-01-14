var express = require('express');
var app = express();
var fs = require("fs");

//var MongoClient = require('mongodb');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// Route
var router = express.Router()

router.get('/partial-search.html', function(request, response){
    response.sendFile('partial-search.html', {"root": __dirname});
});

router.get('/css/bootstrap.css', function(request, response) {
    response.sendFile("css/bootstrap.css", {"root": __dirname});
});

router.get('/css/custom.css', function(request, response) {
    response.sendFile("css/custom.css", {"root": __dirname});
});

router.get('/app.js', function(request, response){
    response.sendFile("app.js", {"root": __dirname});
});

router.get('/favicon.ico', function(request, response){
    response.sendFile("favicon.ico", {"root": __dirname});
});

// Requests
router.get('/', function(request, response) {
    response.sendFile("index.html", {"root": __dirname});
});

router.get('/init', function(request, response) {
    fs.readFile("fields.json", function(err, data) {
        response.json(data.toString());
    });
});

router.get('/search/field/:course', function(request, response){
    var req = request.params.course;
    /*

    // string process
    req = req.toUpperCase().replace(/ /g, "");
    var indexOfFirstNum = req.indexOf(req.match(/\d/));

    var abbr = req.substring(0, indexOfFirstNum);
    var num = req.substring(indexOfFirstNum);

    if(indexOfFirstNum < 1){
        abbr = req;

        queryObj = {
            "Abbr" : abbr
        }
    }
    else {
        queryObj = {
            "Abbr" : abbr,
            "Number" : new RegExp(num)
        }
    }
    */

    var courses; 
    fs.readFile("courses.json", function(err, data) {
        courses = JSON.parse(data);  
        var data = {
            'courses': courses
        }

        var results = [];
        for(i = 0; i< courses.length; i++){
            if(req.localeCompare(courses[i].Abbr) == 0){
                results.push(courses[i]);
            }
        }
        response.json(results);
    });

    /*
    MongoClient.connect('mongodb://admin:123@ds151008.mlab.com:51008/heroku_k0jd41mf', function (err, db){
        if (err){
            throw error;
        }
        
        db.collection('utcourses').find(queryObj).toArray(function(err, courses){
            if(err) {
                throw err;
            }

            if(courses.length == 0){
                response.send("Invalid Course");
            }
            else{
                response.json(courses);
        }
        });

    });
    */
});

app.use(router);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


