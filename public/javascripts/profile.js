
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
  $('#updatepassword').on('change', function() {
    if ($('#updatepassword').is(':checked')) {
      $('#confirm-password').removeAttr('hidden');
      $('#confirm-password').removeAttr('readonly');
      $('#confirmLabel').removeAttr('hidden');
      $('#password').removeAttr('readonly');
      $('#password').attr('placeholder', '');
      $('#password').removeAttr('hidden');
      $('#passwordLabel').removeAttr('hidden');
    } else {
      $('#confirm-password').attr('hidden', true);
      $('#confirmLabel').attr('hidden', true);
      $('#password').attr('hidden', true);
      $('#passwordLabel').attr('hidden', true);
    }
  });
});

const data = {
  'first_name': '',
  'last_name': '',
  'username': '',
  'user_id': '',
  'email': '',
  'password': '',
};

$(document).ready(async function() {
  $('#user-update-form').submit(async function(event) {
    data.first_name = $('#firstname').val();
    data.last_name = $('#lastname').val();
    data.username = $('#username').val();
    data.email = $('#email').val();
    data.password = $('#password').val();
    data.user_id = parseInt($('#userID').val());
    alert(`sending the following ${JSON.stringify(data)}`);

    const jsonData = JSON.stringify(data);
    await postData(jsonData);
    window.location.reload();
  });
});

/**
 * Send data to server
 * @param {*} jsonString
 */
async function postData(jsonString) {
  await $.ajax({
    url: '/profile/update',
    type: 'POST',
    data: jsonString,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: true,
    success: function(data, status, jqXHR) {
      console.log();
      return true;
    },
    error: function(jqXHR, status) {
      return false;
    },
  });
}
