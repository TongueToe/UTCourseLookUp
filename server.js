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

router.get('/search/field/:field', function(request, response){
    var req = request.params.field;

    fs.readFile("courses.json", function(err, data) {
        var courses = JSON.parse(data);

        var results = [];
        for(i = 0; i< courses.length; i++){
            if(req.localeCompare(courses[i].Abbr) == 0){
                results.push(courses[i]);
            }
        }
        response.json(results);
    });

});

app.use(router);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


