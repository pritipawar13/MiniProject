const express = require('express');

const router = express.Router();
const multer = require('multer');
const jwt_decode = require('jwt-decode');
const path = require('path');

const maxfilesize = 1024 * 1024;
const UploadModel = require('../model/upload.model');
const User = require('../model/user.model');
const verifyToken = require('../Middleware/authenticateToken');

router.use(express.static(`${__dirname}./public`));
router.use(express.static(`${__dirname}./public/images`));

// This function is used for decode the access token
function decodeToken(token) {
  return jwt_decode(token);
}

// storage engine
const storage = multer.diskStorage({
  destination: './public/images/',
  filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: maxfilesize },
  fileFilter(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(
      file.originalname,
    ).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(`${'Error: File upload only supports the '
                + 'following filetypes - '}${filetypes}`);
  },

}).single('image');

router.post('/upload', verifyToken, upload, (req, res) => {
  var authHeader = req.headers.authorization.split(' ')[1];
  var decodedToken = decodeToken(authHeader);
  console.log(decodedToken);

  const username = decodedToken.email;
  const imageFile = req.file.filename;
  const { description } = req.body;
  const filePath = req.file.path;
  const imageDetails = new UploadModel({
    image: imageFile,
    description,
    filePath,
    username,
  });
  imageDetails.save((err) => {
    if (err) throw err;
    res.status(200).json({
      message: `${username} uploaded  Successfully Uploaded`,
    });
  });
});

// To get all uploaded images by perticular user .

router.get('/seeprofileimages', verifyToken, (req, res) => {
  var authHeader = req.headers.authorization.split(' ')[1];
  var decodedToken = decodeToken(authHeader);
  console.log(decodedToken);
  const { email } = decodedToken;
  UploadModel.find({ username: { $eq: email } }).exec((err, images) => {
    if (err) {
      throw err;
    } else {
      return res.json({ status: 'ok', images });
      // res.render('upload',{record:images})
    }
  });
});

// to see all records

router.get('/allimages', (req, res) => {
  UploadModel.find().exec((err, user) => {
    if (err) {
      throw err;
    } else {
      res.status(200).json({
        message: 'All Uploded Images',
        images: user,
      });
      // res.render('upload',{record:user})
    }
  });
});

// To see the all images in decreasing order
/*  router.get('/latestimages',function(req,res){
    var authHeader=req.headers['authorization'].split(' ')[1]
    var decodedToken=decodeToken(authHeader)
    //console.log(decodedToken)
    var models=[User,uploadModel]
    var username=decodedToken.email;
    uploadModel.find({username:username}).sort({createdAt:-1}).then((images)=>{
      console.log(images)
      return res.json({images})
    })
  }) */

// findout information about user and their uploaded images by using aggregate
router.get('/latestimages/:id', (req, res) => {
  var email = req.params.id;

  User.aggregate([{ $match: { email } },
    { $project: { __v: 0, password: 0 } },
    {
      $lookup: {
        from: 'uploadimages',
        localField: 'email',
        foreignField: 'username',
        as: 'images',
      },
    }]).then((result) => {
    res.json(result);
  });
  /*
  User.aggregate([{ $match:{"email":email}},
  { $project:{"password":0,"__v":0}},
    { $lookup:{
      from:"uploadimages",
      let:{email_user:'$email',},
      pipeline:[
        {$match:{$expr:{ $eq:['$username','$$email_user']}} },
          { $project: { __v: 0} }, // which field we dont want  the value of that is 0 . if we want then it places as 1
          { $sort:{createdAt:-1}}
        ],
      as:"images"
    }
  }]).then(result=>{
  res.json(result)
  }) */
});

// findout information about user and their uploaded images by using populate.

router.get('/images/:id', (req, res) => {
  UploadModel.findOne({ _id: req.params.id })
    .populate('user').exec((err, data) => {
      res.status(200).json({
        message: 'okk',
        result: data,
      });
    });
});

// Edit Description of post by using Id.
router.put('/edit/describtion/:id', async (req, res) => {
  var { id } = req.params;
  var newDesc = req.body.description;

  await UploadModel.findByIdAndUpdate({ _id: id }, { $set: { description: newDesc } });
  res.status(200).json({
    message: 'Sucessfully Edit the Description about post ',
  });
});

// edit existing image with new image of perticular

router.put('/edit/image/:id', upload, async (req, res) => {
  var { id } = req.params;
  var newimage = req.file.filename;
  await UploadModel.findByIdAndUpdate({ _id: id }, { $set: { image: newimage } });
  res.status(200).json({
    message: 'Successfully uploaded new images ',
  });
});

function pagenateResult(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startindex = (page - 1) * limit;
    const results = {};
    results.next = {
      page: page + 1,
      limit,
    };
    results.previous = {
      page: page - 1,
      limit,
    };
    try {
      results.results = await model.find().sort({ createdAt: -1 }).limit(limit).skip(startindex)
        .exec();
      res.pagenateResult = results;
      next();
    } catch (err) {
      res.send(err);
    }
  };
}

// Apply Pagination with images
router.get('/imagespagination', pagenateResult(UploadModel), (req, res) => {
  res.json(res.pagenateResult);
});

function errHandler(err, req, res) {
  if (err instanceof multer.MulterError) {
    res.json({
      sucesss: 0,
      message: err.message,
    });
  }
}

router.use(errHandler);

module.exports = router;
