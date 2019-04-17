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
  // Setup
  const submissionID = req.body.submissionID;
  let pdfPath = null;
  // let pending = null;
  let username = null;

  let resObj = [];
  // Query for submission
  try {
    const Submission = db.aQuery(
        'SELECT * FROM submissions WHERE submission_id = $1',
        [submissionID]
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
      pdfPath = resObj[0].rows[0].pdf_path;
      // pending = resObj[0].rows[0].pending;
      username = resObj[0].rows[0].username;
    } else {
      next(createError(500));
    }

    res.render('edit', {
      pdfPath: pdfPath,
      SubmissionID: submissionID,
      username: username,
      _: ejsUnitConversion,
    });
  }
});


module.exports = router;
