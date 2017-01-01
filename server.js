var express = require('express');
var app = express();

var MongoClient = require('mongodb');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// Resources
app.get('/partial-course.html', function(request, response){
    response.sendFile('partial-course.html', {"root": __dirname});
});

app.get('/css/simple-sidebar.css', function(request, response) {
    console.log("CSS loaded");
    response.sendFile("css/simple-sidebar.css", {"root": __dirname});
});

app.get('/app.js', function(request, response){
    console.log("app.js loaded");
    response.sendFile("app.js", {"root": __dirname});
});

// Requests
app.get('/', function(request, response) {
    response.sendFile("index.html", {"root": __dirname});
});

app.get('/fetch', function(request, response){
    var req = request.query.course;

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
            "Number" : num
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
            console.log(courses);
            
            if(courses.length == 0){
                response.send("Error 0");
            }
            else{
                response.send(JSON.stringify(courses));
        }
        });

    });

});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


