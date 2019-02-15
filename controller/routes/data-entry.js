const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

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

// Remove this eslint tag
/* eslint-disable no-unused-vars */
router.post('/insert', isLoggedIn, function(req, res, next) {
  // Get the body of the request as an object
  const body_ = req.body;
  // console.log(body_);
  /* Get Keys */
  // Get an array of the keys, needed for filtering
  const keys = Object.keys(body_);

  // Using the 'keys' array, get an array of all keys that match the regex
  // Authors
  const primaryNameKeys = keys.filter((value) => /^primaryName/.test(value));
  // const firstNameKeys = keys.filter((value) => /^firstName/.test(value));
  // const middleNameKeys = keys.filter((value) => /^middleName/.test(value));
  const singleEntityKeys = keys.filter((value) => /^singleEntity/.test(value));

  // Meteorites
  const bodyNameKeys = keys.filter((value) => /^bodyName/.test(value));
  // const groupKeys = keys.filter((value) => /^group/.test(value));
  // const classKeys = keys.filter((value) => /^class/.test(value));

  // Measurements
  const elementKeys = keys.filter((value) => /^element/.test(value));
  // console.log(elementKeys);
  // const measurementKeys = keys.filter((value) => /^measurement/.test(value));
  const lessThanKeys = keys.filter((value) => /^lessThan/.test(value));
  // const deviationKeys = keys.filter((value) => /^deviation/.test(value));
  // const unitKeys = keys.filter((value) => /^units/.test(value));

  // Notes
  const noteKeys = keys.filter((value) => /^note/.test(value));

  /* Get values for key-value pair */

  // Get the values for the Journal and Paper
  const journalName = body_['journalName'];
  const volume = body_['volume'];
  const issue = body_['issue'];
  const series = body_['series'];
  const pubYear = body_['pubYear'];
  const paperTitle = body_['paperTitle'];
  const doi = body_['doi'];

  // Build journal object
  const journal = {
    'journalName': journalName,
    'volume': volume,
    'issue': issue,
    'series': series,
    'pubYear': pubYear,
  };

  // Build paper object
  const paper = {
    'paperTitle': paperTitle,
    'doi': doi,
  };

  // An array of author objects
  const authors = [];
  // Build each author as an object and add to the array
  primaryNameKeys.forEach((name, i) => {
    // Gets the number from the end of the primaryName key
    const strToMatch = 'primaryName';
    const num = name.substring(strToMatch.length);
    // Build the key names
    const firstName = 'firstName' + num.toString();
    const middleName = 'middleName' + num.toString();
    const singleEntity = 'singleEntity' + num.toString();
    let singleEntityVal = false;
    // If singleEntity* key exists, then it is always true
    if (singleEntityKeys.includes(String(singleEntity))) {
      singleEntityVal = true;
    }
    const author = {
      'primaryName': body_[String(name)],
      'firstName': body_[String(firstName)],
      'middleNmae': body_[String(middleName)],
      'singleEntity': singleEntityVal,
    };
    authors.push(author);
  });

  // An array of meteorites
  const bodies = [];
  bodyNameKeys.forEach((name, i) => {
    // Get the meteorite number from end of key
    const strToMatch = 'bodyName';
    const bodyNum = name.substring(strToMatch.length); //
    // Build the key names
    const group = 'group' + bodyNum.toString();
    const classOf = 'class' + bodyNum.toString();
    const meteorite = {
      'nomenclature': body_[String(name)],
      'classification': body_[String(classOf)],
      'group': body_[String(group)],
      'measurements': [],
    };

    // Make a regular expression for matching the body with element numbers
    const elementKeyString = 'element' + String(bodyNum) + '-';
    const re = new RegExp(elementKeyString, 'g');

    const measurements = [];
    elementKeys.forEach((key) => {
      // returns not null if begins with elementKeyString
      if (key.match(re) != null) {
        measurements.push(key);
      }
    });

    measurements.forEach((elem, i) => {
      const elemNum = elem.substring(elementKeyString.length);
      const element = elem;
      const lessThan =
        'lessThan' + String(bodyNum) + '-' + String(elemNum);
      let lessThanVal = false;
      if (lessThanKeys.includes(String(lessThan))) {
        lessThanVal = true;
      }
      const measurement =
        'measurement' + String(bodyNum) + '-' + String(elemNum);
      const deviation =
        'deviation' + String(bodyNum) + '-' + String(elemNum);
      const unit =
        'units' + String(bodyNum) + '-' + String(elemNum);
      const technique =
        'technique' + String(bodyNum) + '-' + String(elemNum);
      const page =
        'page' + String(bodyNum) + '-' + String(elemNum);

      const measure = {
        'element': body_[String(element)],
        'lessThan': lessThanVal,
        'measurement': body_[String(measurement)],
        'deviation': body_[String(deviation)],
        'unit': body_[String(unit)],
        'technique': body_[String(technique)],
        'page': body_[String(page)],
      };
      meteorite.measurements.push(measure);
    });
    // console.log(elementKeyString, ' - ', measurements);
    bodies.push(meteorite);
  });

  console.log('Journal ', journal);
  console.log('Paper ', paper);
  console.log('Authors: ', authors);
  console.log('Bodies ', bodies);

  // Redirect to panel when done
  res.redirect('/panel');
});


module.exports = router;
