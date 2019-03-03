
/**
 * @description When on the manual editor, and you choose to upload a PDF, this
 * saves your work before continuing on.
 */
$(document).ready(function() {
  $('#pdf-form').submit(function(event) {
    event.preventDefault(); // do not submit
    const jsonString = serializeForm();
    $.ajax({
      url: '/data-entry/save',
      type: 'POST',
      data: jsonString,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data, status, jqXHR) {
        alert(status);
      },

      error: function(jqXHR, status) {
        // error handler
        console.log(jqXHR);
        alert('fail' + status.code);
      },
    });


    // eslint-disable-next-line no-invalid-this
    // this.submit(); // ok, submit
  });
});

/**
 * @description serialize the insert form
 * @return {string} returns string with username, form data, and pdf string
 */
function serializeForm() {
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
