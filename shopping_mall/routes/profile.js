var express = require("express");
var router  = express.Router();
var UsersModel = require("../models/UserModel");
var loginRequired = require('../libs/loginRequired');
var passport = require('passport');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (user, done) {
    UsersModel.findOne({ id : userId} , function (err, user) {
        done(null, user);
    });
});

router.get("/", loginRequired, function(req, res) {
    res.render('profile/index', { user : req.user });
});

router.get("/edit", loginRequired, function(req, res) {
    res.render('profile/form', { user : req.user });
});

router.post("/edit", loginRequired, function(req, res) {

    var query = {
        displayname : req.body.displayname
    };

    // 패스워드가 있으면 셋팅
    if (req.body.password) {
        query.password = passwordHash(req.body.password);
    }

    UserModel.update({ id : req.user.id } , { $set : query }, function( err ) {
        res.redirect('/profile');
    });
});

module.exports = router;