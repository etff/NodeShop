var express = require("express");
var router = express.Router();
var ProductsModel = require("../models/ProductsModel");

router.get("/", function(req, res) {
    res.send("admin page");
});

router.get("/products", function(req, res) {
    
    ProductsModel.find({}, function(err, products) {
        res.render("admin/products", {
            "products": products
        });
    });
    
    // res.send("admin products");
    
});

router.get("/products/write", function(req, res) {
    res.render("admin/form");
});

router.post('/products/write', function(req,res){
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
    });
    product.save(function(err){
        res.redirect('/admin/products');
    });
});

router.get("/products/detail/:id", function(req, res) {
    
    // url에서 변수 값을 받아올땐 req.params.id 로 받아온다.
    ProductsModel.findOne( { "id" : req.params.id }, function(err, product) {
        res.render("admin/productsDetails", { product: product });
    });
})

module.exports = router;