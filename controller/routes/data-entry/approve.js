const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const ejsUnitConversion = require('../../utils/ejs-unit-conversion');
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');
const path = require('path');
const fs = require('fs');

router.get('/', isLoggedIn, function(req, res, next) {
  next(createError(400));
});

router.post('/', isLoggedIn, async function(req, res, next) {
  // Setup
  const paperID = req.body.paperID;
  let pdfPath = 'null';
  let submissionID = '';
  let pending = false;
  let username = '';
  let resObj = [];

  // Query for submission
  try {
    const submissionID = await db.aQuery(
        'SELECT submission_id FROM paper_status WHERE paper_id = $1',
        [paperID]
    );
    const Submission = db.aQuery(
        'SELECT * FROM submissions WHERE submission_id = $1',
        [submissionID.rows[0].submission_id]
    );
    resObj = await Promise.all([Submission]);
  } catch (err) {
    next(createError(500));
  } finally {
    console.log(resObj[0].rows);


    if (resObj[0].rows[0] !== undefined &&
        resObj[0].rows[0].hasOwnProperty('pdf_path') &&
        resObj[0].rows[0].hasOwnProperty('submission_id') &&
        resObj[0].rows[0].hasOwnProperty('pending') &&
        resObj[0].rows[0].hasOwnProperty('username')
    ) {
      submissionID = resObj[0].rows[0].submission_id;
      pdfPath = resObj[0].rows[0].pdf_path;
      pending = resObj[0].rows[0].pending;
      username = resObj[0].rows[0].username;
    } else {
      next(createError(500));
    }
  }

  if (pending && username !== req.user.username) {
    // Submission pending and viewer did not enter the submission
    resObj = [];
    try {
      const Bodies = await db.aQuery(
          `SELECT t1.* FROM bodies AS t1 JOIN
            (SELECT body_id FROM body_status WHERE submission_id = $1
             AND current_status = 'pending'
             AND current_status != 'rejected')
            AS t2 ON t1.body_id = t2.body_id`,
          [submissionID]
      );
      const Journal = await db.aQuery(
          `SELECT t1.* FROM journals AS t1 JOIN
            (SELECT journal_id FROM journal_status WHERE submission_id = $1)
            AS t2 ON t1.journal_id = t2.journal_id
            LIMIT 1`,
          [submissionID]
      );
      const Paper = await db.aQuery(
          `SELECT t2.current_status, t1.* FROM papers AS t1 JOIN
            (SELECT paper_id, current_status 
             FROM paper_status WHERE submission_id = $1)
            AS t2 ON t1.paper_id = t2.paper_id
            LIMIT 1`,
          [submissionID]
      );
      const AuthorsWithAttribution = await db.aQuery(
          `SELECT t1.*, t3.attribution_id, t3.attribution_status_id 
           FROM authors AS t1
           JOIN (SELECT author_id FROM author_status
                 WHERE submission_id = $1 AND current_status = 'pending'
                 AND current_status != 'rejected') 
           AS t2 on t1.author_id = t2.author_id
           JOIN (SELECT t1.attribution_id, t1.author_id, t1.paper_id,
                        t1.status_id AS attribution_status_id 
                 FROM attributions AS t1 
                 JOIN (SELECT * FROM attribution_status 
                      WHERE submission_id = $1 AND current_status = 'pending'
                      AND current_status != 'rejected') 
                  AS t2 ON t1.attribution_id = t2.attribution_id
                  WHERE paper_id = $2) 
            AS t3 ON t1.author_id = t3.author_id`,
          [submissionID, paperID]
      );
      const Groups = await db.aQuery(
          `SELECT t1.* FROM groups AS t1 JOIN
            (SELECT group_id FROM group_status WHERE submission_id = $1
             AND current_status = 'pending'
             AND current_status != 'rejected')
            AS t2 ON t1.group_id = t2.group_id`,
          [submissionID]
      );
      const ElementEntries = await db.aQuery(
          `SELECT t1.* FROM element_entries AS t1 JOIN
            (SELECT element_id FROM element_status WHERE submission_id = $1
             AND current_status = 'pending'
             AND current_status != 'rejected')
            AS t2 ON t1.element_id = t2.element_id`,
          [submissionID]
      );
      const UnattachedElementEntries = await db.aQuery(
          `SELECT t5.nomenclature, t1.* FROM element_entries AS t1 
           JOIN (SELECT element_id FROM element_status
                 WHERE  submission_id = $1 
                 AND current_status = 'pending') AS t2 
           ON t1.element_id = t2.element_id
           JOIN (SELECT t3.* FROM bodies AS t3
                 JOIN (SELECT body_id 
                       FROM body_status 
                       WHERE submission_id = $1 
                       AND current_status != 'pending'
                       AND current_status != 'rejected')
                  AS t4 ON t3.body_id = t4.body_id) AS t5 
           ON t1.body_id = t5.body_id;`,
          [submissionID]
      );
      const Notes = await db.aQuery(
          `SELECT t1.* FROM notes AS t1 JOIN 
            (SELECT note_id FROM note_status
             WHERE submission_id = $1
             AND current_status = 'pending'
             AND current_status != 'rejected') 
            AS t2 ON t1.note_id = t2.note_id`,
          [submissionID]
      );
      resObj = await Promise.all([Bodies, Journal, Paper,
        AuthorsWithAttribution, Groups, ElementEntries,
        UnattachedElementEntries, Notes]);
    } catch (err) {
      next(createError(500));
    } finally {
      res.render('approval', {
        pdfPath: pdfPath,
        SubmissionID: submissionID,
        Bodies: resObj[0].rows,
        Journal: resObj[1].rows[0],
        Paper: resObj[2].rows[0],
        AuthorsWithAttribution: resObj[3].rows,
        Groups: resObj[4].rows,
        ElementEntries: resObj[5].rows,
        UnattachedElementEntries: resObj[6].rows,
        Notes: resObj[7].rows,
        _: ejsUnitConversion,
      });
    }
  } else {
    // Cannot approve own entries or edits
    res.render('approval-own-entry-error');
  }
});


/*
*===============================================================
*                    UPDATE ROUTE
*===============================================================
*/


router.post('/update', isLoggedIn, async function(req, res, next) {
  console.log(req.body);

  const client = await db.pool.connect();
  const userID = req.user.id;
  const submissionID = req.body.submissionID;

  switch (req.body.type) {
    case 'basic': {
      const paperQuery = `UPDATE paper_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const paperValue = ['active', userID, req.body.paperStatus];

      const journalQuery = `UPDATE journal_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const journalValue = ['active', userID, req.body.journalStatus];

      try {
        await client.query('BEGIN');
        await client.query(paperQuery, paperValue);
        await client.query(journalQuery, journalValue);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        res.json({
          status: 'error',
          message: 'Database transaction failed.',
        });
      } finally {
        client.release();
      }
      break;
    }

    case 'author': {
      const authorQuery = `UPDATE author_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const authorValue = ['active', userID, req.body.authorStatus];
      const attributionQuery = `UPDATE attribution_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const attributionValue = ['active', userID, req.body.attributionStatus];

      try {
        await client.query('BEGIN');
        await client.query(authorQuery, authorValue);
        await client.query(attributionQuery, attributionValue);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        res.json({
          status: 'error',
          message: 'Database transaction failed.',
        });
      } finally {
        client.release();
      }
      break;
    }

    case 'meteorite': {
      const bodyQuery = `UPDATE body_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const bodyValue = ['active', userID, req.body.bodyStatus];
      const groupQuery = `UPDATE group_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const groupValue = ['active', userID, req.body.groupStatus];

      try {
        await client.query('BEGIN');
        await client.query(bodyQuery, bodyValue);
        await client.query(groupQuery, groupValue);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        res.json({
          status: 'error',
          message: 'Database transaction failed.',
        });
      } finally {
        client.release();
      }
      break;
    }

    case 'element': {
      const elementQuery = `UPDATE element_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const elementValue = ['active', userID, req.body.elementStatus];
      try {
        await client.query('BEGIN');
        await client.query(elementQuery, elementValue);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        res.json({
          status: 'error',
          message: 'Database transaction failed.',
        });
      } finally {
        client.release();
      }
      break;
    }

    case 'note': {
      const noteQuery = `UPDATE note_status
      SET current_status = ($1), reviewed_by = ($2), reviewed_date = now()
      WHERE status_id = ($3)`;
      const noteValue = ['active', userID, req.body.noteStatus];
      try {
        await client.query('BEGIN');
        await client.query(noteQuery, noteValue);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        res.json({
          status: 'error',
          message: 'Database transaction failed.',
        });
      } finally {
        client.release();
      }
      break;
    }

    default: {
      res.json({
        status: 'error',
        message: 'Invalid request',
      });
      break;
    }
  }

  // Check if all parts of submission have been completed.
  let resObj = [];
  try {
    // Get the count for all pending status entries for submission
    const bodyCount = db.aQuery(
        `SELECT count(*) FROM body_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const journalCount = db.aQuery(
        `SELECT count(*) FROM journal_status
        WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const paperCount = db.aQuery(
        `SELECT count(*) FROM paper_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const attributionCount = db.aQuery(
        `SELECT count(*) FROM attribution_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const authorCount = db.aQuery(
        `SELECT count(*) FROM author_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const groupCount = db.aQuery(
        `SELECT count(*) FROM group_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const elementCount = db.aQuery(
        `SELECT count(*) FROM element_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    const noteCount = db.aQuery(
        `SELECT count(*) FROM note_status
         WHERE submission_id = $1 AND current_status = $2`,
        [submissionID, 'pending']
    );
    resObj = await Promise.all([bodyCount, journalCount,
      paperCount, attributionCount, authorCount,
      groupCount, elementCount, noteCount]);
  } catch (err) {
    res.json({
      status: 'error',
      message: 'Error getting pending count.',
    });
  } finally {
    console.log(resObj[0].rows);
    let pendingCount = 0;
    pendingCount += parseInt(resObj[0].rows[0].count);
    pendingCount += parseInt(resObj[1].rows[0].count);
    pendingCount += parseInt(resObj[2].rows[0].count);
    pendingCount += parseInt(resObj[3].rows[0].count);
    pendingCount += parseInt(resObj[4].rows[0].count);
    pendingCount += parseInt(resObj[5].rows[0].count);
    pendingCount += parseInt(resObj[6].rows[0].count);
    pendingCount += parseInt(resObj[7].rows[0].count);

    console.log('pending count: ' + pendingCount);
    if (pendingCount === 0) {
      const client = await db.pool.connect();
      // Update submission if no more pending entries
      try {
        const Submission = await db.aQuery(
            'SELECT pdf_path FROM submissions WHERE submission_id = $1',
            [submissionID]
        );
        const pdfPath = Submission.rows[0].pdf_path;
        console.log(pdfPath);
        if (pdfPath !== 'null' && pdfPath !== null) {
          const fullPath = path.join( __dirname, ('../../../public' + pdfPath));
          console.log('FULL PATH: ');
          console.log(fullPath);
          fs.unlink(fullPath, async (err) => {
            if (err) throw err;
            // If pdf successfully deleted, update submission
            const submissionQuery = `UPDATE submissions
            SET pdf_path = ($1), pending = ($2)
            WHERE submission_id = ($3)`;
            const submissionValue = ['null', false, submissionID];

            try {
              await client.query('BEGIN');
              await client.query(submissionQuery, submissionValue);
              await client.query('COMMIT');
            } catch (e) {
              await client.query('ROLLBACK');
              res.json({
                status: 'error',
                message: 'Submission Update Failed',
              });
            } finally {
              client.release();
            }
          });
        } else {
          const submissionQuery = `UPDATE submissions
          SET pdf_path = ($1), pending = ($2)
          WHERE submission_id = ($3)`;
          const submissionValue = ['null', false, submissionID];

          try {
            await client.query('BEGIN');
            await client.query(submissionQuery, submissionValue);
            await client.query('COMMIT');
          } catch (e) {
            await client.query('ROLLBACK');
            res.json({
              status: 'error',
              message: 'Submission Update Failed',
            });
          } finally {
            client.release();
          }
        }
      } catch (err) {
        next(createError(500));
      } finally {
        res.json({
          status: 'success',
          count: pendingCount,
        });
      }
    } else {
      res.json({
        status: 'success',
        count: pendingCount,
      });
    }
  }
});

module.exports = router;
