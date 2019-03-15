const convert = require('../../utils/unit-conversion');
const createError = require('http-errors');
const db = require('../../db');
const Router = require('express-promise-router');
const router = new Router();

/* GET single entry */
router.get('/:id', async (req, res, next) => {
  let paperID = -1;
  if (req.query.hasOwnProperty('paper')) {
    paperID = parseInt(req.query.paper, 10);
  }

  let resObj = [];
  try {
    const Entries = db.aQuery(
        'SELECT * FROM complete_table WHERE entry_id=$1 LIMIT 1',
        [req.params.id]
    );
    const PaperList = db.aQuery(
        'SELECT DISTINCT paper_id, title FROM complete_table WHERE entry_id=$1',
        [req.params.id]
    );
    let queryString = 'SELECT * FROM elements_with_bodies_groups_active';
    queryString += ' WHERE body_id=$1 AND paper_id=$2 AND ppb_mean > 10000000';
    const MajorElements = db.aQuery(
        queryString, [req.params.id, paperID]
    );
    queryString = 'SELECT * FROM elements_with_bodies_groups_active';
    queryString += ' WHERE body_id=$1 AND paper_id=$2 AND';
    queryString += ' ppb_mean <= 10000000 AND ppb_mean >= 1000000';
    const MinorElements = db.aQuery(
        queryString, [req.params.id, paperID]
    );
    queryString = 'SELECT * FROM elements_with_bodies_groups_active';
    queryString += ' WHERE body_id=$1 AND paper_id=$2 AND ppb_mean < 1000000';
    const TraceElements = db.aQuery(
        queryString, [req.params.id, paperID]
    );

    resObj = await Promise.all([
      Entries, PaperList,
      MajorElements, MinorElements,
      TraceElements,
    ]);
  } catch (err) {
    next(createError(500));
  } finally {
    // Convert Major Elements from ppb to wt%
    resObj[2].rows.forEach(function(row) {
      row.ppb_mean = convert.ppbToPercent(row.ppb_mean, row.sigfig);
      if (row.deviation !== 0) {
        row.deviation = convert.ppbToPercent(row.deviation, row.sigfig);
      }
    });

    // Convert Minor Elements from ppb to ppm
    resObj[3].rows.forEach(function(row) {
      row.ppb_mean = convert.ppbToPPM(row.ppb_mean, row.sigfig);
      if (row.deviation !== 0) {
        row.deviation = convert.ppbToPPM(row.deviation, row.sigfig);
      }
    });

    res.render('single-body', {
      isSignedIn: req.isAuthenticated(),
      PaperID: paperID,
      Entries: resObj[0].rows,
      PaperList: resObj[1].rows,
      MajorElements: resObj[2].rows,
      MinorElements: resObj[3].rows,
      TraceElements: resObj[4].rows,
    });
  }
});

module.exports = router;
