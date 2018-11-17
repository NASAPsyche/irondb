$("button").on("click", function(){
	// AJAX to call the server to get all usernames.
	$.get("/example", function(data){
		// Update the page to include that information.
		var usernames = data["usernames"];
		console.log(usernames);
		var i = 1;
		usernames.forEach((entry) => {
			$("#update-target").after("<p> Username " + i + ": " + entry.username + "</p><br>");
			i++;
		});
	});
});


// {"usernames":[{"username":"bob"}]}