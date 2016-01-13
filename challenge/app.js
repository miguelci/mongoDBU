var express = require('express'),
app = express(),
engines = require('consolidate'),
MongoClient = require('mongodb').MongoClient,
assert = require('assert'), 
bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/new_movie', function(req, res){
    res.render('new_movie');
});

app.post('/result', function(req, res, next){
    var title = req.body.title,
    year = req.body.year, 
    imdb = req.body.imdb;

    if (title != undefined && year != undefined && imdb != undefined){
        MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

            assert.equal(null, err);
            console.log("Successfully connected to MongoDB.");
            console.log(title, year, imdb);

            var inserted = db.collection('movies').insertOne({
                'title': title, 'year': year, 'imdb': imdb
                });
            console.log(inserted);
            db.close();
        });
        res.render('result', {result: "Filme inserido"});
    } else {
        res.render('result', {result: "Filme não inserido"});
    }
});

// MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

//     assert.equal(null, err);
//     console.log("Successfully connected to MongoDB.");

//     app.get('/', function(req, res){

//         db.collection('movies').find({}).toArray(function(err, docs) {
//             res.render('movies', { 'movies': docs } );
//         });

//     });
// });

app.use(function(req, res){
    res.sendStatus(404);
});

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});




