const updater = require('../../db/update-entry');
const {isLoggedIn} = require('../../middleware/auth');
const Router = require('express-promise-router');
const router = new Router();

/**
 * Parses a json for actions and then updates/inserts/deletes
 * entries in the database as per the aciton instructions
 */
router.post('/', isLoggedIn, async (req, res, next) => {
  const obj = req.body;
  const username = req.user.username;
  console.dir(obj);
  const resp = await updater.updateEntry(obj, username);
  console.log( 'resp ====', resp);
  if ( resp === true ) {
    res.json({status: 'success'});
  } else {
    res.json({status: 'error'});
  }
});


module.exports = router;
