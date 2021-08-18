// Paginantion : To show the limited number os pages in the database

const express = require('express');

const router = express.Router();
const imageModel = require('../model/upload.model');

function pagenateResult(imagemodel) {
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
      results.results = await imagemodel.find().limit(limit).skip(startindex).exec();
      res.pagenateResult = results;
      next();
    } catch (err) {
      res.send(err);
    }
  };
}

router.get('/images', pagenateResult(imageModel), (req, res) => {
  res.json(res.pagenateResult);
});

module.exports = router;
