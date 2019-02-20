/* eslint-disable no-invalid-this */
// Remove row when x clicked.
$( 'i' ).click(function() {
  $( this ).parent().parent().remove();
  if ($( 'tr' ).length === 1) {
    // eslint-disable-next-line max-len
    $('#entries').append('<a class="btn btn-danger" href="/database">Back to Database</a>');
  }
});


$( '#export-form' ).submit( function( event ) {
  // Get fields
  const fields = $( 'thead > tr > th' ).map(function() {
    if (this.innerText !== '') {
      return this.innerText;
    }
  }).get();

  // Get data
  const data = [];
  let currentRow = {};
  $('tbody > tr').map(function() {
    $.each( this.children, function(index, value) {
      console.log(value);
      if (index === 0) {
        data.push(currentRow);
        currentRow = {};
      } else {
        // console.log('-----------------------------------------');
        // console.log('current field: ' + fields[index - 1]);
        // console.log('current value: ' + value);
        // console.log('current textContent: ' + value.textContent);
        // console.log('null test ' + value.textContent === null);
        // console.log('current innerText: ' + value.innerText);
        // console.log('type of inner' + typeof value.innerText);
        // console.log('-----------------------------------------');

        currentRow[fields[index - 1]] = (value.textContent.search(/\n/) !== -1)
            ? value.innerText : value.textContent;
      }

      if (data.length === index) {
        data.shift();
        data.push(currentRow);
      }
    });
  });

  // Combine for post request
  const postData = {
    'fields': fields,
    'data': data,
  };

  $('#tableData').val(JSON.stringify(postData));

  return true;
});
