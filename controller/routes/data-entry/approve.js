const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const ejsUnitConversion = require('../../utils/ejs-unit-conversion');
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');

router.get('/', isLoggedIn, function(req, res, next) {
  next(createError(400));
});

router.post('/', isLoggedIn, async function(req, res, next) {
  console.log(req.body.paperID);
  // Setup
  let pdfPath = 'null';
  let submissionID = '';
  let pending = false;
  let username = '';
  let resObj = [];

  // Query for submission
  try {
    const submissionID = await db.aQuery(
        'SELECT submission_id FROM paper_status WHERE paper_id = $1',
        [req.body.paperID]
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
             AND current_status = 'pending')
            AS t2 ON t1.body_id = t2.body_id`,
          [submissionID]
      );
      const Journal = await db.aQuery(
          `SELECT t1.* FROM journals AS t1 JOIN
            (SELECT journal_id FROM journal_status WHERE submission_id = $1
             AND current_status = 'pending')
            AS t2 ON t1.journal_id = t2.journal_id
            LIMIT 1`,
          [submissionID]
      );
      const Paper = await db.aQuery(
          `SELECT t1.* FROM papers AS t1 JOIN
            (SELECT paper_id FROM paper_status WHERE submission_id = $1
             AND current_status = 'pending')
            AS t2 ON t1.paper_id = t2.paper_id
            LIMIT 1`,
          [submissionID]
      );
      const AuthorsWithAttribution = await db.aQuery(
          `SELECT t1.*, t3.attribution_id, t3.attribution_status_id 
           FROM authors AS t1
           JOIN (SELECT author_id FROM author_status
                 WHERE submission_id = $1 AND current_status = 'pending') 
           AS t2 on t1.author_id = t2.author_id
           JOIN (SELECT t1.attribution_id, t1.author_id,
                        t1.status_id AS attribution_status_id 
                 FROM attributions AS t1 
                 JOIN (SELECT * FROM attribution_status 
                      WHERE submission_id = $1 AND current_status = 'pending') 
                      AS t2 ON t1.attribution_id = t2.attribution_id) 
            AS t3 ON t1.author_id = t3.author_id`,
          [submissionID]
      );
      const Groups = await db.aQuery(
          `SELECT t1.* FROM groups AS t1 JOIN
            (SELECT group_id FROM group_status WHERE submission_id = $1
             AND current_status = 'pending')
            AS t2 ON t1.group_id = t2.group_id`,
          [submissionID]
      );
      const ElementEntries = await db.aQuery(
          `SELECT t1.* FROM element_entries AS t1 JOIN
            (SELECT element_id FROM element_status WHERE submission_id = $1
             AND current_status = 'pending')
            AS t2 ON t1.element_id = t2.element_id`,
          [submissionID]
      );
      const Notes = await db.aQuery(
          `SELECT t1.* FROM notes AS t1 JOIN 
            (SELECT note_id FROM note_status WHERE submission_id = $1
             AND current_status = 'pending') 
            AS t2 ON t1.note_id = t2.note_id`,
          [submissionID]
      );
      resObj = await Promise.all([Bodies, Journal, Paper,
        AuthorsWithAttribution, Groups, ElementEntries, Notes]);
    } catch (err) {
      next(createError(500));
    } finally {
      console.log(resObj[2].rows[0]);
      res.render('approval', {
        pdfPath: pdfPath,
        SubmissionID: submissionID,
        Bodies: resObj[0].rows,
        Journal: resObj[1].rows[0],
        Paper: resObj[2].rows[0],
        AuthorsWithAttribution: resObj[3].rows,
        Groups: resObj[4].rows,
        ElementEntries: resObj[5].rows,
        Notes: resObj[6].rows,
        _: ejsUnitConversion,
      });
    }
  } else {
    // Cannot approve own entries or edits
    res.send('no');
  }
});

router.post('/update', isLoggedIn, async function(req, res, next) {
  console.log(req.body);

  switch (req.body.type) {
    case 'basic':
      res.json({
        status: 'success',
      });
      break;

    case 'author':
      res.json({
        status: 'success',
      });
      break;

    case 'meteorite':
      res.json({
        status: 'success',
      });
      break;

    case 'element':
      res.json({
        status: 'success',
      });
      break;

    case 'note':
      res.json({
        status: 'success',
      });
      break;

    default:
      res.json({
        status: 'error',
      });
  }
});

module.exports = router;
