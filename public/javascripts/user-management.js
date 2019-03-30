/* eslint-disable no-invalid-this */

/**
 * @description search functionality
 */
$(document).ready(function() {
  $('#search').on('keyup', function() {
    const value = $(this).val().toLowerCase();
    $('#tbl tr').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

/**
 * @description button clicked
 */
$(document).ready(function() {
  $('#confirm').on('click', function() {
    let str = 'Making the following changes: \n';
    for (let i = 0; i < data.length; i++) {
      // eslint-disable-next-line max-len
      str += `user ${data[i].user} from ${data[i].current} to ${data[i].role} \n`;
    }
    alert(str);
    postData(data);
    location.reload();
  });
});


const data = [];

/**
 * @description get the ID of the user and new role for any changed dropdowns.
 * Display alert if new role is not equal to previous role and add to data that
 * will be sent to server.
 */
$(document).ready(function() {
  $('td').change(function() {
    const userID = $(this).closest('tr').find('td:first').text().trim();
    // eslint-disable-next-line max-len
    const newRole = $(this).closest('tr').find('#user-role :selected').text().trim();
    // eslint-disable-next-line max-len
    const currentRole = $(this).closest('tr').find('#current-role').text().trim();
    console.log(userID);
    console.log(newRole);

    if (currentRole != newRole) {
      data.push({'user': userID, 'current': currentRole, 'role': newRole});
    }
  });
});

/**
 * Send stuff
 * @param {*} jsonString
 */
async function postData(jsonString) {
  await $.ajax({
    url: '/users/update',
    type: 'POST',
    data: JSON.stringify(jsonString),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: true,
    success: function(data, status, jqXHR) {
      alert(status);
      return true;
    },
    error: function(jqXHR, status) {
      return false;
    },
  });
}

