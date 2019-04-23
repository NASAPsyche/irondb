const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const updater = require('../../db/update-entry');
const ejsUnitConversion = require('../../utils/ejs-unit-conversion');
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');

router.get('/', isLoggedIn, function(req, res, next) {
  next(createError(400));
});

router.post('/', isLoggedIn, async function(req, res, next) {
  // Setup
  const submissionID = req.body.submissionID;
  let pdfPath = null;
  // let pending = null;
  let username = null;

  let resObj = [];
  // Query for submission
  try {
    const Elements = db.aQuery('SELECT symbol FROM element_symbols', []);
    const Technique = db.aQuery(
        'SELECT abbreviation FROM analysis_techniques', []);
    const Submission = db.aQuery(
        'SELECT * FROM submissions WHERE submission_id = $1',
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
    const Journal = await db.aQuery(
        `SELECT t1.* FROM journals AS t1 JOIN
          (SELECT journal_id FROM journal_status WHERE submission_id = $1)
          AS t2 ON t1.journal_id = t2.journal_id
          LIMIT 1`,
        [submissionID]
    );
    const Authors = await db.aQuery(
        `SELECT t1.* 
        FROM authors AS t1
        JOIN (SELECT author_id FROM author_status
              WHERE submission_id = $1 
              AND current_status != 'rejected') 
        AS t2 on t1.author_id = t2.author_id`,
        [submissionID]
    );
    const Bodies = await db.aQuery(
        `SELECT t1.* FROM bodies AS t1 JOIN
          (SELECT body_id FROM body_status WHERE submission_id = $1
            AND current_status != 'rejected')
          AS t2 ON t1.body_id = t2.body_id`,
        [submissionID]
    );
    const Groups = await db.aQuery(
        `SELECT t1.* FROM groups AS t1 JOIN
          (SELECT group_id FROM group_status 
            WHERE submission_id = $1
            AND current_status != 'rejected')
          AS t2 ON t1.group_id = t2.group_id`,
        [submissionID]
    );
    const ElementEntries = await db.aQuery(
        `SELECT t1.* FROM element_entries AS t1 JOIN
          (SELECT element_id FROM element_status 
            WHERE submission_id = $1
            AND current_status != 'rejected')
          AS t2 ON t1.element_id = t2.element_id`,
        [submissionID]
    );
    const Notes = await db.aQuery(
        `SELECT t1.* FROM notes AS t1 JOIN 
        (SELECT note_id FROM note_status 
          WHERE submission_id = $1
          AND current_status != 'rejected') 
        AS t2 ON t1.note_id = t2.note_id`,
        [submissionID]
    );
    resObj = await Promise.all([
      Elements, Technique, Submission, Paper, Journal,
      Authors, Bodies, Groups, ElementEntries, Notes,
    ]);
  } catch (err) {
    next(createError(500));
  } finally {
    if (resObj[2].rows[0] !== undefined &&
        resObj[2].rows[0].hasOwnProperty('pdf_path') &&
        resObj[2].rows[0].hasOwnProperty('submission_id') &&
        resObj[2].rows[0].hasOwnProperty('pending') &&
        resObj[2].rows[0].hasOwnProperty('username')
    ) {
      pdfPath = resObj[2].rows[0].pdf_path;
      // pending = resObj[2].rows[0].pending;
      username = resObj[2].rows[0].username;
    } else {
      next(createError(500));
    }

    res.render('edit', {
      Elements: resObj[0].rows,
      Technique: resObj[1].rows,
      pdfPath: pdfPath,
      SubmissionID: submissionID,
      Paper: resObj[3].rows[0],
      Journal: resObj[4].rows[0],
      Authors: resObj[5].rows,
      Bodies: resObj[6].rows,
      Groups: resObj[7].rows,
      ElementEntries: resObj[8].rows,
      Notes: resObj[9].rows,
      username: username,
      _: ejsUnitConversion,
    });
  }
});

router.post('/submit', isLoggedIn, async function(req, res, next) {
  const obj = {};
  obj.submissionID = req.body.submissionID;
  obj.actions = JSON.parse(req.body.actions);
  if (obj.actions.length !== 0) {
    const username = req.user.username;
    console.dir(obj);
    const resp = await updater.updateEntry(obj, username);
    console.log( 'resp ====', resp);
  }

  // Redirect to panel when done
  res.redirect('/panel');
});

module.exports = router;
