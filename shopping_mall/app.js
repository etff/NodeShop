var express = require("express");
var path = require("path");
var admin = require("./routes/admin");
var accounts = require("./routes/accounts");
var contacts = require("./routes/contacts");
var profile = require("./routes/profile");
var products = require('./routes/products');
var home = require('./routes/home');
var auth = require("./routes/auth");
var chat = require('./routes/chat');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');

var app = express();
var port = 3000;

var logger = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require('express');


//flash  메시지 관련
var flash = require('connect-flash');

//passport 로그인 관련
var passport = require('passport');
var session = require('express-session');


//MongoDB 접속
var mongoose = require('mongoose');

// NoodeJS의 내장 Promise로 변경
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('mongodb connect');
});

mongoose.connect(process.env.DB_HOST, { useMongoClient: true });

// 확장자가 ejs 로 끝나는 뷰 엔진을 추가한다.
app.set("views", path.join(__dirname, "views"));
console.log(__dirname);
app.set("view engine", "ejs");

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 업로드 path 추가
app.use("/uploads", express.static("uploads"));

//static path 추가
app.use('/static', express.static('static'));

//session 관련 셋팅
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
});
app.use(sessionMiddleWare);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

app.use(function(req, res, next) {

    app.locals.isLogin = req.isAuthenticated();
    app.locals.userData = req.user; 
    next();
});

// 미들웨어 사용
app.use('/', home);
app.use("/admin", admin);
app.use("/contacts", contacts);
app.use("/accounts", accounts);
app.use("/auth", auth);
app.use('/chat', chat);
app.use('/profile', profile);
app.use('/products', products);
app.use('/cart', cart);
app.use('/checkout', checkout);

var server = app.listen( port, function() {
    console.log("Express Listening on port", port);
});

var listen = require('socket.io');
var io = listen(server);

// socket io passport 접근하기 위한 미들웨어 적용
io.use(function(socket, next){
    sessionMiddleWare(socket.request, socket.request.res, next);
});

require('./libs/socketConnection')(io);

//var socketConnection = require('./libs/socketConnection');
//socketConnection(io)