/* eslint-disable no-invalid-this */

$('#format-select').on('change', function(event) {
  // Hide none selected table
  if ($('#format-select option:selected').val() === 'without-analysis') {
    $( '#with-analysis').prop('hidden', true);
    $('#without-analysis').prop('hidden', false);
  } else {
    $( '#with-analysis').prop('hidden', false);
    $('#without-analysis').prop('hidden', true);
  }
});


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

const alertMessage = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Warning: </strong>
  One or more rows export may be missing attribution of analysis technique.
   See paper for more information.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;

$( '#export-form' ).submit( function( event ) {
  // Get selected table id
  const selectedTable = '#' + $('#format-select option:selected').val();

  // Alert
  let isEmptyCell = false;
  if (selectedTable == '#with-analysis') {
    $(selectedTable + ' > tbody > tr > th.technique').map(function(cell) {
      if (this.innerHTML === '') {
        isEmptyCell = true;
      }
    });

    if (isEmptyCell === true) {
      if (!$('.alert')[0]) {
        $('#alert').prepend(alertMessage);
      }
    }
  }

  // Get fields
  const fields = $(selectedTable + ' > thead > tr > th' ).map(function() {
    if (this.innerText !== '') {
      return this.innerText;
    }
  }).get();

  // Get data
  const data = [];
  let currentRow = {};
  let isFirstRow = true;
  const numRows = $(selectedTable + ' > tbody > tr').length;
  $(selectedTable + ' > tbody > tr').map(function() {
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
