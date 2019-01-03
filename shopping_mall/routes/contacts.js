var express = require("express");
var router  = express.Router();
var ContactsModel = require("../models/ContactsModel");

router.get("/", function(req, res) {

    ContactsModel.find({}, function(err, contacts) {
        res.render("contacts/contacts", {
            "contacts" : contacts
        })
    });
});

router.get("/write", function(req,res){
    res.render("contacts/form");
});

router.post('/write', function(req,res){
    var contact = new ContactsModel({
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
    });
    contact.save(function(err){
        res.redirect('/contacts');
    });
});

router.get("/detail/:id", function(req, res){
    
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ContactsModel.findOne( { "id" :  req.params.id } , function(err ,contact){
        res.render("contacts/contactsDetail", { contact: contact });  
    });
});

module.exports = router;