var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;

require('dotenv').config();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('kakao-login', new KakaoStrategy({
    clientID : process.env.kakao_clientID,
    clientSecret : process.env.kakao_clientSecret,
    callbackURL : 'http://localhost:3000/auth/kakao/callback'
},
function(accessToken, refreshToken, profile, done) {
        
    //console.log(profile);
    UserModel.findOne({ username : "kakao_" + profile.id }, function(err, user) {
        if(!user) {
            var regData = { // DB에 등록 및 세션에 등록될 데이터
                username : "kakao_" + profile.id,
                password : "kakao_login",
                displayname : profile.displayName
            };
            var User = new UserModel(regData);
            User.save(function(err) {
                done(null, regData);
            });
        } else {    // 있으면 DB에서 가져와서 세션등록
            done(null, user);
        }
    });
}

));

passport.use(new FacebookStrategy({
        // https://devlopers.facebook.com에서 appId 및 secretID 발급
        clientID : process.env.facebook_clientID,
        clientSecret : process.env.facebook_clientSecret,
        callbackURL : "https://localhost:3000/auth/facebook/callback",
        profileFields : ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },

    function(accessToken, refreshToken, profile, done) {
        
        //console.log(profile);
        UserModel.findOne({ username : "fb_" + profile.id }, function(err, user) {
            if(!user) {
                var regData = { // DB에 등록 및 세션에 등록될 데이터
                    username : "fb_" + profile.id,
                    password : "fackbook_login",
                    displayname : profile.displayName
                };
                var User = new UserModel(regData);
                User.save(function(err) {
                    done(null, regData);
                });
            } else {    // 있으면 DB에서 가져와서 세션등록
                done(null, user);
            }
        });
    }
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}) );

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook', 
        { 
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail' 
        }
    )
);

router.get('/kakao', passport.authenticate('kakao-login'));
router.get('/kakao/callback', 
    passport.authenticate('kakao-login',
    {
        successRedirect: '/',
        failureRedirect: '/auth/facebook/fail' 
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
