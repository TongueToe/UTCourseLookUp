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
    response.send("Class sent is: " + request.query.course);
    console.log("Course received: " + request.query.course);

    MongoClient.connect('mongodb://admin:123@ds151008.mlab.com:51008/heroku_k0jd41mf')
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


