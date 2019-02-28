const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const pg = require('../db');
const parser = require('../db/entry-parser');
const inserter = require('../db/insert-entry');

const toolRouter = require('./data-entry/tool');
router.use('/tool', toolRouter);

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

router.post('/save', isLoggedIn, function(req, res, next) {
  console.log('data: ', req.body.data);
  pg.getClient((err, client, done) => {
    const insertQuery =
      'INSERT INTO entry_store(username, savedata, pdf_path) VALUES($1,$2,$3)';
    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack);
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack);
          }
          // release the client back to the pool
          done();
          next();
        });
      }
      return !!err;
    };

    client.query('BEGIN', (err) => {
      if (shouldAbort(err)) return;
      client.query(
          insertQuery,
          [req.body.username, req.body.data, req.body.pdf_path],
          (err, res) => {
            if (shouldAbort(err)) return;
            client.query('COMMIT', (err) => {
              if (err) {
                console.error('Error committing transaction', err.stack);
              }
              console.log('done, next');
              done();
              next();
            });
          });
    });
  });
});

router.post('/insert', isLoggedIn, function(req, res, next) {
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
