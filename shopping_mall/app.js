var express = require("express");
var path = require("path");
var admin = require("./routes/admin")
var app = express();
var port = 3000;

// 확장자가 ejs 로 끝나는 뷰 엔지을 추가한다.
app.set("views", path.join(__dirname, "views"));
console.log(__dirname);
app.set("view engine", "ejs");


app.get('/', function(req, res) {
    res.send("first app");
});



app.use("/admin", admin);

app.listen( port, function() {
    console.log("Express Listening on port", port);
});