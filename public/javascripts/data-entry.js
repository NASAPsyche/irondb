/* eslint-disable no-invalid-this */
$( 'document' ).ready(function() {
  // Set tool as default selected
  styleButtons($( '#tool' ));
  setForm('tool');
});

$( '#tool' ).on( 'click', function() {
  styleButtons($(this));
  setForm($(this).attr('id'));
});

$( '#editor' ).on( 'click', function() {
  styleButtons($(this));
  setForm($(this).attr('id'));
});


/**
 * @function styleButtons
 * @param {Object} element - The clicked element
 * @description Function styles both buttons according to selection.
 */
function styleButtons(element) {
  // set other element id
  const otherElement = element.attr('id') === 'tool' ? '#editor' : '#tool';

  // style elements
  // toggle primary
  element.removeClass('bg-secondary').addClass('bg-primary');

  // active
  element.addClass('active');

  // toggle primary
  $( otherElement ).removeClass('bg-primary').addClass('bg-secondary');

  // active
  $( otherElement ).removeClass('active');
}

/**
 * @function setForm
 * @param {string} id - The clicked element's id string
 * @description Function sets hidden form elements according to selection.
 */
function setForm(id) {
  // set values
  if (id === 'tool') {
    $('#tool_select').attr('value', 'true');
    $('#editor_select').attr('value', 'false');
  } else {
    $('#tool_select').attr('value', 'false');
    $('#editor_select').attr('value', 'true');
  }
}
