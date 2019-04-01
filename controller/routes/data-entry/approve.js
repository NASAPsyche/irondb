const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');

router.get('/', isLoggedIn, function(req, res, next) {
  next(createError(400));
});

router.post('/', isLoggedIn, async function(req, res, next) {
  console.log(req.body.paperID);
  // Setup
  let pdfPath = 'null';
  // let submissionID = '';
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
    //   submissionID = resObj[0].rows[0].submission_id;
      pdfPath = resObj[0].rows[0].pdf_path;
      pending = resObj[0].rows[0].pending;
      username = resObj[0].rows[0].username;
    } else {
      next(createError(500));
    }
  }

  if (!pending && username !== req.user.username) {
    try {
      console.log('worked');
    } catch (err) {
      next(createError(500));
    } finally {
      res.render('approval', {
        pdfPath: pdfPath,
        paperID: req.body.paperID,
      });
    }
  } else {
    // Cannot approve own entries or edits
    res.send('no');
  }
});

module.exports = router;
