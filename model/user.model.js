const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const Userschema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 5,
    maxlenfth: 50,
    srequired: true,
  },
  lastname: {
    type: String,
    minlength: 5,
    maxlenfth: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 20,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'superadmin'],
  },
});
// To set hash password and store that password into database.

Userschema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(this.password, salt);
    this.password = hashedpassword;
    next();
  } catch (error) {
    next(error);
  }
});

Userschema.methods.isvalidpassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};
Userschema.plugin(uniqueValidator);
const User = mongoose.model('User', Userschema);
module.exports = User;
