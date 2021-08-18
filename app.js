const express = require('express');
const createError = require('http-errors');
const uploadModel = require('./model/upload.model');
const users = require('./Router/users');
const uploadimage = require('./Router/upload_image');
const deleteimage = require('./Router/delete_image');
const saveimage = require('./Router/upload_save');
const allfiles = require('./Router/all_file');
const images = require('./Router/image_page');
const password = require('./Router/password');
const UserProfile = require('./Router/userprofile');
const reportImgae = require('./Router/report_image');
// const comment = require('./Router/comments');

const app = express();
const authroute = require('./Router/authroute');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.json());
const port = process.env.PORT || 2005;

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

// Calling Routes
app.use(users);
app.use(authroute);
app.use(uploadimage);
app.use(deleteimage);
app.use(saveimage);
app.use(allfiles);
app.use(images);
app.use(password);
app.use(UserProfile);
app.use(reportImgae);
// app.use(comment);
// display perticular immage on browser using below url
app.get('/image/:imagename', (req, res) => {
  var { imagename } = req.params;
  var path = ` http://localhost:${port}/images/${imagename}`;
  var image = new uploadModel({
    Path: path,
  });
  image.save((err) => {
    if (err) throw err;
    res.send(path);
  });
});

// for handling error
app.use(async (req, res, next) => {
  /* const error=new Error("Not Found");
    error.status=404
    next (error) */
  next(createError.NotFound('This route does not exits'));
});

app.use((err, req, res) => {
  res.status(err.status || 400);
  res.send({
    error: {
      status: err.status || 400,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
