/* eslint-disable no-invalid-this */
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
    if (data.status === 'success') {
      form.children('button').attr('disabled', 'false');
    }
  });
});
