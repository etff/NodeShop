var express = require("express");
var router  = express.Router();
var ContactsModel = require("../models/ContactsModel");
var CommentsModel = require("../models/CommentsModel");

router.get("/", function(req, res) {

    ContactsModel.find({}, function(err, contacts) {
        res.render("contacts/contacts", {
            "contacts" : contacts
        })
    });
});

router.get("/write", function(req,res){
    res.render("contacts/form", { contact : "" });
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

router.get("/edit/:id", function(req, res) {

    ContactsModel.findOne({ id : req.params.id},  function(req, contact) {
        res.render("contacts/form", { contact : contact }); 
    });
});

router.get("/delete/:id", function(req, res) {
    ContactsModel.remove({ id : req.params.id }, function(err) {
        res.redirect("/contacts");
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

router.get("/detail/:id", function(req, res){
    
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ContactsModel.findOne( { "id" :  req.params.id } , function(err ,contact){
        res.render("contacts/contactsDetail", { contact: contact });  
    });
});

router.post("/ajax_comment/insert", function(req, res) {

    var comment = new CommentsModel({
        content : req.body.content,
        contact_id : parseInt(req.body.contact_id)
    });
    
    comment.save(function(err, comment){
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

module.exports = router;