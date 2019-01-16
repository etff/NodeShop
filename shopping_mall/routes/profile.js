var express = require("express");
var router  = express.Router();
var UsersModel = require("../models/UserModel");


router.get("/", function(req, res) {

    UsersModel.find({}, function(err, Users) {
        res.render("contacts/contacts", {
            "contacts" : contacts
        })
    });
});

router.get("/edit/:id", function(req, res) {

    ContactsModel.findOne({ id : req.params.id},  function(req, contact) {
        res.render("contacts/form", { contact : contact }); 
    });
});

router.post("/edit/:id", function(req, res) {

    var query = {
        name    : req.body.name,
        phone   : req.body.phone,
        email   : req.body.email
    }

    ContactsModel.update({ id : req.params.id }, { $set : query }, function(err) {
        res.redirect("/contacts/detail/" + req.params.id );  
    });
});

module.exports = router;