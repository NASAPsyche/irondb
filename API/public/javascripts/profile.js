/**
 * Hides the update button and shows the save button
 * which is the submit for the form. Remove readonly from
 * editable fields
 */
$(document).ready(function() {
  $(':button').click(function() {
    $(':button').attr('hidden', 'true');
    $(':submit').removeAttr('hidden');
    $('#firstname').removeAttr('readonly');
    $('#lastname').removeAttr('readonly');
    $(':checkbox:checked').prop('checked', false);
    $('#passCheckBox').removeAttr('hidden');
    $('#save-btn').attr('disabled', false);
  });
});

/**
 * Update fields when "Update Password?" checkbox is
 * selected and deselected.
 */
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
      $('#password').attr('hidden', false);
      $('#passwordLabel').attr('hidden', true);
      $('#password').val('************');
      $('#password').attr('readonly', true);
      $('#confirm_password').val('');
      $('#save-btn').attr('disabled', false);
    }
  });
});

/**
 * data object to be sent to server
 */
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
      if (pwd.length >= 8) {
        $('.passwordError').hide();
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);

        if (!hasUpperCase) {
          $('.passwordError').text('Password must contain at least 1 upper case character!');
          $('.passwordError').show();
        }

        if (!hasLowerCase) {
          $('.passwordError').text('Password must contain at least 1 lower case character!');
          $('.passwordError').show();
        }

        if (!hasNumbers) {
          $('.passwordError').text('Password must contain at least 1 number!');
          $('.passwordError').show();
        }

        if (hasUpperCase && hasLowerCase && hasNumbers) {
          $('.passwordError').hide();
          $('#save-btn').attr('disabled', false);
        }
      } else {
        // Password is too short!
        $('.passwordError').text('Password must be at least 8 characters!');
        $('.passwordError').show();
      }
    } else {
      // Password don't match!
      $('.passwordError').text('Password do not match!');
      $('.passwordError').show();
    }
  });
}

/**
 * @description check for matching passwords on keyup for password inputs
 */
$(document).ready(function() {
  $(':password').keyup(function() {
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
    const jsonData = JSON.stringify(data);
    try {
      await postData(jsonData);
      // Reset "update password?" state
      $('#updatepassword').prop('checked', false);
      $('#updatepassword').trigger('change');
    } catch (err) {
      alert(err);
      console.log(err);
    }
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
      $('.passwordSuccess').text('Password updated!');
      $('.passwordSuccess').show();
      return true;
    },
    error: function(jqXHR, status) {
      return false;
    },
  });
}
