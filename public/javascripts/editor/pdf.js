const windowHeight = parseInt($(window).height() * 0.73);
$('#pdf-panel').height(windowHeight);

$( window ).resize(function() {
  const windowHeight = parseInt($(window).height() * 0.73);
  $('#pdf-panel').height(windowHeight);
});
