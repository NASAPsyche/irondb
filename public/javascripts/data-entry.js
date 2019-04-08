/* eslint-disable no-invalid-this */
$( '#tool' ).on( 'click', function() {
  $('#pdf-form').removeAttr('hidden');
});

const alertMessage = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Error: </strong>
  Please upload pdf before attempting to use automated tool.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;


$( '#pdf-form' ).on( 'submit', function( event ) {
  if ($('#pdf').val() === '') {
    event.preventDefault();
    if (!$('.alert')[0]) {
      $('#content').prepend( alertMessage);
    }
  } else {
    return;
  }
});
