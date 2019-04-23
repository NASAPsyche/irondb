const Router = require('express-promise-router');
const router = new Router();
const db = require('../db');
const {isLoggedIn} = require('../middleware/auth');
const createError = require('http-errors');
const formidable = require('formidable');
const path = require('path');
const {PythonShell} = require('python-shell');
const sPath = path.join(__dirname, ('../../external/pdfScraper'));
const fs = require('fs');

// Mounting Routers
const approvalRouter = require('./data-entry/approve');
router.use('/approve', approvalRouter);

const insertRouter = require('./data-entry/insert');
router.use('/insert', insertRouter);

const updateRouter = require('./data-entry/update');
router.use('/insert/update', updateRouter);

const editRouter = require('./data-entry/edit');
router.use('/edit', editRouter);

const deleteRouter = require('./data-entry/delete');
router.use('/delete', deleteRouter);

const resumeRouter = require('./data-entry/resume');
router.use('/resume', resumeRouter);

const dataEntrySaveRouter = require('./data-entry/save');
router.use('/save', dataEntrySaveRouter);

const toolRouter = require('./data-entry/tool');
router.use('/tool', toolRouter);


// Routes
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('data-entry', {Alert: '', AlertType: ''});
});

router.post('/', isLoggedIn, async function(req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, ('../../public/temp/'));
  form.parse(req, async function(err, fields, files) {
    if (err) next(createError(500));
    if (files.filetoupload.size === 0) {
      next(createError(500));
    } else {
      const oldpath = files.filetoupload.path;
      const fileNameBody = files.filetoupload.name.substring(
          0, files.filetoupload.name.length - 4
      );
      // eslint-disable-next-line max-len
      try {
        // Get number to append if duplicate filename
        let fileNameCounter = 0;
        fs.readdir(form.uploadDir, (err, filesInDirectory) => {
          filesInDirectory.forEach((file) => {
            if (file.includes(fileNameBody)) fileNameCounter++;
          });
          let newpath = '';
          // If duplicate filename make filename unique
          if (fileNameCounter === 0) {
            newpath = path.join(
                __dirname, ('../../public/temp/' + files.filetoupload.name)
            );
          } else {
            newpath = path.join(
                __dirname,
                ('../../public/temp/' + fileNameBody
                + '(' + fileNameCounter + ')' + '.pdf')
            );
          }
          fs.rename(oldpath, newpath, async function(err) {
            if (err) {
              next(createError(500));
            } else {
            // Get text and number of page
              req.session.fileName = newpath.slice(21);
              const options = {
                mode: 'text',
                // pythonPath: '../py',
                pythonOptions: ['-u'], // get print results in real-time
                scriptPath: sPath,
                args: [JSON.stringify(req.session)],
              };
              PythonShell.run('pdf_num_pages.py',
                  options, async function(err, result) {
                    console.log(result);
                    if (err || result[0] === '-1') {
                      console.log(err);
                      // Failed to read or error
                      // Delete upload before alerting user
                      fs.unlink(newpath, async (err) => {
                        if (err) {
                          console.log(err);
                          res.render('data-entry', {Alert:
                            `Uploaded pdf is Invalid. 
                            Please try another pdf or use the manual editor.
                            (Failed to delete upload)`,
                          AlertType: 'error',
                          });
                        } else {
                          res.render('data-entry', {Alert:
                            `Uploaded pdf is Invalid. 
                            Please try another pdf or use the manual editor.`,
                          AlertType: 'error',
                          });
                        }
                      });
                    } else {
                      req.session.textHolder = result;
                      console.log(result);
                      // get pages
                      // Render checklitst template
                      let resObj = [];
                      try {
                        const Elements = db.aQuery(
                            'SELECT symbol FROM element_symbols', []);
                        const Technique = db.aQuery(
                            'SELECT abbreviation FROM analysis_techniques', []);
                        resObj = await Promise.all([Elements, Technique]);
                      } catch (err) {
                        next(createError(500));
                      } finally {
                        res.render('tool', {
                          data: newpath.slice(15),
                          username: req.user.username,
                          Elements: resObj[0].rows,
                          Technique: resObj[1].rows,
                          numOfPages: result[0],
                        });
                      }
                    }
                  });
            }
          });
        });
      } catch (err) {
        next(createError(500));
      }
    }
  });
});

router.get('/editor', isLoggedIn, async function(req, res, next) {
  let resObj = [];
  try {
    const Elements = db.aQuery('SELECT symbol FROM element_symbols', []);
    const Technique = db.aQuery(
        'SELECT abbreviation FROM analysis_techniques', []);
    resObj = await Promise.all([Elements, Technique]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('editor', {
      username: req.user.username,
      data: null,
      Elements: resObj[0].rows,
      Technique: resObj[1].rows,
    });
  }
});


module.exports = router;
