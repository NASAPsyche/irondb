/**
 * A collection of functions for saving work in progress in the editor
 */


/**
 * @description On click the save, it sends serialized form via post.
 */
$(document).ready(async () => {
  $('#save-btn').click(async () => {
    const jsonString = serializeInsertForm();
    // postSave(jsonString);
    if ( await postSave(jsonString) === true ) {
      alert('Saved');
    } else {
      alert('Failed to save, check your connection');
    }
  });
});

/**
 * @description save the work every minute
 */
$(document).ready(async function() {
  setInterval(async function() {
    const jsonString = serializeInsertForm();
    if ( await postSave(jsonString) === true ) {
      console.log('save successful');
    } else {
      alert('Failed to auto-save, check your connection');
    }
  }, 60 * 1000 /* One minute in milliseconds */);
});


/**
 * @description When on the manual editor, and you choose to upload a PDF, this
 * saves your work before continuing on.
 */
$(document).ready(async function() {
  $('#pdf-form').submit(async function(event) {
    const jsonString = serializeInsertForm();
    if (await postSave(jsonString) === true) {
      // event.preventDefault(); // do not submit
      return; // submit
    } else {
      alert('failed to save');
      event.preventDefault(); // do not submit
    }
  });
});


/**
 * @description serialize the insert form
 * @return {string} returns string with username, form data, and pdf string
 */
function serializeInsertForm() {
  // eslint-disable-next-line max-len
  const serializedData = $('#insert-form').find(':input:not(:hidden)').serializeArray();
  const jsondata_ = {};
  // match keys to values
  serializedData.forEach(function(element) {
    jsondata_[element['name']] = element['value'];
  });
  // eslint-disable-next-line no-undef
  const username_ = username; // username defined in ejs from route
  // eslint-disable-next-line no-undef
  // const filename_ = filename; // filename defined in ejs from route

  const fullJson = {
    username: username_,
    data: jsondata_,
    // pdf_path: filename_,
  };
  return (JSON.stringify(fullJson));
}


/**
 * @description sends POST to save serialized form
 * @param  {String} jsonString
 */
async function postSave(jsonString) {
  let ret;
  await $.ajax({
    url: '/data-entry/save',
    type: 'POST',
    data: jsonString,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: true,
    success: function(data, status, jqXHR) {
      ret = true;
    },
    error: function(jqXHR, status) {
      ret = false;
    },
  });
  return ret;
}
