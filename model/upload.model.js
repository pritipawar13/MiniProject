const mongoose = require('mongoose');

const connection = require('../helper/db');

const Uploadschema = new mongoose.Schema({
  description: String,
  username: String,
  image: String,
  filePath: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  Path: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

const uploadimage = mongoose.model('uploadimage', Uploadschema);
module.exports = uploadimage;
