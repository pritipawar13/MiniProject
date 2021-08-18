const mongoose = require('mongoose');
const connection = require('../helper/db');

const commentSchema = new mongoose.Schema({
  imageid: mongoose.Schema.Types.ObjectId,
  user: String,
  comment: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  favorite: String,

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

commentSchema.virtual('posts', {
  ref: 'uploadimage',
  localField: 'imageid',
  foreignField: '_id',
  justOne: true,
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
