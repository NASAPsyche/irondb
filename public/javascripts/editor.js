// Some functions inline on template to avoid import issues.
// This file used on all editor templates

// Insert Form Functions

// On click, clear form elements
$( 'i.save-basic' ).on( 'click', function( event ) {
  // Disable all inputs in the basic information section.
  $(this).parent().siblings().slice(0, 3)
      .children().children('input').prop('readonly', true);
});

$( 'i.save-author' ).on( 'click', function( event ) {
  // Disable all inputs for the selected author, diable checkbox
  $(this).parent().siblings().children('input').prop('readonly', true);
  $(this).parent().siblings().children('input[type=checkbox]')
      .prop('disabled', true);
});

$( 'i.save-meteorite' ).on( 'click', function( event ) {
  // Disable all inputs for the selected author, diable checkbox
  $(this).parent().siblings().children('input').prop('readonly', true);
});

$( 'i.save-measurement' ).on( 'click', function( event ) {
  // Disable all inputs for the selected author
  $(this).parent().siblings().children('input').prop('readonly', true);

  // Disable checkbox and select group
  $(this).parent().siblings().children('select').prop('disabled', true);
  $(this).parent().siblings().children('input[type=checkbox]')
      .prop('disabled', true); 
});

$( 'i.save-note' ).on( 'click', function( event ) {
  $(this).parent().parent().children('textarea').prop('disabled', true);
});
