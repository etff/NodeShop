var express = require("express");
var path = require("path");
var admin = require("./routes/admin")
var contacts = require("./routes/contacts")
var app = express();
var port = 3000;
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');

//MongoDB 접속
var mongoose = require('mongoose');

// NoodeJS의 내장 Promise로 변경
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('mongodb connect');
});

mongoose.connect('mongodb://127.0.0.1:27017/fastcampus', { useMongoClient: true });

// 확장자가 ejs 로 끝나는 뷰 엔진을 추가한다.
app.set("views", path.join(__dirname, "views"));
console.log(__dirname);
app.set("view engine", "ejs");

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.send("first app");
});

// 미들웨어 사용
app.use("/admin", admin);
app.use("/contacts", contacts);
app.use(cookieParser());

app.listen( port, function() {
    console.log("Express Listening on port", port);
});