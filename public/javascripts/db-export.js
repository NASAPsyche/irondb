// Remove row when x clicked.
$( 'i' ).click(function() {
  $( this ).parent().parent().remove();
  if ($( 'tr' ).length === 1) {
    $( '#entries' )
        .append('<a class="btn btn-danger" href="/database">'
        +'Back to Database</a>');
  }
});

// On submit of the form, collect entry ids
// from hidden elements and submit post request.
$( 'form' ).on('click', function() {
  $( '#entry-ids' ).empty();
  $( 'th:hidden' ).each(function() {
    $( '<input>' )
        .attr({type: 'hidden', name: 'entries'})
        .val( $(this).text() )
        .appendTo( $( '#entry-ids' ) );
  });
});

