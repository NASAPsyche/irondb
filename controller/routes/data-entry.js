const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
// const pg = require('../db');

const toolRouter = require('./data-entry/tool');
router.use('/tool', toolRouter);

const dataEntrySaveRouter = require('./data-entry/save');
router.use('/save', dataEntrySaveRouter);

const insertRouter = require('./data-entry/insert');
router.use('/insert', insertRouter);

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('data-entry');
});

router.post('/', isLoggedIn, function(req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, ('../../public/temp/'));
  form.parse(req, function(err, fields, files) {
    if (err) next(createError(500));
    if (fields.editor_select === 'true' && files.filetoupload.size === 0) {
      res.render('editor', {
        username: req.user.username,
        data: null,
        sessionID: req.sessionID,
      });
    } else if (fields.tool_select === 'true' && files.filetoupload.size === 0) {
      next(createError(500));
    } else {
      const oldpath = files.filetoupload.path;
      const fileNameBody = files.filetoupload.name.substring(
          0, files.filetoupload.name.length - 4
      );
      // eslint-disable-next-line max-len
      try {
        let fileNameCounter = 0;
        fs.readdir(form.uploadDir, (err, filesInDirectory) => {
          filesInDirectory.forEach((file) => {
            if (file.includes(fileNameBody)) fileNameCounter++;
          });
          let newpath = '';
          if (fileNameCounter === 0) {
            newpath = path.join(
                __dirname, ('../../public/temp/' + files.filetoupload.name)
            );
          } else {
            newpath = path.join(
                __dirname,
                ('../../public/temp/' + fileNameBody
                + '(' + fileNameCounter + ')' + '.pdf')
            );
          }
          fs.rename(oldpath, newpath, function(err) {
            if (err) next(createError(500));
            if (fields.tool_select === 'true') {
              req.session.fileName = newpath.slice(21);
              res.render('tool', {
                data: newpath.slice(15),
                username: req.user.username,
                sessionID: req.sessionID,
              });
              // JOSH - TEXT et al
            } else if (fields.editor_select === 'true') {
              req.session.fileName = newpath.slice(21);
              res.render('editor_with_pdf', {
                data: newpath.slice(15),
                username: req.user.username,
                sessionID: req.sessionID,
              });
            } else {
              next(createError(500));
            }
          });
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
    const fileNameBody = files.filetoupload.name.substring(
        0, files.filetoupload.name.length - 4
    );
    // eslint-disable-next-line max-len
    try {
      let fileNameCounter = 0;
      fs.readdir(form.uploadDir, (err, filesInDirectory) => {
        filesInDirectory.forEach((file) => {
          if (file.includes(fileNameBody)) fileNameCounter++;
        });
        let newpath = '';
        if (fileNameCounter === 0) {
          newpath = path.join(
              __dirname, ('../../public/temp/' + files.filetoupload.name)
          );
        } else {
          newpath = path.join(
              __dirname,
              ('../../public/temp/' + fileNameBody
              + '(' + fileNameCounter + ')' + '.pdf')
          );
        }
        fs.rename(oldpath, newpath, function(err) {
          if (err) throw err;
          req.session.nameOfPdf = newpath.slice(21);
          res.render('editor_with_pdf', {
            data: newpath.slice(15),
            username: req.user.username,
            sessionID: req.sessionID,
          });
        });
      });
    } catch (err) {
      next(createError(500));
    }
  });
});

module.exports = router;
