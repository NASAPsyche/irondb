const updater = require('../../db/update-entry');
const Router = require('express-promise-router');
const router = new Router();
// const {isLoggedIn} = require('../../middleware/auth');

// SWITCH FROM GET TO POST BEFORE PRODUCTION READY
// router.post('/', isLoggedIn, async (req, res, next) => {
router.get('/', async (req, res, next) => {
  // const reqBody = req.body;
  // const username = req.user.username;
  const resp = await updater.updateEntry();
  if ( resp == 0 ) {
    res.json({status: 'success'});
  } else {
    res.json({status: 'error'});
  }
});

module.exports = router;
