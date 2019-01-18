// Some functions inline on template to avoid import issues.
// This file used on all editor templates

/** ---------------------------- */
/**    Insert View Functions     */
/** ---------------------------- */

// Bacis section
$( 'i.save-basic' ).on( 'click', function( event ) {
  // Disable all inputs in the basic information section.
  $(this).parent().siblings().slice(0, 3)
      .children().children('input').prop('readonly', true);

  // Toggle UI
  $(this).prop('hidden', true);
  $( 'i.edit-basic' ).prop('hidden', false);
});

$( 'i.edit-basic' ).on( 'click', function( event ) {
  // Enable all inputs in the basic information section.
  $(this).parent().siblings().slice(0, 3)
      .children().children('input').prop('readonly', false);

  // Toggle UI
  $(this).prop('hidden', true);
  $( 'i.save-basic' ).prop('hidden', false);
});


// Author(s) Section
$( 'i.save-author' ).on( 'click', function( event ) {
  // Disable inputs
  disableInline($(this));

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-author' ).prop('hidden', false);
});

$( 'i.edit-author' ).on( 'click', function( event ) {
  // Enable inputs
  enableInline($(this));

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-author' ).prop('hidden', false);
});


// Meteorite Section
$( 'i.save-meteorite' ).on( 'click', function( event ) {
  disableInline($(this));

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-meteorite' ).prop('hidden', false);
});

$( 'i.edit-meteorite' ).on( 'click', function( event ) {
  enableInline($(this));

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-meteorite' ).prop('hidden', false);
});


// Measurement Section
$( 'i.save-measurement' ).on( 'click', function( event ) {
  disableInline($(this));

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-measurement' ).prop('hidden', false);
});

$( 'i.edit-measurement' ).on( 'click', function( event ) {
  enableInline($(this));

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-measurement' ).prop('hidden', false);
});


// Note Section
$( 'i.save-note' ).on( 'click', function( event ) {
  // Disable textfield
  $(this).parent().parent().children('textarea').prop('disabled', true);

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-note' ).prop('hidden', false);
});

$( 'i.edit-note' ).on( 'click', function( event ) {
  // Enable textfield
  $(this).parent().parent().children('textarea').prop('disabled', false);

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-note' ).prop('hidden', false);
});

/** ---------------------------- */
/**    Functions Declarations    */
/** ---------------------------- */

/**
 * @function disableInline
 * @param {Object} element - The clicked element
 * @description Function disables form controls associated with ui.
 */
function disableInline(element) {
  // Disable all inputs associated with element
  element.parent().siblings().children('input').prop('readonly', true);

  // Disable checkboxs associated with element
  element.parent().siblings().children('select').prop('disabled', true);

  // Disable select groups associated with element
  element.parent().siblings().children('input[type=checkbox]')
      .prop('disabled', true);
}


/**
 * @function EnableInline
 * @param {Object} element - The clicked element
 * @description Function Enables form controls associated with ui.
 */
function enableInline(element) {
  // Enable all inputs associated with element
  element.parent().siblings().children('input').prop('readonly', false);

  // Enable checkboxs associated with element
  element.parent().siblings().children('select').prop('disabled', false);

  // Enable select groups associated with element
  element.parent().siblings().children('input[type=checkbox]')
      .prop('disabled', false);
}