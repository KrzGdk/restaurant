module.exports = function (websocket, upload) {

    var express = require('express');
    var router = express.Router();

    var fs = require('fs');

    var models = require('../model/init');
    var reservations = require('../service/reservations');
    // router.use(require("../auth/auth"));  TODO turn on on deploy
    router.post('/login', function (req, res) {
        if (req.session.user) {
            res.sendStatus(200);
            return;
        }
        models.User.findOne({'username': req.body.username}, function (err, user) {
            if (user) {
                req.session.user = user;
                res.sendStatus(200);
            }
            else res.sendStatus(401);
        });
    });

    router.post('/logout', function (req, res) {
        req.session.user = null;
        res.sendStatus(200);
    });

    router.get('/', function (req, res) {
        res.send('Hello World!')
    });

    router.get('/reservations', function (req, res) {
        reservations.findReservations(req.query, function (err, db) {
            if (err) throw err;
            res.send(db);
        });
    });

    router.post('/reservations', function (req, res) {
        var date = new Date(req.body.date);
        var beginTimeDate = new Date(req.body.beginTime);
        var endTimeDate = new Date(req.body.endTime);
        var hasValidationError = false;
        reservations.findReservations({
            date: date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
            beginTime: beginTimeDate.getHours() + ":" + beginTimeDate.getMinutes(),
            endTime: endTimeDate.getHours() + ":" + endTimeDate.getMinutes()
        }, function (err, db) {
            if (err) throw err;
            if (db && db.some(function (r) {
                    return req.body.tables.indexOf(r.tables) >= 0;
                })) {
                hasValidationError = true;
                res.status(400).send({validationError: "Niepoprawny termin rezerwacji"});
            }
        });
        if (hasValidationError) {
            return;
        }
        var r = new models.Reservation();
        r.date = req.body.date;
        r.beginTime = req.body.beginTime;
        r.endTime = req.body.endTime;
        r.tables = req.body.tables;
        r.menu = req.body.menu;
        r.email = req.body.email;
        r.phone = req.body.phone;
        r.save(function (err, r) {
            if (err) res.sendStatus(500);
            else {
                res.sendStatus(200);
            }
        });
    });

    router.get('/categories', function (req, res) {
        models.Category.find({}, function (err, db) {
            if (err) throw err;
            res.send(db);
        })
    });

    router.get('/dish', function (req, res) {
        models.Dish.find({
            active: true
        }, function (err, db) {
            if (err) throw err;
            res.send(db);
        })
    });

    router.get('/dish-all', function (req, res) {
        models.Dish.find({}, function (err, db) {
            if (err) throw err;
            res.send(db);
        })
    });

    router.get('/dish-w-details', function (req, res) {
        models.Dish.findOne({
            _id: req.query.id
        }, function (err, dish) {
            if (err) throw err;
            models.Details.findOne({
                dishId: req.query.id
            }, function (err, details) {
                if (err) throw err;
                res.send({
                    dish: dish,
                    details: details
                });
            });
        })
    });

    router.post('/dish-w-details/:id', upload.single("file"), function (req, res) {
        function updateDish(dish, thumbnailPath) {
            dish.name = req.body.name;
            dish.active = req.body.active;
            dish.category = req.body.category;
            if (thumbnailPath) {
                dish.thumbnail = thumbnailPath;
            }
            dish.save(function () {
                models.Details.findOne({
                    dishId: req.params.id
                }, function (err, details) {
                    if (err) throw err;
                    details.description = req.body.description;
                    details.ingredients = req.body.ingredients.split(",").filter(function (i) {
                        return i != "";
                    });
                    details.save(function () {
                        res.send({
                            dish: dish,
                            details: details
                        });
                    });
                })
            });
        }

        models.Dish.findOne({
            _id: req.params.id
        }, function (err, dish) {
            if (err) throw err;

            if (req.file) {
                var tmpPath = req.file.path;

                var src = fs.createReadStream(tmpPath);
                var thumbnailPath = tmpPath + "." + req.file.originalname.split('.').pop();
                var dest = fs.createWriteStream("app\\img\\menu\\thumbnails\\" + thumbnailPath);
                src.pipe(dest);
                src.on('end', function () {
                    updateDish(dish, thumbnailPath);
                });
            }
            else {
                updateDish(dish);
            }
        })
    });

    router.post('/dish-w-details', upload.single("file"), function (req, res) {
        var tmpPath = req.file.path;

        var src = fs.createReadStream(tmpPath);
        var thumbnailPath = tmpPath + "." + req.file.originalname.split('.').pop();
        var dest = fs.createWriteStream("app\\img\\menu\\thumbnails\\" + thumbnailPath);
        src.pipe(dest);
        src.on('end', function () {
            fs.unlink(tmpPath);
            var dish = new models.Dish();
            dish.name = req.body.name;
            dish.thumbnail = thumbnailPath;
            dish.category = req.body.category;
            dish.active = true;
            console.log(dish);
            dish.save(function (err, dish) {
                if (err) console.error(err);
                else {
                    console.log(dish);
                    var details = new models.Details();
                    details.dishId = dish._id;
                    details.description = req.body.description;
                    details.ingredients = req.body.ingredients.split(",").filter(function (i) {
                        return i != "";
                    });
                    details.save(function (err, p) {
                        if (err) console.error(err);
                        else console.log(p);
                        res.sendStatus(200);
                    });
                }
            });
        });

    });

    router.post('/dish/:id/deactivate', function (req, res) {
        models.Dish.findOne({
            _id: req.params.id
        }, function (err, d) {
            if (err) throw err;
            d.active = false;
            d.save(function (err, d2) {
                if (err) throw err;
                res.send(d2);
            });
        })
    });

    router.post('/dish/:id/activate', function (req, res) {
        models.Dish.findOne({
            _id: req.params.id
        }, function (err, d) {
            if (err) throw err;
            d.active = true;
            d.save(function (err, d2) {
                if (err) throw err;
                res.send(d2);
            });
        })
    });

    router.get('/details', function (req, res) {
        if (!req.query.d) {
            res.status(400).send("No id supplied");
            return;
        }
        models.Details.findOne({
            dishId: req.query.d
        }, function (err, db) {
            if (err) throw err;
            res.send(db);
        })
    });

    router.get('/comments', function (req, res) {
        if (!req.query.d) {
            res.status(400).send("No id supplied");
            return;
        }
        models.Comment.find({
            dishId: req.query.d
        }, function (err, db) {
            if (err) throw err;
            res.send(db);
        });
    });

    router.post('/comments', function (req, res) {
        var comment = new models.Comment();
        if (!req.body.dishId || !req.body.name || !req.body.text || !req.body.rating ||
            req.body.dishId == "" || req.body.name == "" || req.body.text == "" || req.body.rating == "") {
            res.sendStatus(400);
            return;
        }
        comment.dishId = req.body.dishId;
        comment.name = req.body.name;
        comment.text = req.body.text;
        comment.rating = parseInt(req.body.rating);
        comment.save(function (err, c) {
            if (err) res.sendStatus(500);
            else {
                res.sendStatus(200);
                websocket.emit('comment.new', c);
            }
        });
    });

    function addMenu() {
        var dishes = fs.readFileSync("server/init-data/menu.json");
        dishes = JSON.parse(dishes);
        console.log(JSON.stringify(dishes));
        for (var i = 0; i < dishes.length; i++) {
            var dish = new models.Dish();
            dish.name = dishes[i].name;
            dish.thumbnail = dishes[i].thumbnail;
            dish.category = dishes[i].category;
            dish.active = true;
            console.log(dish);
            dish.save(
                (function (inner_i) {
                    return function (err, dish) {
                        if (err) console.error(err);
                        else {
                            console.log(dish);
                            var details = new models.Details();
                            details.dishId = dish._id;
                            details.description = dishes[inner_i].details.description;
                            details.ingredients = dishes[inner_i].details.ingredients;
                            details.save(function (err, p) {
                                if (err) console.error(err);
                                else console.log(p);
                            });
                        }
                    }
                })(i)
            );
        }
    }

    function addCategories() {
        var categories = fs.readFileSync("server/init-data/categories.json");
        categories = JSON.parse(categories);
        console.log(JSON.stringify(categories));
        for (var i = 0; i < categories.length; i++) {
            var model = new models.Category();
            model.name = categories[i].name;
            console.log(model);
            model.save(function (err, p) {
                if (err) console.error(err);
                else console.log(p);
            });
        }
    }

    router.post('/init', function (req, res) {
        addCategories();
        addMenu();
        res.sendStatus(200);
    });

    router.get('/initUser', function (req, res) {
        var model = new models.User();
        model.username = "admin";
        model.password = "secret";
        model.save(function (err, p) {
            if (err) console.error(err);
            else console.log(p);
        });
        res.sendStatus(200);
    });

    router.post('/reset', function (req, res) {
        function removeAll(model) {
            var hasError = false;
            model.find({}).remove(function (err) {
                if (err) hasError = true;
            });
            return hasError;
        }

        var hasErrors = [removeAll(models.Reservation), removeAll(models.Category),
            removeAll(models.Details), removeAll(models.Dish)];
        if (hasErrors.indexOf(true) != -1) {
            res.status(500).send("error");
        } else {
            res.status(200).send("OK");
        }
    });

    return router;

};