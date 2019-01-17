const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('data-entry');
});

router.get('/editor', isLoggedIn, function(req, res, next) {
  res.render('editor');
});

router.post('/editor', isLoggedIn, function(req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, ('../../public/temp/'));
  form.parse(req, function(err, fields, files) {
    const oldpath = files.filetoupload.path;
    // eslint-disable-next-line max-len
    const newpath = path.join(__dirname, ('../../public/temp/' + files.filetoupload.name));
    fs.rename(oldpath, newpath, function(err) {
      if (err) throw err;
      res.render('editor_with_pdf', {data: newpath.slice(15)});
    });
  });
});

module.exports = router;
