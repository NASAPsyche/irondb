/* eslint-disable no-invalid-this */
const successMessage =
`<div class="d-flex flex-row align-items-center justify-content-center">
<div class="alert alert-success alert-dismissible fade show" role="alert">
  <strong>Success: </strong>
  All parts of submission have been approved.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
</div>
<div class="d-flex flex-row align-items-center justify-content-center">
    <a href="/database/unapproved" class="btn btn-danger btn-lg">
      Back to unapproved
    </a>
</div>`;


$('#event-div').on('submit', 'form', function(event) {
  event.preventDefault();
  const form = $( this );
  form.children('button').attr('disabled', 'true');
  $.post('/data-entry/approve/update', $( this ).serialize(), function( data ) {
    console.log(data);
    // Change submit button on success
    if (data.status === 'success') {
      form.children('button').removeClass('btn-primary');
      form.children('button').addClass('btn-success');
      form.children('button').text('Approved');
    }

    // Alert user of failure
    if (data.status !== 'success') {
      form.children('button').attr('disabled', 'false');
    }

    if (data.hasOwnProperty('count') && data.count === 0) {
      $('#alert-target').replaceWith(successMessage);
    }
  });
});
