const Router = require('express-promise-router');
const router = new Router();
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');
const pg = require('../../db');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const Elements = pg.aQuery('SELECT symbol FROM element_symbols', []);
    // eslint-disable-next-line max-len
    const Technique = pg.aQuery('SELECT abbreviation FROM analysis_techniques', []);

    const fetchJsonQuery = `
    SELECT savedata FROM entry_store 
    WHERE entry_store.username = ($1)
    `;
    const SavedData = pg.aQuery(fetchJsonQuery, [req.user.username] );

    const resObj = await Promise.all([Elements, SavedData, Technique]);

    let fetchedData;
    if ( resObj[1].rows === 'undefined' || resObj[1].rows.length == 0) {
      fetchedData = '';
    } else {
      fetchedData = JSON.stringify( resObj[1].rows[0]['savedata'] );
    }

    res.render('editor', {
      username: req.user.username,
      data: null,
      sessionID: req.sessionID,
      savedData: fetchedData,
      Elements: resObj[0].rows,
      Technique: resObj[2].rows,
    });
  } catch (err) {
    next(createError(500));
  }
});

module.exports = router;
