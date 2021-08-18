const express = require('express');

const router = express.Router();
const fs = require('fs');
const uploadModel = require('../model/upload.model');

const dirPath = './public/images';

// Delete image from the database.

router.delete('/deleteimage/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(500).json('error in delete');
  }
  await uploadModel.findByIdAndDelete({ _id: req.params.id })
    .exec()
    .then((data) => {
      res.status(200).json(data);
    });
});

router.delete('/deleteimage/from/folder/:imagename', (req, res) => {
  fs.unlink(`${dirPath}/${req.params.imagename}`, (err) => {
    if (err) throw err;
    return res.status(200).json({
      message: ' Image SuccessFully Deleted',
    });
  });
});

module.exports = router;
