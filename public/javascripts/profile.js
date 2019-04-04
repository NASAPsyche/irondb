
$(document).ready(function() {
  $(':button').click(function() {
    $(':button').attr('hidden', 'true');
    $(':submit').removeAttr('hidden');
    $('#firstname').removeAttr('readonly');
    $('#lastname').removeAttr('readonly');
    $('#email').removeAttr('readonly');
    $('#passCheckBox').removeAttr('hidden');
  });
});

$(document).ready(function() {
  $('#updatepassword').change(function() {
    if ($('#updatepassword').prop('checked', true)) {
      $('#confirm-password').removeAttr('hidden');
      $('#confirm-password').removeAttr('readonly');
      $('#confirmLabel').removeAttr('hidden');
      $('#password').removeAttr('readonly');
      $('#password').attr('placeholder', '');
    }
  });
});
