var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        // https://devlopers.facebook.com에서 appId 및 secretID 발급
        
        callbackURL : "https://localhost:3000/auth/facebook/callback",
        profileFields : ['id', 'displayName', 'photo', 'email'] //받고 싶은 필드 나열
    },

    function(accessToken, refreshToken, profile, done) {
        //
    }
));





//로그인 성공시 이동할 주소
router.get('/facebook/success', function(req,res){
    res.send(req.user);
});

router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail');
});

module.exports = router;
