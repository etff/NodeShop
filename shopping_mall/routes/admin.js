var express = require("express");
var router = express.Router();
var ProductsModel = require("../models/ProductsModel");
var CommentsModel = require("../models/CommentsModel");

router.get("/", function(req, res) {
    res.send("admin page");
});

router.get("/products", function(req, res) {
    
    ProductsModel.find({}, function(err, products) {
        res.render("admin/products", {
            "products": products
        });
    });
});

router.get("/products/write", function(req, res) {
    res.render("admin/form", { product : "" });
});

router.post('/products/write', function(req,res){
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
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
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
        //제품정보를 받고 그안에서 댓글을 받아온다.
        CommentsModel.find({ product_id : req.params.id } , function(err, comments){
            res.render('admin/productsDetail', { product: product , comments : comments });
        });        
    });
});


router.get("/products/edit/:id" , function(req, res) {

    // 기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    ProductsModel.findOne({ id : req.params.id }, function(err, product) {
        res.render("admin/form", { product : product });
    });
});

router.post("/products/edit/:id", function(req, res) {

    // 넣을 변수 값을 셋팅한다.
    var query = {
        name    : req.body.name,
        price   : req.body.price,
        description :   req.body.description
    };

    // update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    ProductsModel.update({ id : req.params.id }, { $set : query }, function(err) {
        res.redirect("/admin/products/detail/" + req.params.id );   // 수정 후 본래보던 상세페이지로
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

module.exports = router;