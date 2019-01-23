
function sendRequest(){

    $.get("http://localhost:8081/", function(data,status){

        document.getElementById("tableText").innerHTML = data;

        }


    )
}
