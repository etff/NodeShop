var express = require('express');
var router = express.Router();
var CheckoutModel = require('../models/CheckoutModel');

var request = require('request');
var cheerio = require('cheerio');
var removeEmpty = require('../libs/removeEmpty');

const { Iamporter, IamporterError } = require('iamporter');
const iamporter = new Iamporter({
    apiKey: process.env.iamport_key,
    secret: process.env.iamport_secret
});
router.get('/' , function(req, res){
    
    var totalAmount = 0; //총결제금액
    var cartList = {}; //장바구니 리스트
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    if( typeof(req.cookies.cartList) !== 'undefined'){
        //장바구니데이터
        var cartList = JSON.parse(unescape(req.cookies.cartList));

        //총가격을 더해서 전달해준다.
        for( let key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('checkout/index', { cartList : cartList , totalAmount : totalAmount } );
});

router.get('/complete', (req,res)=>{

    var asyncFunc = async ()=>{
        var payData = await iamporter.findByImpUid(req.query.imp_uid);
        var checkout = new CheckoutModel({
            imp_uid : payData.data.imp_uid,
            merchant_uid : payData.data.merchant_uid,
            paid_amount : payData.data.amount,
            apply_num : payData.data.apply_num,
            
            buyer_email : payData.data.buyer_email,
            buyer_name : payData.data.buyer_name,
            buyer_tel : payData.data.buyer_tel,
            buyer_addr : payData.data.buyer_addr,
            buyer_postcode : payData.data.buyer_postcode,

            status : "결재완료"
    });
    await checkout.save();
    };
    asyncFunc().then( function(result) {
        res.redirect('/checkout/success');
    });
});


router.post('/mobile_complete', (req,res)=>{
    var checkout = new CheckoutModel({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status,
    });

    checkout.save(function(err){
        res.json({message:"success"});
    });
});

router.get('/success', function(req,res){
    res.render('checkout/success');
});

router.get('/nomember', function(req,res){
    res.render('checkout/nomember');
});

router.get('/nomember/search', function(req,res){
    CheckoutModel.find({ buyer_email : req.query.email }, function(err, checkoutList){
        res.render('checkout/search', { checkoutList : checkoutList } );
    });
});

router.get('/shipping/:invc_no', (req,res)=>{

    //대한통운의 현재 배송위치 크롤링 주소
    var url = "https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=" + req.params.invc_no ;
    var result = []; //최종 보내는 데이터
    request(url, (error, response, body) => {  
        //한글 변환
        var $ = cheerio.load(body, { decodeEntities: false });

        var tdElements = $(".board_area").find("table.mb15 tbody tr td"); //td의 데이터를 전부 긁어온다
        console.log( removeEmpty(tdElements[10].children[0].data));
        res.send('111');
    });
});

module.exports = router;