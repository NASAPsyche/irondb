const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
// const db = require('../db');

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('data-entry');
});

router.post('/', isLoggedIn, function(req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, ('../../public/temp/'));
  form.parse(req, function(err, fields, files) {
    if (err) next(createError(500));
    if (fields.editor_select === 'true' && files.filetoupload.size === 0) {
      res.render('editor', {username: req.user.username, data: null});
    } else if (fields.tool_select === 'true' && files.filetoupload.size === 0) {
      next(createError(500));
    } else {
      const oldpath = files.filetoupload.path;
      // eslint-disable-next-line max-len
      const newpath = path.join(__dirname, ('../../public/temp/' + files.filetoupload.name));
      try {
        fs.rename(oldpath, newpath, function(err) {
          if (err) next(createError(500));
          if (fields.tool_select) {
            res.render('data-entry-checklist',
                {data: newpath.slice(15), username: req.user.username});
          } else if (fields.editor_select) {
            res.render('editor_with_pdf',
                {data: newpath.slice(15), username: req.user.username});
          } else {
            next(createError(500));
          }
        });
      } catch (err) {
        next(createError(500));
      }
    }
  });
});

router.get('/editor', isLoggedIn, function(req, res, next) {
  res.render('editor', {username: req.user.username, data: null});
});

router.post('/editor', isLoggedIn, function(req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, ('../../public/temp/'));
  form.parse(req, function(err, fields, files) {
    const oldpath = files.filetoupload.path;
    // eslint-disable-next-line max-len
    const newpath = path.join(__dirname, ('../../public/temp/' + files.filetoupload.name));
    try {
      fs.rename(oldpath, newpath, function(err) {
        if (err) throw err;
        res.render('editor_with_pdf',
            {data: newpath.slice(15), username: req.user.username});
      });
    } catch (err) {
      next(createError(500));
    }
  });
});


module.exports = router;
