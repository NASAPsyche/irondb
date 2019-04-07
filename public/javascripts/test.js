const markers =

$.ajax({
  type: 'POST',
  url: '/webservices/PodcastService.asmx/CreateMarkers',
  // The key needs to match your method's input parameter (case-sensitive).
  data: JSON.stringify({Markers: markers}),
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
  success: function(data) {
    alert(data);
  },
  failure: function(errMsg) {
    alert(errMsg);
  },
});
