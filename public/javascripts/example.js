$("button").on("click", function(){
	// AJAX to call the server to get all usernames.
	$.get("/example", function(data){
		// Update the page to include that information.
		$("#update-target").text(data.username);
	});
});