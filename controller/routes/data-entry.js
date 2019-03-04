const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
// const pg = require('../db');
const parser = require('../db/entry-parser');
const inserter = require('../db/insert-entry');

const toolRouter = require('./data-entry/tool');
router.use('/tool', toolRouter);

const dataEntrySaveRouter = require('./data-entry/save');
router.use('/save', dataEntrySaveRouter);

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('data-entry');
});

router.post('/', isLoggedIn, function(req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, ('../../public/temp/'));
  form.parse(req, function(err, fields, files) {
    if (err) next(createError(500));
    if (fields.editor_select === 'true' && files.filetoupload.size === 0) {
      console.log(req);
      res.render('editor', {
        username: req.user.username,
        data: null,
        sessionID: req.sessionID,
      });
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
            res.render('data-entry-checklist', {
              data: newpath.slice(15),
              username: req.user.username,
              sessionID: req.sessionID,
            });
          } else if (fields.editor_select) {
            res.render('editor_with_pdf', {
              data: newpath.slice(15),
              username: req.user.username,
              sessionID: req.sessionID,
            });
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
  res.render('editor', {
    username: req.user.username,
    data: null,
    sessionID: req.sessionID,
  });
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
        res.render('editor_with_pdf', {
          data: newpath.slice(15),
          username: req.user.username,
          sessionID: req.sessionID,
        });
      });
    } catch (err) {
      next(createError(500));
    }
  });
});


router.post('/insert', isLoggedIn, async (req, res, next) => {
  const reqBody = req.body;
  const username = req.user.username;

  /* Get Keys */
  // Get an array of the keys, needed for filtering
  const keys = parser.getKeys(reqBody);

  // Singular objects
  const journal = parser.getJournal(reqBody);
  const paper = parser.getPaper(reqBody);
  // Arrays of objects
  const authors = parser.getAuthors(reqBody, keys);
  const bodies = parser.getBodies(reqBody, keys);
  const notes = parser.getNotes(reqBody, keys);

  // Insert the entry as pending
  inserter.insertEntry(
      journal, paper, authors, bodies, notes, username, 'pending'
  );

  // Redirect to panel when done
  res.redirect('/panel');
});


module.exports = router;
