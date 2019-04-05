
$(document).ready(function() {
  $(':button').click(function() {
    $(':button').attr('hidden', 'true');
    $(':submit').removeAttr('hidden');
    $('#firstname').removeAttr('readonly');
    $('#lastname').removeAttr('readonly');
    $('#email').removeAttr('readonly');
    $('#passCheckBox').removeAttr('hidden');
    $('#save-btn').attr('disabled', false);
  });
});

$(document).ready(function() {
  $('#updatepassword').on('change', function() {
    if ($('#updatepassword').is(':checked')) {
      $('#confirm_password').removeAttr('hidden');
      $('#confirm_password').removeAttr('readonly');
      $('#confirmLabel').removeAttr('hidden');
      $('#password').removeAttr('readonly');
      $('#password').attr('placeholder', '');
      $('#password').removeAttr('hidden');
      $('#passwordLabel').removeAttr('hidden');
      $('#save-btn').attr('disabled', true);
    } else {
      $('#confirm_password').attr('hidden', true);
      $('#confirmLabel').attr('hidden', true);
      $('#password').attr('hidden', true);
      $('#passwordLabel').attr('hidden', true);
      $('#password').val('');
      $('#confirm_password').val('');
      $('#save-btn').attr('disabled', false);
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

/**
 * @description Validate password and enable save button
 */
function validatePassword() {
  $('#confirm_password').on('keyup', function() {
    const pwd = $('#password').val();
    const cnfm = $('#confirm_password').val();

    if (pwd === cnfm) {
      if (pwd.length >= 6) {
        $('#save-btn').attr('disabled', false);
      }
    }
  });
}

$(document).ready(function() {
  $('#confirm_password').keyup(function() {
    validatePassword();
  });
});

/**
 * @description submit information
 */
$(document).ready(async function() {
  $('#user-update-form').submit(async function(event) {
    event.preventDefault();
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
