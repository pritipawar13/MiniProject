const mongoose = require('mongoose');
const connection = require('../helper/db');

const UserProfile = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
  },
  Lastname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: Number,
    maxlength: 10,

  },
  Address: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  ProfilePhoto: {
    type: String,
    required: true,
  },
});
const Userprofile = mongoose.model('UserProfile', UserProfile);
module.exports = Userprofile;
