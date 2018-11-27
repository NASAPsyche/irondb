// Send ajax request with params
$( "form" ).on( "submit", function( event ) {
  event.preventDefault();
  $.post('/database', $( this ).serialize(), function( data ){
  	// Remove old table and replace with results
  	$( "#results" ).replaceWith( data );
  });
});

// On error, no results found
$( document ).ajaxError( function() {
  $( "#results" ).replaceWith( "<p>Error: No results found.</p>" );
});

// On click, clear form elements
$( "#reset-btn" ).on( "click", function( event ) {
	$('form').get(0).reset();
});
