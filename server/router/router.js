module.exports = function (websocket) {

    var express = require('express');
    var router = express.Router();

    var fs = require('fs');

    var models = require('../model/init');
    // router.use(require("../auth/auth"));  TODO turn on on deploy

    router.get('/', function (req, res) {
        res.send('Hello World!')
    });

    router.get('/dish', function (req, res) {
        models.Dish.find(function (err, db) {
            if (err) throw err;
            res.send(db);
        })
    });

    router.get('/init', function (req, res) {
        var dishes = fs.readFileSync("init-data/menu.json");
        dishes = JSON.parse(dishes);
        console.log(JSON.stringify(dishes));
        for (var i = 0; i < dishes.length; i++) {
            var model = new models.Dish();
            model.name = dishes[i].name;
            model.thumbnail = dishes[i].thumbnail;
            model.active = true;
            console.log(model);
            model.save(function (err, p) {
                if (err) console.error(err);
                else console.log(p);
            });
        }
        res.sendStatus(200);
    });

    router.get('/menu-del', function (req, res) {
        models.Dish.find({}).remove(function (err) {
            if (err) res.sendStatus(400);
            else res.sendStatus(200);
        });
    });
    return router;

};