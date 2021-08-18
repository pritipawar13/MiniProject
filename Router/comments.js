const express = require('express');

const router = express.Router();
const CommentSchema = require('../model/comment_model');

router.post('/add-comment/:imageid', (req, res) => {
    var imageid = req.params.imageid;
    const comment = new CommentSchema({
        imageid : imageid,
        user: req.body.user,
        comment: req.body.comment,
        favorite: req.body.favorite,
    });
    comment.save(function(err,data){
        if (err) throw err;
        return res.status(201).json({
            message: 'Sucess',
            createdmessage: ' New Comment is created',
            status: 201,
            data: data,
        });
    });
});

// findout all comments for all posts.
router.get('/all-comment', (req, res) => {
    CommentSchema.find({}).exec((err, result) => {
        res.status(200).json({
            message: 'Sucess',
            status: 200,
            data: result,
        });
    });
});

// findout all comments for perticular post .

router.get('/for-perticular-images/comments/:imageid', (req, res) => {
    CommentSchema.find({ imageid: req.params.imageid }).populate({ path: 'posts', select: 'image describtion createdAt username filepath' }).exec((err, result) => {
      res.send(result);
    });
});

// delete  all comments which are created for post.

router.delete('/delete-comment/:imageid', (req, res) => {
    CommentSchema.find({ imageid: req.params.imageid }).select('-comment').exec((err, data) => {
        res.status(200).json({
            status: 200,
            message: 'All comments deleted',
            result: data,
        });
    });

// delete perticular comments.
router.delete('/delete-perticular-comment-for-post/:commentid', ( req, res) => {
    CommentSchema.findByIdAndDelete({ _id: req.params.commentid });
        res.status(200).json({
            status: 200,
            message: 'comment deleted',
        });
});

router.get('/count-likes-dislikes/:favorite', (req, res) => {
   // var  favorite=req.params.favorite
    CommentSchema.count({ favorite: req.params.favorite },function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json("Number of documents in the collection: " + result);
        }
    });
});