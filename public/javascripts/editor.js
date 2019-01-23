// Some functions inline on template to avoid import issues.
// This file used on all editor templates

/** ---------------------------- */
/**     Remove Hover Toggle      */
/** ---------------------------- */
$( 'document' ).ready(function() {
  // All remove icons hidden on load.
  $( 'i.remove' ).hide();
});

$( '#insert-form' ).on('mouseover', 'div.form-row', function( event ) {
  // Show remove ui on mouseover of parent div
  $(this).children().children( 'i.remove' ).show();
});

$( '#insert-form' ).on('mouseout', 'div.form-row', function( event ) {
  // Hide remove ui on mouseout of parent div
  $(this).children().children( 'i.remove' ).hide();
});


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


/** ---------------------------- */
/**        EJS Templates         */
/** ---------------------------- */


let authorTemplate = '';
authorTemplate += '<div class="form-row">';
authorTemplate += '<div class="form-group col-md-3">';
authorTemplate += '  <label for="<%- primaryNameID %>">';
authorTemplate += 'Last Name or Organization</label>';
authorTemplate += '<input type="text" class="form-control"';
authorTemplate += 'id="<%- primaryNameID %>"';
authorTemplate += 'required="true" placeholder="required">';
authorTemplate += '</div>';
authorTemplate += '<div class="form-group col-md-3">';
authorTemplate += '  <label for="<%- firstNameID %>">First Name</label>';
authorTemplate += '  <input type="text" class="form-control" ';
authorTemplate += 'id="<%- firstNameID %>">';
authorTemplate += '</div>';
authorTemplate += '<div class="form-group col-md-3">';
authorTemplate += '  <label for="<%- middleNameID %>">Middle Name</label>';
authorTemplate += '  <input type="text" class="form-control"';
authorTemplate += 'id="<%- middleNameID %>">';
authorTemplate += '</div>';
authorTemplate += '<div class="form-check col-md-2">';
authorTemplate += '  <input class="form-check-input" type="checkbox"';
authorTemplate += 'id="<%- singleEntityID %>">';
authorTemplate += '  <label class="form-check-label"';
authorTemplate += 'for="<%- singleEntityID %>">Organization</label>';
authorTemplate += '</div>';
authorTemplate += '<div class="form-group col-md-1  mt-4">';
authorTemplate += '<i class="far fa-save fa-2x save-author"></i>';
authorTemplate += '<i class="far fa-edit fa-2x edit-author" hidden="true"></i>';
authorTemplate += '</div></div>';


let noteTemplate = '';
noteTemplate += '<div class="form-row mt-2">';
noteTemplate += '<label for="<%- noteID %>">Note:';
noteTemplate += '<i class="far fa-save fa-lg save-note"></i>';
noteTemplate += '<i class="far fa-edit fa-lg edit-note" hidden="true"></i>';
noteTemplate += '</label>';
noteTemplate += '<textarea class="form-control" id="<%- noteID %>" rows="5">';
noteTemplate += '</textarea></div>';

let measurementTemplate = '';
measurementTemplate += '<div class="form-row">';
measurementTemplate += '<div class="form-group col-md-1 offset-1">';
measurementTemplate += '<label for="<%- elementID %>">Element</label>';
measurementTemplate += '<input type="text" class="form-control"';
measurementTemplate += 'id="<%- elementID %>"';
measurementTemplate += 'minlength="1" maxlength="3" required="true">';
measurementTemplate += '</div>';
measurementTemplate += '<div class="form-check-inline col-md-1">';
measurementTemplate += '<input class="form-check-input"';
measurementTemplate += 'type="checkbox" id="<%- lessThanID %>">';
measurementTemplate += '<label class="form-check-label" ';
measurementTemplate += 'for="<%- lessThanID %>">&lt;</label>';
measurementTemplate += '</div>';
measurementTemplate += '<div class="form-group col-md-2">';
measurementTemplate += '<label for="<%- measurementID %>">Measurement</label>';
measurementTemplate += '<input type="number" class="form-control"';
measurementTemplate += 'id="<%- measurementID %>" required="true">';
measurementTemplate += '</div>';
measurementTemplate += '<div class="form-group col-md-1">';
measurementTemplate += '<label for="<%- deviationID %>">Deviation</label>';
measurementTemplate += '<input type="number" class="form-control"';
measurementTemplate += 'id="<%- deviationID %>" placeholder=" &plusmn;0">';
measurementTemplate += '</div>';
measurementTemplate += '<div class="form-group col-md-2">';
measurementTemplate += '<label for="<%- unitsID %>">units</label>';
measurementTemplate += '<select class="form-control"';
measurementTemplate += 'id="<%- unitsID %>" required="true">';
measurementTemplate += '<option>wt%</option>';
measurementTemplate += '<option>ppm</option>';
measurementTemplate += '<option>ppb</option>';
measurementTemplate += '<option>mg/g</option>';
measurementTemplate += '<option>&micro;g/g</option>';
measurementTemplate += '<option>ng/g</option>';
measurementTemplate += '</select>';
measurementTemplate += '</div>';
measurementTemplate += '<div class="form-group col-md-2">';
measurementTemplate += '<label for="<%- techniqueID %>">Technique</label>';
measurementTemplate += '<input type="text" class="form-control"';
measurementTemplate += 'id="<%- techniqueID %>">';
measurementTemplate += '</div>';
measurementTemplate += '<div class="form-group col-md-1 mt-4">';
measurementTemplate += '<i class="far fa-save fa-2x save-measurement"></i>';
measurementTemplate += '<i class="far fa-edit fa-2x ';
measurementTemplate += 'edit-measurement" hidden="true"></i>';
measurementTemplate += '</div></div>';

let meteoriteTemplate = '';
meteoriteTemplate += '<div class="form-row meteorite-header"';
meteoriteTemplate += ' id="<%- meteoriteID %>">';
meteoriteTemplate += '<h5 class="pt-1 mr-2"><strong>Meteorite</strong></h5>';
// meteoriteTemplate += '<i class="fas fa-plus-circle fa-lg add-meteorite';
// meteoriteTemplate += ' mt-2 text-danger"></i>';
meteoriteTemplate += '</div><div class="form-row">';
meteoriteTemplate += '<div class="form-group col-md-4">';
meteoriteTemplate += '<label for="<%- bodyNameID %>">Name</label>';
meteoriteTemplate += '<input type="text" class="form-control"';
meteoriteTemplate += ' id="<%- bodyNameID %>" required="true">';
meteoriteTemplate += '</div><div class="form-group col-md-4">';
meteoriteTemplate += '<label for="<%- groupID %>">Group</label>';
meteoriteTemplate += '<input type="text" class="form-control"';
meteoriteTemplate += ' id="<%- groupID %>" required="true">';
meteoriteTemplate += '</div><div class="form-group col-md-3">';
meteoriteTemplate += '<label for="<%- classID %>">Class</label>';
meteoriteTemplate += '<input type="text" class="form-control" ';
meteoriteTemplate += 'id="<%- classID %>">';
meteoriteTemplate += '</div><div class="form-group col-md-1 mt-4">';
meteoriteTemplate += '<i class="far fa-save fa-2x save-meteorite"></i>';
meteoriteTemplate += '<i class="far fa-edit fa-2x edit-meteorite" ';
meteoriteTemplate += 'hidden="true"></i>';
meteoriteTemplate += '</div></div><div class="form-row">';
meteoriteTemplate += '<h5 class="pt-1 mr-2">';
meteoriteTemplate += '<strong>Measurements</strong></h5>';
meteoriteTemplate += '<i class="fas fa-plus-circle fa-lg ';
meteoriteTemplate += 'add-measurement mt-2 text-danger"></i></div>';
// Add single measurement row to meteorite template
meteoriteTemplate += measurementTemplate;

/** ---------------------------- */
/**        UI Add Events         */
/** ---------------------------- */

// Set Global ID counts
let primaryNameIDCount = 0;
let firstNameIDCount = 0;
let middleNameIDCount = 0;
let singleEntityIDCount = 0;

let noteIDCount = 0;

let elementIDCount = 0;
let lessThanIDCount = 0;
let measurementIDCount = 0;
let deviationIDCount = 0;
let unitsIDCount = 0;
let techniqueIDCount = 0;

let meteoriteIDCount = 1;
let bodyNameIDCount = 0;
let groupIDCount = 0;
let classIDCount = 0;

// Simple Add Event Handlers
$( '#insert-form' ).on('click', 'i.add-author', function( event ) {
  // Dynamically create IDs
  const primaryNameID = 'primaryName' + primaryNameIDCount;
  const firstNameID = 'firstName' + firstNameIDCount;
  const middleNameID = 'middleName' + middleNameIDCount;
  const singleEntityID = 'singleEntity' + singleEntityIDCount;

  // Assign IDs
  const idObj = {};
  idObj['primaryNameID'] = primaryNameID;
  idObj['firstNameID'] = firstNameID;
  idObj['middleNameID'] = middleNameID;
  idObj['singleEntityID'] = singleEntityID;

  // Increment current counts
  primaryNameIDCount++;
  firstNameIDCount++;
  middleNameIDCount++;
  singleEntityIDCount++;

  // Render Author template with current IDs
  // eslint-disable-next-line
  const html = ejs.render(authorTemplate, idObj);

  // Insert template into DOM
  $(this).parent().siblings('.meteorite-header').before(html);

  // Attach Event Handlers
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
});


$( '#insert-form' ).on('click', 'i.add-note', function( event ) {
  // Dynamically create IDs
  const noteID = 'note' + noteIDCount;

  // Assign IDs
  const idObj = {noteID: noteID};

  // Increment current count
  noteIDCount++;

  // Render note template with current ID
  // eslint-disable-next-line
  const html = ejs.render(noteTemplate, idObj);

  // Insert template into DOM
  $(this).parent().siblings('button').before(html);

  // Attach Event Handlers
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
});


$( '#insert-form' ).on('click', 'i.add-measurement', function( event ) {
  // Get parent meteorite
  const meteoriteID = $(this).parent()
      .prevAll( 'div.meteorite-header' ).first().attr('id').slice(9);

  // Dynamically create IDs
  const elementID = 'element' + meteoriteID + '-' + elementIDCount;
  const lessThanID = 'lessThan' + meteoriteID + '-' + lessThanIDCount;
  const measurementID = 'measurement' + meteoriteID + '-' + measurementIDCount;
  const deviationID = 'deviation' + meteoriteID + '-' + deviationIDCount;
  const unitsID = 'units' + meteoriteID + '-' + unitsIDCount;
  const techniqueID = 'technique' + meteoriteID + '-' + techniqueIDCount;

  // Assign IDs
  const idObj = {};
  idObj['elementID'] = elementID;
  idObj['lessThanID'] = lessThanID;
  idObj['measurementID'] = measurementID;
  idObj['deviationID'] = deviationID;
  idObj['unitsID'] = unitsID;
  idObj['techniqueID'] = techniqueID;

  // Increment current count
  elementIDCount++;
  lessThanIDCount++;
  measurementIDCount++;
  deviationIDCount++;
  unitsIDCount++;
  techniqueIDCount++;

  // Render note template with current ID
  // eslint-disable-next-line
  const html = ejs.render(measurementTemplate, idObj);

  // Insert template into DOM
  const nextID = 'meteorite' + (1 + Number(meteoriteID));
  if ( $( '#' + nextID ).length ) {
    $( '#' + nextID ).before(html);
  } else {
    $(this).parent().siblings('.notes-header')
        .first().before(html);
  }

  // Attach Event Handlers
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
});

$( '#insert-form' ).on('click', 'i.add-meteorite', function( event ) {
  // Dynamically create IDs
  const meteoriteID = 'meteorite' + meteoriteIDCount;
  const bodyNameID = 'bodyName' + bodyNameIDCount;
  const groupID = 'group' + groupIDCount;
  const classID = 'class' + classIDCount;
  const elementID = 'element' + meteoriteIDCount + '-' + elementIDCount;
  const lessThanID = 'lessThan' + meteoriteIDCount + '-' + lessThanIDCount;
  // eslint-disable-next-line
  const measurementID = 'measurement' + meteoriteIDCount + '-' + measurementIDCount;
  const deviationID = 'deviation' + meteoriteIDCount + '-' + deviationIDCount;
  const unitsID = 'units' + meteoriteIDCount + '-' + unitsIDCount;
  const techniqueID = 'technique' + meteoriteIDCount + '-' + techniqueIDCount;

  // Assign IDs
  const idObj = {};
  idObj['meteoriteID'] = meteoriteID;
  idObj['bodyNameID'] = bodyNameID;
  idObj['groupID'] = groupID;
  idObj['classID'] = classID;
  idObj['elementID'] = elementID;
  idObj['lessThanID'] = lessThanID;
  idObj['measurementID'] = measurementID;
  idObj['deviationID'] = deviationID;
  idObj['unitsID'] = unitsID;
  idObj['techniqueID'] = techniqueID;

  // Increment current count
  meteoriteIDCount++;
  bodyNameIDCount++;
  groupIDCount++;
  classIDCount++;
  elementIDCount++;
  lessThanIDCount++;
  measurementIDCount++;
  deviationIDCount++;
  unitsIDCount++;
  techniqueIDCount++;

  // Render note template with current ID
  // eslint-disable-next-line
  const html = ejs.render(meteoriteTemplate, idObj);

  // Insert template into DOM
  $(this).parent().siblings('.notes-header').before(html);

  // Attach Event Handler
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

  // Attach Event Handlers
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
});

/** ---------------------------- */
/**        UI Remove Events      */
/** ---------------------------- */

$( '#insert-form' ).on('click', 'i.remove-note', function() {
  $(this).parent().parent().remove();
});

$( '#insert-form' ).on('click', 'i.remove-inline', function() {
  $(this).parent().parent().remove();
});

$( '#insert-form' ).on('click', 'i.remove-meteorite', function() {
  // Get parent meteorite
  const meteoriteID = $(this).parent().parent()
      .prevAll( 'div.meteorite-header' ).first().attr('id').slice(9);

  // Remove associated elements
  const nextID = 'meteorite' + (1 + Number(meteoriteID));
  if ( $( '#' + nextID ).length ) {
    $(this).parent().parent().nextUntil( '#' + nextID ).remove();
  } else {
    $(this).parent().parent().nextUntil( 'div.notes-header' ).remove();
  }

  // Remove row
  $(this).parent().parent().remove();
});
