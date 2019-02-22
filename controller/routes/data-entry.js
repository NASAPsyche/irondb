const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const pg = require('../db');

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


router.post('/insert', isLoggedIn, function(req, res, next) {
  // Get the body of the request as an object
  const body_ = req.body;
  const username = req.user.username;
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
      'middleName': body_[String(middleName)],
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

    // Build the measurements for each element per body
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

      const unitsOriginal = body_[String(unit)];
      let units;
      switch (unitsOriginal) {
        case 'wt%':
          units = 'wt_percent';
          break;
        case 'ppm':
          units = 'ppm';
          break;
        case 'ppb':
          units = 'ppb';
          break;
        case 'mg/g':
          units = 'mg_g';
          break;
        case 'µg/g':
          units = 'ug_g';
          break;
        case 'ng/g':
          units = 'ng_g';
          break;
      }
      const measure = {
        'element': body_[String(element)],
        'lessThan': lessThanVal,
        'measurement': body_[String(measurement)],
        'deviation': body_[String(deviation)],
        'unit': units,
        'technique': body_[String(technique)],
        'page': body_[String(page)],
      };
      meteorite.measurements.push(measure);
    });
    bodies.push(meteorite);
  });

  const notes = [];
  noteKeys.forEach((key, i) => {
    const note = body_[String(key)];
    notes.push(note);
  });
  // console.log('Journal ', journal);
  // console.log('Paper ', paper);
  // console.log('Authors: ', authors);
  // console.log('Bodies ', bodies);

  // let journalId;
  // let paperId;
  /* eslint-disable max-len */

  // Start DB transaction
  pg.getClient((err, client, done) => {
    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack);
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack);
          }
          // release the client back to the pool
          done();
        });
      }
      return !!err;
    };
    client.query('BEGIN', (err) => {
      if (shouldAbort(err)) return;
      // JOURNAL TRANSACTION
      const journalQuery = `
      INSERT INTO
      journals(journal_name, volume, issue, series, published_year)
      VALUES($1, $2, $3, $4, $5)
      RETURNING journal_id
      `;
      const journalValue = [
        journal.journalName,
        journal.volume,
        journal.issue,
        journal.series,
        journal.pubYear,
      ];
      client.query(journalQuery, journalValue, (err, res) => {
        if (shouldAbort(err)) return;
        // JOURNAL STATUS
        const journalStatusQuery = `
        INSERT INTO journal_status(journal_id, current_status, submitted_by)
        VALUES($1, $2, $3)
        RETURNING status_id
        `;
        const journalId = res.rows[0].journal_id;
        const journalStatusValue = [
          journalId,
          'pending',
          username,
        ];
        client.query(journalStatusQuery, journalStatusValue, (err, res) => {
          if (shouldAbort(err)) return;
          // JOURNAL ADD STATUS ID
          const journalUpdateQuery = `
          UPDATE journals
          SET status_id = ($1)
          WHERE journal_id = ($2)
          `;
          const statusId = res.rows[0].status_id;
          const journalUpdateValue = [
            statusId,
            journalId,
          ];
          client.query(journalUpdateQuery, journalUpdateValue, (err, res) => {
            if (shouldAbort(err)) return;
            // PAPER TRANSACTION
            const paperQuery = `
            INSERT INTO
            papers(journal_id, title, doi)
            VALUES($1, $2, $3)
            RETURNING paper_id
            `;
            const paperValue = [
              journalId,
              paper.paperTitle,
              paper.doi,
            ];
            client.query(paperQuery, paperValue, (err, res) => {
              if (shouldAbort(err)) return;
              // PAPER STATUS
              const paperId = res.rows[0].paper_id;
              const paperStatusQuery = `
              INSERT INTO
              paper_status(paper_id, current_status, submitted_by)
              VALUES($1, $2, $3)
              RETURNING status_id
              `;
              const paperStatusValue = [
                paperId,
                'pending',
                username,
              ];
              client.query(paperStatusQuery, paperStatusValue, (err, res) => {
                if (shouldAbort(err)) return;
                // PAPER ADD STATUS ID
                const statusId = res.rows[0].status_id;
                const paperUpdateQuery = `
                UPDATE papers
                SET status_id = ($1)
                WHERE paper_id = ($2)
                `;
                const paperUpdateValue = [
                  statusId,
                  paperId,
                ];
                client.query(paperUpdateQuery, paperUpdateValue, (err, res) => {
                  if (shouldAbort(err)) return;
                  // AUTHOR TRANSACTIONS
                  authors.forEach((author, i) => {
                    const authorQuery = `
                    INSERT INTO 
                    authors(primary_name, first_name, middle_name, single_entity)
                    VALUES($1, $2, $3, $4)
                    RETURNING author_id
                    `;
                    const authorValue = [
                      author.primaryName,
                      author.firstName,
                      author.middleName,
                      author.singleEntity,
                    ];
                    client.query(authorQuery, authorValue, (err, res) => {
                      if (shouldAbort(err)) return;
                      // AUTHOR STATUS
                      const authorId = res.rows[0].author_id;
                      const authorStatusQuery = `
                      INSERT INTO
                      author_status(author_id, current_status, submitted_by)
                      VALUES($1, $2, $3)
                      RETURNING status_id
                      `;
                      const authorStatusValue = [
                        authorId,
                        'pending',
                        username,
                      ];
                      client.query(authorStatusQuery, authorStatusValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        // AUTHOR ADD STTAUS ID
                        const statusId = res.rows[0].status_id;
                        const authorUpdateQuery = `
                        UPDATE authors
                        SET status_id = ($1)
                        WHERE author_id = ($2)
                        `;
                        const authorUpdateValue = [
                          statusId,
                          authorId,
                        ];
                        client.query(authorUpdateQuery, authorUpdateValue, (err, res) => {
                          // ATTRIBUTION TRANSACTION
                          if (shouldAbort(err)) return;
                          const attrQuery = `
                          INSERT INTO 
                          attributions(paper_id, author_id)
                          VALUES($1, $2)
                          RETURNING attribution_id
                          `;
                          const attrValue = [
                            paperId,
                            authorId,
                          ];
                          client.query(attrQuery, attrValue, (err, res) => {
                            if (shouldAbort(err)) return;
                            // ATTRIBUTION STATUS
                            const attrId = res.rows[0].attribution_id;
                            const attrStatusQuery = `
                            INSERT INTO 
                            attribution_status(attribution_id, current_status, submitted_by)
                            VALUES($1, $2, $3)
                            RETURNING status_id
                            `;
                            const attrStatusValue = [
                              attrId,
                              'pending',
                              username,
                            ];
                            client.query(attrStatusQuery, attrStatusValue, (err, res) => {
                              if (shouldAbort(err)) return;
                              // ATTRIBUTIONS ADD STATUS ID
                              const statusId = res.rows[0].status_id;
                              const attrUpdateQuery = `
                              UPDATE attributions
                              SET status_id = ($1)
                              WHERE attribution_id = ($2)
                              `;
                              const attrUpdateValue = [
                                statusId,
                                attrId,
                              ];
                              client.query(attrUpdateQuery, attrUpdateValue, (err, res) => {
                                if (shouldAbort(err)) return;
                                // End of author attributions
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                  // END AUTHORS

                  // BODIES TRANSACTIONS
                  bodies.forEach((body, i) => {
                    const bodyQuery = `
                    INSERT INTO
                    bodies(nomenclature)
                    VALUES($1)
                    RETURNING body_id
                    `;
                    const bodyValue = [
                      body.nomenclature,
                    ];
                    // Insert body
                    client.query(bodyQuery, bodyValue, (err, res) => {
                      if (shouldAbort(err)) return;
                      // BODY STATUS
                      const bodyId = res.rows[0].body_id;
                      const bodyStatusQuery = `
                      INSERT INTO
                      body_status(body_id, current_status, submitted_by)
                      VALUES($1, $2, $3)
                      RETURNING status_id
                      `;
                      const bodyStatusValue = [
                        bodyId,
                        'pending',
                        username,
                      ];
                      // ADD BODY STATUS ID
                      client.query(bodyStatusQuery, bodyStatusValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        const statusId = res.rows[0].status_id;
                        const bodyUpdateQuery = `
                        UPDATE bodies
                        SET status_id = ($1)
                        WHERE body_id = ($2)
                        `;
                        const bodyUpdateValue = [
                          statusId,
                          bodyId,
                        ];
                        client.query(bodyUpdateQuery, bodyUpdateValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          // end body update
                        });
                      });
                      // ADD GROUP
                      const groupQuery = `
                      INSERT INTO 
                      groups(body_id, the_group)
                      VALUES($1, $2)
                      RETURNING group_id
                      `;
                      const groupValue = [
                        bodyId,
                        body.group,
                      ];
                      client.query(groupQuery, groupValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        const groupId = res.rows[0].group_id;
                        const groupStatusQuery = `
                        INSERT INTO
                        group_status(group_id, current_status, submitted_by)
                        VALUES($1, $2, $3)
                        RETURNING status_id
                        `;
                        const groupStatusValue = [
                          groupId,
                          'pending',
                          username,
                        ];
                        // Group status insert
                        client.query(groupStatusQuery, groupStatusValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          const statusId = res.rows[0].status_id;
                          const groupUpdateQuery = `
                          UPDATE groups
                          SET status_id = ($1)
                          WHERE group_id = ($2)
                          `;
                          const groupUpdateValue = [
                            statusId,
                            groupId,
                          ];
                          // Udate status ID for groups
                          client.query(groupUpdateQuery, groupUpdateValue, (err, res) => {
                            if (shouldAbort(err)) return;
                            // end groups
                          });
                        });
                      });
                      // END GROUPS
                      // BEGIN CLASSIFICATIONS
                      if (body.classification != '' && body.classification != null) {
                        const classQuery = `
                        INSERT INTO
                        classifications(body_id, classification)
                        VALUES($1, $2)
                        RETURNING classification_id
                        `;
                        const classValue = [
                          bodyId,
                          body.classification,
                        ];
                        client.query(classQuery, classValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          const classId = res.rows[0].classification_id;
                          const classStatusQuery = `
                          INSERT INTO 
                          classification_status(classification_id, current_status, submitted_by)
                          VALUES($1, $2, $3)
                          RETURNING status_id
                          `;
                          const classStatusValue = [
                            classId,
                            'pending',
                            username,
                          ];
                          // INSERT CLASS STATUS
                          client.query(classStatusQuery, classStatusValue, (err, res) => {
                            if (shouldAbort(err)) return;
                            const statusId = res.rows[0].status_id;
                            const classUpdateQuery = `
                            UPDATE classifications
                            SET status_id = ($1)
                            WHERE classification_id = ($2)
                            `;
                            const classUpdateValue = [
                              statusId,
                              classId,
                            ];
                            client.query(classUpdateQuery, classUpdateValue, (err, res) => {
                              if (shouldAbort(err)) return;
                              // end classifications update
                            });
                          });
                        });
                      }
                      // END CLASSIFICATIONS

                      // START measurements FOR BODIES
                      body.measurements.forEach((measure, i) => {
                        console.log('measure: ', measure);
                        const measureQuery = `
                        INSERT INTO 
                        element_entries(
                          body_id, 
                          element_symbol, 
                          paper_id,
                          page_number, 
                          ppb_mean, 
                          deviation, 
                          less_than, 
                          original_unit, 
                          technique)
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        RETURNING element_id
                        `;
                        if (measure.deviation == '') {
                          measure.deviation = 0.0;
                        }
                        if (measure.deviation < 0) {
                          measure.deviation = measure.deviation * -1;
                        }
                        measure.element = String(measure.element).toLowerCase();
                        const measureValue = [
                          bodyId,
                          measure.element,
                          paperId,
                          measure.page,
                          parseInt(measure.measurement),
                          parseFloat(measure.deviation),
                          measure.lessThan,
                          measure.unit,
                          measure.technique,
                        ];
                        // INSERT MEASUREMENT
                        client.query(measureQuery, measureValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          const elementId = res.rows[0].element_id;
                          const measureStatusQuery = `
                          INSERT INTO 
                          element_status(element_id, current_status, submitted_by)
                          VALUES($1, $2, $3)
                          RETURNING
                          status_id
                          `;
                          const measureStatusValue = [
                            elementId,
                            'pending',
                            username,
                          ];
                          // INSERT ELEMENT STATUS
                          client.query(measureStatusQuery, measureStatusValue, (err, res) => {
                            const statusId = res.rows[0].status_id;
                            const measureUpdateQuery = `
                            UPDATE element_entries
                            SET status_id = ($1)
                            WHERE element_id = ($2)
                            `;
                            const measureUpdateValue = [
                              statusId,
                              elementId,
                            ];
                            // Update with status id
                            client.query(measureUpdateQuery, measureUpdateValue, (err, res) => {
                              if (shouldAbort(err)) return;
                              // end element inserts
                            });
                          });
                        });
                      }); // END BODY MEASUREMENTS
                    });
                  });// END BODIES
                  // START NOTES
                  notes.forEach((note, i) => {
                    const noteQuery = `
                    INSERT INTO
                    notes(paper_id, note)
                    VALUES($1, $2)
                    RETURNING note_id
                    `;
                    const noteValue = [
                      paperId,
                      note,
                    ];
                    // INSERT NOTE
                    client.query(noteQuery, noteValue, (err, res) => {
                      if (shouldAbort(err)) return;
                      const noteId = res.rows[0].note_id;
                      const noteStatusQuery = `
                      INSERT INTO
                      note_status(note_id, current_status, submitted_by)
                      VALUES($1, $2, $3)
                      RETURNING status_id
                      `;
                      const noteStatusValue = [
                        noteId,
                        'pending',
                        username,
                      ];
                      // INSERT NOTE STATUS
                      client.query(noteStatusQuery, noteStatusValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        const statusId = res.rows[0].status_id;
                        const noteUpdateQuery = `
                        UPDATE notes
                        SET status_id = ($1)
                        WHERE note_id = ($2)
                        `;
                        const noteUpdateValue = [
                          statusId,
                          noteId,
                        ];
                        // UPDATE NOTE STATUS REF
                        client.query(noteUpdateQuery, noteUpdateValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          // end note update
                        });
                      });
                    });
                  }); // END NOTES
                  // COMMIT ALL CHANGES
                  client.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error committing transaction ', err.stack);
                    }
                    done(); // Release the client
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  // Redirect to panel when done
  res.redirect('/panel');
});
/* eslint-enable max-len */

module.exports = router;
