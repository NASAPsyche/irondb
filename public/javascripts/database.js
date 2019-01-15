// Send ajax request with params
$( '#search-form' ).on( 'submit', function( event ) {
  event.preventDefault();
  $.post('/database', $( this ).serialize(), function( data ) {
    // Remove old table and replace with results
    $( '#results' ).replaceWith( data );
  });
});

// On error, no results found
$( document ).ajaxError( function() {
  $( '#results' ).replaceWith( '<p>Error: No results found.</p>' );
});

// On click, clear form elements
$( '#reset-btn' ).on( 'click', function( event ) {
  $('#search-form').get(0).reset();
});

// After AJAx, reset stored ids of export button
$( document ).ajaxComplete(function() {
  $( '#entry-ids' ).empty();
  $( 'p:hidden' ).each(function() {
    // eslint-disable-next-line max-len
    $('<input>').attr({type: 'hidden', name: 'entries'}).val( $(this).text()).appendTo( $('#entry-ids'));
  });
});
