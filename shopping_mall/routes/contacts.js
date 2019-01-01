var express = require("express");
var router  = express.Router();
var ContactsModel = require("../models/ContactsModel");

router.get("/", function(req, res) {
    res.send("contacts page");
});

router.get("/contacts", function(req, res) {

    ContactsModel.find({}, function(err, contacts) {
        res.render("contacts/contacts", {
            "contacts" : contacts
        })
    });
});

router.get("/contacts/write", function(req,res){
    res.render("contacts/form");
});

router.post('/contacts/write', function(req,res){
    var contact = new ContactsModel({
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
    });
    contact.save(function(err){
        res.redirect('/contacts/contacts');
    });
});

module.exports = router;