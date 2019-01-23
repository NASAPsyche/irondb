function getRequestObject() {
    if (window.XMLHttpRequest) {
        return(new XMLHttpRequest());
    } else {
        return(null);
    }
}

function sendRequest() {
    var request = getRequestObject();
    request.onreadystatechange =
        function() {
            handleResponse(request);
    };
    request.open("GET", "http://localhost:8081/", true);
    request.send(null);
}

function handleResponse(request) {

    if ((request.status >= 400 && request.status < 500)) {
        var errorString = "400 Bad Request: The request cannot be fulfilled due to bad syntax."

        document.getElementById("tableText").innerHTML = errorString;
    } else if ((request.status >= 500 && request.status < 600)) {
        document.getElementById("tableText").innerHTML = "There has been a server error of type " + request.status +
            ". Please try again later."

    } else if ((request.readyState == 4) && (request.status == 200)) {


//setting top text showing all cards in play and welcome message
        var data = JSON.parse(request.responseText);
        // document.getElementById("tableText").innerHTML = "Response: " + data.toString();
        document.getElementById("tableText").innerHTML = "Response:";

    }else{

document.getElementById("tableText").innerHTML = request.readyState.toString();
    }

}

