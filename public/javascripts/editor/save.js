/**
 * @description On click the save, it sends serialized form via post.
 */
$(document).ready(function() {
  $('#save-btn').click(function() {
    const jsonString = serializeInsertForm();
    const success = postSave(jsonString);
    if (success === true) {
      return true; // submit
    } else {
      alert('There was an error saving your data, try again later.');
      return false;
    }
  });
});

/**
 * @description When on the manual editor, and you choose to upload a PDF, this
 * saves your work before continuing on.
 */
$(document).ready(function() {
  $('#pdf-form').submit(function(event) {
    const jsonString = serializeInsertForm();
    const success = postSave(jsonString);
    if (success === true) {
      return; // submit
    } else {
      event.preventDefault(); // do not submit
    }
  });
});

/**
 * @description serialize the insert form
 * @return {string} returns string with username, form data, and pdf string
 */
function serializeInsertForm() {
  const serializedData = $('#insert-form').serializeArray();
  console.log(serializedData);
  const jsondata_ = {};
  serializedData.forEach(function(element) {
    jsondata_[element['name']] = element['value'];
  });
  console.log(jsondata_);
  // eslint-disable-next-line no-undef
  const username_ = username; // username defined in ejs from route
  // eslint-disable-next-line no-undef
  const filename_ = filename; // filename defined in ejs from route

  const fullJson = {
    username: username_,
    data: jsondata_,
    pdf_path: filename_,
  };

  console.log(fullJson);
  return (JSON.stringify(fullJson));
}
/**
 * @param  {String} jsonString
 * @return {boolean} success
 */
function postSave(jsonString) {
  let flag;
  $.ajax({
    url: '/data-entry/save',
    type: 'POST',
    data: jsonString,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data, status, jqXHR) {
      alert(status);
      flag = true;
    },

    error: function(jqXHR, status) {
      // error handler
      console.log(jqXHR);
      alert('fail' + status.code);
      flag = false;
    },
  });
  return flag;
}

// $(document).ready(function() {
//   $('#save-btn').click(function() {
//     const serializedData = $('#insert-form').serializeArray();
//     const jsondata_ = {};
//     serializedData.forEach(function(element) {
//       jsondata_[element['name']] = element['value'];
//     });
//     // eslint-disable-next-line no-undef
//     const username_ = username; // username defined in ejs from route
//     // eslint-disable-next-line no-undef
//     const filename_ = filename; // filename defined in ejs from route

//     const jsonsend = {
//       username: username_,
//       data: jsondata_,
//       pdf_path: filename_,
//     };

//     // Send a post request to save the data
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', '/data-entry/save', true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify(jsonsend));
//     alert('Saved the form');
//   });
// });
