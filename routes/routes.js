const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // res.send("Home page");
    res.render("index", {title: "Home"});
});

router.get("/add", (req, res) => {
    res.render("add_users", {title: "Add users"});
});

module.exports = router;
