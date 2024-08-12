const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require("fs");

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

//insert an user into database route
// router.post('/add', upload, (req, res) => {
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: req.file.filename,
//     });
//     user.save((err) => {
//         if(err){
//             res.json({message: err.message, type: 'danger'});
//         } else {
//             req.session.message = {
//                 type: 'success',
//                 message: 'User added successfully'
//             };
//             res.redirect('/');
//         }
//     });
// })
router.post('/add', upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
        created: new Date()  // Manually setting the `created` field
    });

    try {
        await user.save();
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({message: err.message, type: 'danger'});
    }
});



//get all users
// router.get("/", (req, res) => {
//     // res.send("Home page");
//     // res.render("index", {title: "Home"});
//     User.find().exec((err, users) => {
//         if(err){
//             res.json({ message: err.message });
//         } else {
//             res.render('index', {
//                 title: 'Home page',
//                 users: users,
//             });
//         }
//     });
// });
router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get("/add", (req, res) => {
    res.render("add_users", {title: "Add users"});
});

//edit an user route
// router.get('/edit/:id', (req, res) => {
//     let id = req.params.id;
//     User.findById(id, (err, user) => {
//         if(err){
//             res.redirect('/');
//         } else {
//             if(user == null){
//                 res.redirect('/');
//             } else {
//                 res.render("edit_users", {
//                     title: "Edit User",
//                     user: user,
//                 });
//             }
//         }
//     });
// });
router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user == null) {
            res.redirect('/');
        } else {
            res.render("edit_users", {
                title: "Edit User",
                user: user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});

//update user route
// router.post('/update/:id', upload, (req, res) => {
//     let id = req.params.id;
//     let new_image = '';

//     if(req.file){
//         new_image = req.file.filename;
//         try{
//             fs.unlinkSync('./uploads/' + req.body.old_image);
//         } catch(err){
//             console.log(err);
//         }
//     } else {
//         new_image = req.body.old_image;
//     }
//     User.findByIdAndUpdate(id, {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: new_image,
//     }, (err, result) => {
//         if(err){
//             res.json({ message: err.message, type:"danger" });
//         } else {
//             req.session.message = {
//                 type: "success",
//                 mnessage: "User Updated successfully!",
//             };
//             res.redirect('/')
//         }
//     });
// });

router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch(err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });
        req.session.message = {
            type: "success",
            message: "User Updated successfully!",
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

module.exports = router;
