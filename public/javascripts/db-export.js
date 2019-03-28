/* eslint-disable no-invalid-this */
// let numberOfElementColumns = 0;
// $('document').ready(function() {
// Get number of element columns
// numberOfElementColumns = $('thead > tr > th:eq(-7)').attr('class');
// });

// Remove row when x clicked, and column when no remaining values.
$( 'i' ).click(function() {
  // Get columns with values by checking row to be removed
  // const columnsWithValues = $( this ).parent().parent().children()
  //     .slice(4, (parseInt(numberOfElementColumns) + 5))
  //     .map(function() {
  //       if ($.trim($(this).text()).length > 0) {
  //         return $(this).attr('class');
  //       }
  //     }).get();

  // Remove row
  $( this ).parent().parent().remove();
  if ($( 'tr' ).length === 1) {
    // eslint-disable-next-line max-len
    $('#entries').append('<a class="btn btn-danger" href="/database">Back to Database</a>');
  }

  // // Remove any column if empty
  // let isEmpty = true;
  // for (let i = 0; i < columnsWithValues.length; i++) {
  //   $('.'+columnsWithValues[i]).slice(1).each(function() {
  //     if ($.trim($(this).text()).length > 0) {
  //       isEmpty = false;
  //       return false;
  //     }
  //   });
  //   if (isEmpty) {
  //     $('.'+columnsWithValues[i]).remove();
  //   }
  // }
});

$('#top-btn').on('click', function() {
  $('#export-btn').trigger('click');
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
  let isFirstRow = true;
  const numRows = $('tbody > tr').length;
  $('tbody > tr').map(function() {
    $.each( this.children, function(index, value) {
      if (index === 0 && !isFirstRow) {
        data.push(currentRow);
        currentRow = {};
      } else {
        currentRow[fields[index - 1]] = (value.textContent.search(/\n/) !== -1)
            ? value.innerText : value.textContent;
      }
      isFirstRow = false;

      if (index === fields.length && data.length === (numRows - 1)) {
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
