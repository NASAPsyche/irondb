
/**
 * @description When on the manual editor, and you choose to upload a PDF, this
 * saves your work before continuing on.
 */
$(document).ready(function() {
  $('#pdf-form').submit(function(event) {
    event.preventDefault(); // do not submit
    const serializedData = $('#insert-form').serializeArray();
    const jsondata_ = {};
    serializedData.forEach(function(element) {
      jsondata_[element['name']] = element['value'];
    });
    // eslint-disable-next-line no-undef
    const username_ = username; // username defined in ejs from route
    // eslint-disable-next-line no-undef
    const filename_ = filename; // filename defined in ejs from route

    const jsonsend = {
      username: username_,
      data: jsondata_,
      pdf_path: filename_,
    };

    // Send a post request to save the data
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/data-entry/save', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(jsonsend));
    // eslint-disable-next-line no-invalid-this
    this.submit(); // ok, submit
  });
});
