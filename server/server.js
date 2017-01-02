var express = require('express');
var session = require('express-session');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
var multer = require('multer'); // v1.0.5
var upload = multer({ dest: 'upload/'});
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(bodyParser.json());
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/restaurant");

var server = require('http' ).createServer(app);
var websocket = require('socket.io').listen(server);
websocket.on('connection', function (socket) { });

app.use(session({secret: 'sessionsecretzxhzrstve8rv9s5tr'}));
app.use('/', require("./router/router")(websocket, upload));

server.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});