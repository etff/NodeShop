var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.send("admin page");
});

router.get("/products", function(req, res) {
    // res.send("admin products");
    res.render("admin/products", {
        "school": "nodejs",
        "camp"  : "javascript"
    });
});

module.exports = router;