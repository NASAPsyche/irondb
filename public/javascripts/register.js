/**
 * @description Returns an array of existing username
 * @return {Any} existing usernames
 */
let existing = [];
// eslint-disable-next-line require-jsdoc
function existingUsernames() {
  existing = [];
  $('li').each(function() {
    // eslint-disable-next-line no-invalid-this
    existing.push($(this).text().trim());
  });
  return existing;
}

/**
 *
 * @param {@} string
 * @return {Boolean}
 */
function alreadyExists(string) {
  const entries = existingUsernames();
  const result = entries.includes(string);
  return result;
}

$(document).ready(function() {
  console.log(existingUsernames());
  $('#username').keyup(function() {
    const username = $('#username').val();
    if (alreadyExists(username)) {
      console.log('ALREADY Exists');
    } else {
      console.log('DOES NOT EXIST');
    }
  });
});

/**
 * @description Validate password and enable save button
 */
function validatePassword() {
  $('#confirm').on('keyup', function() {
    const pwd = $('#password').val();
    const cnfm = $('#confirm').val();

    // eslint-disable-next-line max-len
    // validate passwords match and have at least 1 lowercase, 1 uppercase and 1 number
    if (pwd === cnfm) {
      if (pwd.length >= 8) {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);

        if (hasUpperCase && hasLowerCase && hasNumbers) {
          console.log('Password good');
        }
      }
    }
  });
}

$(document).ready(function() {
  validatePassword();
});

