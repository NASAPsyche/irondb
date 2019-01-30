// modal autofocus fix
$('#uploadModal').on('shown.bs.modal', function() {
  $('#pdf').trigger('focus');
});
