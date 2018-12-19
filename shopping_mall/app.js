var express = require("express");
var admin = require("./routes/admin")
var app = express();
var port = 3000;

app.get('/', function(req, res) {
    res.send("first app");
});

app.use("/admin", admin);

app.listen( port, function() {
    console.log("Express Listening on port", port);
});