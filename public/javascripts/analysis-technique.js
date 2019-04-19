let data = '';
let existing = [];

/**
 * @description Submission of form
 */
$(document).ready(function() {
  $('#submission').submit(async function() {
    event.preventDefault();
    const technique = $('#new-technique').val();
    // check if input is filled out
    if (technique) {
      if (!alreadyExists(technique)) {
        const confirm = window.confirm(`Add ${technique}`);
        $('#exists').attr('hidden', true);
        if (confirm) {
          $('.alert').attr('hidden', true);
          data = JSON.stringify({'technique': technique});
          await postData(data);
          window.location.reload();
        } else {
          $('#success').attr('hidden', false);
        }
      } else {
        $('#blank').attr('hidden', true);
        $('#exists').attr('hidden', false);
      }
    } else {
      console.log('null');
      $('#blank').attr('hidden', false);
    }
  });
});

/**
 * @description Determines if the entry is already in the
 * database or not
 * @return {Boolean} value if technique is already in db
 */
function existingEntries() {
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
  const entries = existingEntries();

  for (let i = 0; i < entries.length; i++) {
    entries[i] = entries[i].toLowerCase();
  }

  const result = entries.includes(string.toLowerCase());
  return result;
}

/**
 * Send data to server
 * @param {*} jsonString
 */
async function postData(jsonString) {
  await $.ajax({
    url: '/panel/analysis-technique',
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
