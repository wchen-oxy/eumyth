var express = require('express');
var router = express.Router();
let User = require('../../models/user.model');
let Post = require('../../models/post.model');
// let IndexUser = require('../models/index.user.model');
var firebase = require('firebase');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GridFsStorage = require("multer-gridfs-storage");
const multer = require('multer');
const uri = process.env.ATLAS_URI;
const crypto = require('crypto');
let IndexUser = require('../../models/index.user.model');


const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        console.log(req.body);
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = file.originalname
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images',
                }
                resolve(fileInfo)
            })
        })
    },
})
const upload = multer({ storage });

router.route('/').get((req, res) => {
    const db = req.draft_config.db;
    const username = req.query.username;
    console.log(username);
    IndexUser.Model.findOne({ username: username })
        .then((user) => 
        User.Model.findById(mongoose.Types.ObjectId(user.user_profile_ref)))
        .then((user) => {
            if (user.draft === undefined) {
                return res.sendStatus(200);
            }
            res.send(user.draft.text_data);
        }).catch(err => console.log('ERROR' + err));

})

router.route('/').post((req, res) => {

    const username = req.headers.username;
    IndexUser.Model.findOne({ username: username },
        (err, indexUserProfile) => {
            if (err) {
                // console.log("Error");
                console.log(err);
                res.status(500).json("Error: " + err)
            }
        }
    ).then(
        user => {
            // console.log(user);
            const authorId = user.user_profile_ref;
            const postModel = new Post.Model({
                title: 'draft',
                author_id: authorId,
                text_data: req.body.editor_content,
                post_format: 'long'
            });
            User.Model.findById(authorId, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                if (user && user.draft === postModel) return;
                user.draft = postModel;
                user.save((err) => {
                    if (err) {
                        console.error('ERROR: ' + err);
                        res.status(500).json(err);
                    }
                });
            }).then(() => res.sendStatus(201)).catch(err => console.log(err));
        }
    )
    ;


    // User.Model.findById(authorId, (err, user) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(500).json(err);}
    //     if (user && user.draft === postModel) return res.sendStatus(200);
    //     user.draft = postModel;
    //     user.save((err) => {
    //         if (err) {
    //             console.error('ERROR: ' + err);
    //             res.status(500).json(err);
    //         }
    //     });
    // })
    // .then(() => res.sendStatus(201)).catch(err => console.log(err));

})

module.exports = router;