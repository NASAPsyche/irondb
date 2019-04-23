const updater = require('../../db/update-entry');
const {isLoggedIn} = require('../../middleware/auth');
const db = require('../../db');
const Router = require('express-promise-router');
const router = new Router();

/**
 * Builds update call to delete all parts of a submission
 * then deletes the submission
 */
router.post('/', isLoggedIn, async (req, res, next) => {
  // If no submission send error
  if (!req.body.hasOwnProperty('submissionID')) {
    res.json({status: 'error'});
  }

  let resObj = [];
  const submissionID = req.body.submissionID;
  try {
    // Get all parts of submission
    const Basic = await db.aQuery(
        `SELECT t1.paper_id, journal_id FROM papers AS t1
        JOIN (SELECT * FROM paper_status WHERE submission_id = ($1)) AS t2
        ON t1.status_id = t2.status_id`,
        [submissionID]
    );
    const Author = await db.aQuery(
        `SELECT t1.paper_id, author_id FROM attributions AS t1
        JOIN (SELECT * FROM attribution_status WHERE submission_id = ($1)) AS t2
        ON t1.status_id = t2.status_id`,
        [submissionID]
    );
    const Body = await db.aQuery(
        `SELECT t1.group_id, body_id FROM groups AS t1
        JOIN (SELECT * FROM group_status WHERE submission_id = ($1)) AS t2
        ON t1.status_id = t2.status_id`,
        [submissionID]
    );
    const Element = await db.aQuery(
        `SELECT element_id FROM element_status WHERE submission_id = ($1)`,
        [submissionID]
    );
    const Note = await db.aQuery(
        `SELECT note_id FROM note_status WHERE submission_id = ($1)`,
        [submissionID]
    );
    resObj = await Promise.all([Basic, Author, Body, Element, Note]);
  } catch (err) {
    res.json({status: 'error'});
  } finally {
    // Build command object
    const actions = [];
    const obj = {};
    obj.submissionID = submissionID;

    // Basic
    resObj[0].rows.map((row) => {
      const temp = {};
      temp.type = 'basic';
      temp.command = 'delete';
      temp.paperID = row.paper_id;
      temp.journalID = row.journal_id;
      actions.push(temp);
    });

    // Author
    resObj[1].rows.map((row) => {
      const temp = {};
      temp.type = 'author';
      temp.command = 'delete';
      temp.paperID = row.paper_id;
      temp.authorID = row.author_id;
      actions.push(temp);
    });

    // Body
    resObj[2].rows.map((row) => {
      const temp = {};
      temp.type = 'body';
      temp.command = 'delete';
      temp.bodyID = row.body_id;
      temp.groupID = row.group_id;
      actions.push(temp);
    });

    // Element
    resObj[3].rows.map((row) => {
      const temp = {};
      temp.type = 'element';
      temp.command = 'delete';
      temp.elementID = row.element_id;
      actions.push(temp);
    });

    // Note
    resObj[4].rows.map((row) => {
      const temp = {};
      temp.type = 'note';
      temp.command = 'delete';
      temp.noteID = row.note_id;
      actions.push(temp);
    });

    obj.actions = actions;
    obj.command = 'delete';

    // Run commands and send response
    const username = req.user.username;
    const resp = await updater.updateEntry(obj, username);
    console.log( 'resp ====', resp);
    if ( resp === true ) {
      res.json({status: 'success'});
    } else {
      res.json({status: 'error'});
    }
  }
});

module.exports = router;
