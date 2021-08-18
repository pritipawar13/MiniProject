const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user.model');

router.get('/password', (req, res) => {
  User.find({ email: req.body.email });
  res.status(201).send('this is a password ');
});

router.put('/forgot/password', (req, res) => {
  var newpassword = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newpassword, salt);
  User.findOneAndUpdate({ email: req.body.email }, { $set: { password: hash } }).exec((err) => {
    if (err) {
      return res.status(400).json({
        messgae: 'Cannot forgot old Password',
      });
    }
    return res.json({
      status: 200,
      message: `${req.body.email} has been Successfully forgot the old Password`,
    });
  });
});

router.get('/confirm/password', async (req, res) => {
  var { email } = req.body;
  var { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  await bcrypt.compare(password, hash, (err) => {
    if (err) return res.status(400).send('Password is invalid Password');
    res.json({
      status: 200,
      message: `${email} has confirm the password`,
    });
  });
});

module.exports = router;
