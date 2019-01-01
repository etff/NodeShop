var express = require("express");
var router  = express.Router();
var ContactsModel = require("../models/ContactsModel");

router.get("/", function(req, res) {
    res.send("contacts page");
});

router.get("contacts", function(req, res) {

    
});

module.exports = router;