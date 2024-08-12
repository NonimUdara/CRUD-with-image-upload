const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname)
    },
});

var upload = multer({
    storage: storage,
}).single("image");

router.get("/", (req, res) => {
    // res.send("Home page");
    res.render("index", {title: "Home"});
});

router.get("/add", (req, res) => {
    res.render("add_users", {title: "Add users"});
});

module.exports = router;
