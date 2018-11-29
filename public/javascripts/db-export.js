// Remove row when x clicked.
$( "i" ).click(function() {
	$( this ).parent().parent().remove();
});

// On submit of the form, collect entry ids from hidden elements and submit post request.
$( "form" ).on("click", function(){
	$( "#entry-ids" ).empty();
	$( "th:hidden" ).each(function(){
		$( "<input>" ).attr({type: "hidden", name: "entries"}).val( $(this).text() ).appendTo( $( "#entry-ids" ) );
	});
});