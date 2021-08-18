require('dotenv').config();

const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const createError = require('http-errors');

const User = require('../model/user.model');
const { authschema } = require('../helper/schema_validation');
const verifyToken = require('../Middleware/authenticateToken');

router.post('/register', async (req, res, next) => {
  try {
    const result = await authschema.validateAsync(req.body);
    const doesexits = await User.findOne({ email: result.email });
    if (doesexits) { throw createError.Conflict(`${result.email} is already Registered`); }
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,

    });
    await user.save();
    res.status(200).json({
      message: ' SuccessFully New User Added',
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

router.post('/login', async (req, res) => {
  const result = await authschema.validateAsync(req.body);
  const user = await User.findOne({ email: result.email });
  if (!user) { return res.status(400).send('user not regesitered'); }
  if (user.role !== req.body.role) {
    res.status(400).json({
      status: 400,
      sucess: false,
      message: 'Make sure your credinational is Right ??',
    });
  }
  const ismatch = await user.isvalidpassword(result.password);
  if (!ismatch) {
    return res.status(400).send('password not valid');
  }
  const userauth = {
    email: result.email, firstname: result.firstname, lastname: result.lastname, role: result.role, password: result.password,
  };
  const accessToken = generateAccessToken(userauth);
  console.log(accessToken);
  res.json({ accessToken });
});

router.get('/findDetails', verifyToken, (req, res) => {
  var authHeader = req.headers.authorization.split(' ')[1];
  var token = jwt_decode(authHeader);
  User.find({ email: token.email }).then((rec) => {
    res.status(200).json(rec);
  });
});

module.exports = router;
