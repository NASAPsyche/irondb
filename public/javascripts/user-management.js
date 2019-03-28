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
    alert('button clicked. Nothing happens yet :(');
  });
});


