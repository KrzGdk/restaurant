var express = require('express');
var session = require('express-session');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/restaurant");

var server = require('http' ).createServer(app);
var io = require('socket.io').listen(server);
io.on('connection', function (socket) { });

app.use(session({secret: 'sessionsecretzxhzrstve8rv9s5tr'}));
app.use('/', require("./router/router")(io));

server.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});