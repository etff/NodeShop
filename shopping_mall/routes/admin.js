var express = require("express");
var router = express.Router();
var ProductsModel = require("../models/ProductsModel");
var CommentsModel = require("../models/CommentsModel");
var loginRequired = require('../libs/loginRequired.js');
var checkoutModel = require('../models/CheckoutModel');
var co = require('co');
var paginate = require('express-paginate');

// 이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
var fs = require('fs');

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// multer 셋팅
var multer = require("multer");
var storage = multer.diskStorage({
    
    destination : function ( req, file, callback) {     // 이미지가 저장되는 도착지 지정
        callback(null, uploadDir);
    },
    filename : function (req, file, callback) {     // products 날짜.jpg(png) 저장
        callback(null, "products-" + Date.now() + "." + file.mimetype.split("/")[1]);
    }
});
var upload = multer({ storage : storage});


router.get("/", function(req, res) {
    res.send("admin page");
});

router.get('/products', paginate.middleware(3, 50), async (req,res) => {

    try{
        const [ results, itemCount ] = await Promise.all([
            ProductsModel.find().sort('-created_at').limit(req.query.limit).skip(req.skip).exec(),
            ProductsModel.count({})
        ]);
        const pageCount = Math.ceil(itemCount / req.query.limit);
        
        const pages = paginate.getArrayPages(req)( 4 , pageCount, req.query.page);

        res.render('admin/products', { 
            products : results , 
            pages: pages,
            pageCount : pageCount,
        });
    }catch(error) {
        throw(error);
    }
});

router.get('/products/write',loginRequired, csrfProtection , function(req,res){
    //edit에서도 같은 form을 사용하므로 빈 변수( product )를 넣어서 에러를 피해준다
    res.render( 'admin/form' , { product : "", csrfToken : req.csrfToken() }); 
});

router.post('/products/write',loginRequired, upload.single("thumbnail"), csrfProtection, function(req,res){

    console.log(req.file);

    var product = new ProductsModel({
        name        : req.body.name,
        price       : req.body.price,
        thumbnail   : (req.file) ? req.file.filename : "",
        description : req.body.description,
        username    : req.user.username
    });

    var validationError = product.validateSync();

    // if (validationError) {
    //     res.send(validationError);
    // } else {
    //     product.save(function(err){
    //         res.redirect('/admin/products');
    //     });
    // }

    if(!product.validateSync()) {       // 에러가 없으면 저장한다.
        product.save(function(err) {
            res.redirect("/admin/products");
        });
    }
});

router.get('/products/detail/:id' , function(req, res){
    var getData = async() => {
        return {
            product : await ProductsModel.findOne( { 'id' :  req.params.id }).exec(),
            comments : await CommentsModel.find( { 'product_id' :  req.params.id }).exec()
        };
    };
    getData().then( function(result){
        res.render('admin/productsDetail', 
            { product: result.product , comments : result.comments });
    });
});

router.get("/products/edit/:id" , csrfProtection, function(req, res) {

    // 기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    ProductsModel.findOne({ id : req.params.id }, function(err, product) {
        res.render("admin/form", { product : product, csrfToken : req.csrfToken() });
    });
});

router.post("/products/edit/:id", upload.single("thumbnail"), csrfProtection, function(req, res) {

    ProductsModel.findOne({ id : req.params.id}, function( err, product) {

        if(req.file && product.thumbnail) {      // 요청 중에 파일이 존재하고 파일리퀘스트가 있으면 이전이미지를 지운다.
            fs.unlinkSync( uploadDir + "/" + product.thumbnail );
        }

        // 넣을 변수 값을 셋팅한다.
        var query = {
            name    : req.body.name,
            thumbnail : (req.file) ? req.file.filename : product.thumbnail,
            price   : req.body.price,
            description :   req.body.description
        };
        
        var post = new ProductsModel(query);
        
        if(!post.validateSync()){
            ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
                //res.redirect('/posts/detail/' + req.params.id );
                res.redirect("/admin/products/detail/" + req.params.id );   // 수정 후 본래보던 상세페이지로
            });
        }
    });
});

router.get("/products/delete/:id", function(req, res) {
    ProductsModel.remove({ id : req.params.id }, function(err) {
        res.redirect("/admin/products");
    });
});

router.post("/products/ajax_comment/insert", function(req, res) {
    
    var comment = new CommentsModel({
        content : req.body.content,
        product_id : parseInt(req.body.product_id)
    });
    
    comment.save(function(err, comment){
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

router.post('/products/ajax_comment/delete', function(req, res){
    CommentsModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});

router.post('/products/ajax_summernote', loginRequired, 
    upload.single('thumbnail'), 
    
    function(req,res) {
        res.send( '/uploads/' + req.file.filename);
    }
);

router.get('/order', function(req,res){
    CheckoutModel.find( function(err, orderList){ //첫번째 인자는 err, 두번째는 받을 변수명
        res.render( 'admin/orderList' , 
            { orderList : orderList }
        );
    });
});

router.get('/order/edit/:id', function(req,res){
    CheckoutModel.findOne( { id : req.params.id } , function(err, order){
        res.render( 'admin/orderForm' , 
            { order : order }
        );
    });
});

module.exports = router;