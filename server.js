var express = require('express');
var app = express();
var fs = require("fs");

//var MongoClient = require('mongodb');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var router = express.Router()

// Requests

router.get('/init', function(request, response) {
    fs.readFile("fields.json", function(err, data) {
        response.json(data.toString());
    });
});

router.get('/search/field/:field', function(request, response){
    var req = request.params.field.replace(/ /g, '').toUpperCase();

    fs.readFile("courses.json", function(err, data) {
        var courses = JSON.parse(data);
        var results = [];

        for(i = 0; i< courses.length; i++){
            if(req == courses[i].Abbr.toUpperCase().replace(/ /g, '')){
                results.push(courses[i]);
            }
        }
        response.json(results);
    });

});

router.get('/search/:field/:course', function(request, response){
    var field = request.params.field.replace(/ /g, '').toUpperCase();
    var course = request.params.course.replace(/ /g, '').toUpperCase();

    fs.readFile("courses.json", function(err, data){
        var courses = JSON.parse(data);
        for(i = 0; i < courses.length; i++){
            if(field == courses[i].Abbr.toUpperCase().replace(/ /g, '') && course == courses[i].Number.toUpperCase().replace(/ /g, ''))
                response.json(courses[i]);
        }
    });
});

app.use(router);

app.listen(app.get('port'), function() {
    console.log('Running on port', app.get('port'));
});


