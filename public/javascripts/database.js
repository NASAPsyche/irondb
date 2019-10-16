/* eslint-disable no-invalid-this */
// Send ajax request with params
$( '#search-form' ).on( 'submit', function( event ) {
  event.preventDefault();
  $.post('/database', $( this ).serialize(), function( data ) {
    // Remove old table and replace with results
    $( '#results' ).replaceWith( data );
  });
});

// On error, no results found
$( document ).ajaxError( function() {
  $( '#results' ).replaceWith( '<p>Error: No results found.</p>' );
  $('#results').css('margin-top',
      $('#search-panel').outerHeight() + $('nav').outerHeight());
});

// On click, clear form elements
$( '#reset-btn' ).on( 'click', function( event ) {
  $('#search-form').get(0).reset();
});

// After AJAx, reset stored ids of export button
$( document ).ajaxComplete(function() {
  $( '#entry-ids' ).empty();
  $( 'p:hidden' ).each(function() {
    $( '<input>' ).attr({type: 'hidden', name: 'entries'})
        .val( $(this).text() )
        .appendTo( $( '#entry-ids' ) );
  });
});

// Form elements:
$( 'document' ).ready(function() {
  // hide hide ui
  $( 'i.hide-journal').prop('hidden', true);
});

$( '#search-panel' ).on( 'click', 'i.show-journal', function( event ) {
  $(this).siblings('div.journal').prop('hidden', false);
  $(this).siblings('div.journal').children('div.form-group')
      .children('input').prop('disabled', false);
  $(this).prop('hidden', true);
  $(this).siblings('i.hide-journal').prop('hidden', false);
});

$( '#search-panel' ).on( 'click', 'i.hide-journal', function( event ) {
  $(this).siblings('div.journal').prop('hidden', true);
  $(this).siblings('div.journal').children('div.form-group')
      .children('input').prop('disabled', true);
  $(this).prop('hidden', true);
  $(this).siblings('i.show-journal').prop('hidden', false);
});

$( '#search-panel' ).on( 'click', 'i.show-year', function( event ) {
  $(this).siblings('div.year')
      .children('div.toggleable-offset').removeClass('offset-md-4');
  $(this).siblings('div.year').children('div.year').prop('hidden', false);
  $(this).siblings('div.year').children('div.year')
      .children('input').prop('disabled', false);
  $(this).siblings('div.year').children('div.year')
      .children('select').prop('disabled', false);
  $(this).prop('hidden', true);
  $(this).siblings('i.hide-year').prop('hidden', false);
});

$( '#search-panel' ).on( 'click', 'i.hide-year', function( event ) {
  $(this).siblings('div.year')
      .children('div.toggleable-offset').addClass('offset-md-4');
  $(this).siblings('div.year').children('div.year').prop('hidden', true);
  $(this).siblings('div.year').children('div.year')
      .children('input').prop('disabled', true);
  $(this).siblings('div.year').children('div.year')
      .children('select').prop('disabled', true);
  $(this).prop('hidden', true);
  $(this).siblings('i.show-year').prop('hidden', false);
});

$( '#search-panel' ).on( 'click', 'i.show-element', function( event ) {
  const elementVisibilityArray = getElementVisibilityArray();
  const targetNum = elementVisibilityArray.indexOf(true);
  if (targetNum === 0) {
    $('#composition' + targetNum)
        .children('.hide-target').prop('hidden', false);
    $('#composition' + targetNum)
        .children('.hide-target').children('select').prop('disabled', false);
  } else {
    $('#composition' + targetNum).prop('hidden', false);
    $('#composition' + targetNum)
        .children('div.form-group').children('select').prop('disabled', false);
  }
});

$( '#search-panel' ).on( 'click', 'i.hide-element', function( event ) {
  const elementVisibilityArray = getElementVisibilityArray();
  const targetNum = elementVisibilityArray.lastIndexOf(false);
  if (targetNum === 0) {
    $('#composition' + targetNum).children('.hide-target').prop('hidden', true);
    $('#composition' + targetNum)
        .children('.hide-target').children('select').prop('disabled', true);
  } else {
    $('#composition' + targetNum).prop('hidden', true);
    $('#composition' + targetNum)
        .children('div.form-group').children('select').prop('disabled', true);
  }
});

$( '#search-panel' ).on( 'click', 'i', function( event ) {
  $('#results').css('margin-top',
      $('#search-panel').outerHeight() + $('nav').outerHeight());
});

/**
 * @function getElementVisibilityArray
 * @description Function returns array visibility array of composition divs.
 * @return {object} visibilityArray
 */
function getElementVisibilityArray() {
  const visibilityArray = [];
  visibilityArray.push( $('#composition0')
      .children('div.hide-target').first().prop('hidden') );
  visibilityArray.push( $('#composition1').prop('hidden') );
  visibilityArray.push( $('#composition2').prop('hidden') );
  return visibilityArray;
}

