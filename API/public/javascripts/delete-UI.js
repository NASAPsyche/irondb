/* eslint-disable no-invalid-this */
const successfulDeletionAlert = `
<div class="alert alert-success alert-dismissible fade show" role="alert">
  <strong>Success: </strong>
  Entry was deleted.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;

const failedDeletionAlert = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Error: </strong>
  Failed to delete entry, try reloading page and trying again.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;

// Toggle confirmation visibility
$('.delete-btn').on('click', function() {
  $(this).parent().siblings('div.collapse').collapse('show');
});

$('.cancel-btn').on('click', function() {
  $(this).parent('.collapse').collapse('hide');
});

// On confirmation of delete, call delete route
$('form.delete-submission').on('submit', function( event ) {
  event.preventDefault();
  const row = $(this).closest('tr');
  $.post('/data-entry/delete', $(this).serialize(), function( data ) {
    console.log(data);
    if (data.hasOwnProperty('status') && data.status === 'success') {
      $('#alert-target').empty().append(successfulDeletionAlert);
      row.remove();
    } else {
      $('#alert-target').empty().append(failedDeletionAlert);
    }
  });
});
