var express = require('express');
var cors = require('cors')
var mongoClient = require('mongodb').MongoClient;
var app = express();
app.use(cors())

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/menu', function (req, res) {
    mongoClient.connect('mongodb://localhost:27017/restaurant-db', function (err, db) {
        if (err) throw err;

        db.collection('menu').find().toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        })
    })
});

app.get('/menu-del', function (req, res) {
    mongoClient.connect('mongodb://localhost:27017/restaurant-db', function (err, db) {
        if (err) throw err;

        db.collection('menu').deleteMany(function () {
            return true;
        });
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});