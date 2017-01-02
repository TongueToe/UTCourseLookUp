var express = require('express');
var app = express();

var MongoClient = require('mongodb');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// Route
var router = express.Router()

router.get('/partial-course.html', function(request, response){
    response.sendFile('partial-course.html', {"root": __dirname});
});

router.get('/css/simple-sidebar.css', function(request, response) {
    response.sendFile("css/simple-sidebar.css", {"root": __dirname});
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

router.get('/search/:course', function(request, response){
    var req = decodeURIComponent(request.params.course);
    console.log("Before: " + request.params.course)
    console.log("After: " + req);

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
                response.send(JSON.stringify(courses));
        }
        });

    });

});

app.use(router);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


