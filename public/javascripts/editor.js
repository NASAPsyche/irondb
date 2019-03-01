// Some functions inline on template to avoid import issues.
// This file used on all editor templates
/* eslint-disable no-invalid-this */
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
/**      Save/Edit Events        */
/** ---------------------------- */

// Bacis section
$( '#insert-form' ).on( 'click', 'i.save-basic', function( event ) {
  // Disable all inputs in the basic information section.
  $(this).parent().siblings().slice(0, 3)
      .children().children('input').prop('readonly', true);

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $( 'i.edit-basic' ).prop('hidden', false);
});

$( '#insert-form' ).on( 'click', 'i.edit-basic', function( event ) {
  // Enable all inputs in the basic information section.
  $(this).parent().siblings().slice(0, 3)
      .children().children('input').prop('readonly', false);

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $( 'i.save-basic' ).prop('hidden', false);
});


// Author(s) Section
$( '#insert-form' ).on( 'click', 'i.save-author', function( event ) {
  // Disable inputs
  disableInline($(this));

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-author' ).prop('hidden', false);
});

$( '#insert-form' ).on( 'click', 'i.edit-author', function( event ) {
  // Enable inputs
  enableInline($(this));

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-author' ).prop('hidden', false);
});


// Meteorite Section
$( '#insert-form' ).on( 'click', 'i.save-meteorite', function( event ) {
  disableInline($(this));

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-meteorite' ).prop('hidden', false);
});

$( '#insert-form' ).on( 'click', 'i.edit-meteorite', function( event ) {
  enableInline($(this));

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-meteorite' ).prop('hidden', false);
});


// Measurement Section
$( '#insert-form' ).on( 'click', 'i.save-measurement', function( event ) {
  disableInline($(this));

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-measurement' ).prop('hidden', false);
});

$( '#insert-form' ).on( 'click', 'i.edit-measurement', function( event ) {
  enableInline($(this));

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-measurement' ).prop('hidden', false);
});


// Note Section
$( '#insert-form' ).on( 'click', 'i.save-note', function( event ) {
  // Disable textfield
  $(this).parent().parent().children('textarea').prop('disabled', true);

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-note' ).prop('hidden', false);
});

$( '#insert-form' ).on( 'click', 'i.edit-note', function( event ) {
  // Enable textfield
  $(this).parent().parent().children('textarea').prop('disabled', false);

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

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


/** ----------------------------------- */
/**        EJS Templates for Add        */
/** ----------------------------------- */


const authorTemplate = `
<div class="form-row">
<div class="col-md-1">
  <i class="far fa-times-circle fa-lg remove remove-inline pt-4 text-danger" 
  title="Press to remove author."></i></div>
<div class="form-group col-md-3">
  <label for="<%- primaryNameID %>">Last Name or Organization</label>
  <input type="text" class="form-control" id="<%- primaryNameID %>" 
  name="<%- primaryNameID %>" required="true" placeholder="required">
</div>
<div class="form-group col-md-3">
  <label for="<%- firstNameID %>">First Name</label>
  <input type="text" class="form-control" id="<%- firstNameID %>"
  name="<%- firstNameID %>">
</div>
<div class="form-group col-md-2">
  <label for="<%- middleNameID %>">Middle Name</label>
  <input type="text" class="form-control" id="<%- middleNameID %>"
  name="<%- middleNameID %>">
</div>
<div class="form-check col-md-2">
  <input class="form-check-input" type="checkbox" id="<%- singleEntityID %>"
  name="<%- singleEntityID %>">
  <label class="form-check-label" for="<%- singleEntityID %>">
  Organization</label>
</div>
<div class="form-group col-md-1  mt-4">
  <i class="fa fa-lock-open fa-lg save-author"></i>
  <i class="fa fa-lock fa-lg edit-author" hidden="true"></i>
</div>
</div>
`;

const noteTemplate = `
<div class="form-row mt-2">
  <label for="<%- noteID %>">Note:
    <i class="fa fa-lock-open fa-lg save-note"></i>
    <i class="fa fa-lock fa-lg edit-note" hidden="true"></i>
    <i class="far fa-times-circle fa-lg remove remove-note pl-5 text-danger" 
    title="Press to remove note."></i>
  </label>
  <textarea class="form-control" id="<%- noteID %>"
  name="<%- noteID %>" rows="5">
  </textarea>
</div>
`;

const measurementTemplate = `
<div class="form-row">
<div class="col-md-1">
<i class="far fa-times-circle fa-lg remove remove-inline pt-4 text-danger" 
title="Press to remove measurement."></i></div>
<div class="form-group col-md-1">
  <label for="<%- elementID %>">Element</label>
  <input type="text" class="form-control" id="<%- elementID %>" 
  name="<%- elementID %>" minlength="1" maxlength="3" required="true"> 
</div>
<div class="form-check-inline col-md-1">
  <input class="form-check-input" type="checkbox" id="<%- lessThanID %>"
  name="<%- lessThanID %>">
  <label class="form-check-label"  for="<%- lessThanID %>">&lt;</label>
</div>
<div class="form-group col-md-2">
  <label for="<%- measurementID %>">Measurement</label>
  <input type="text" class="form-control" id="<%- measurementID %>" 
  name="<%- measurementID %>" required="true" min="0">
</div>
<div class="form-group col-md-1">
  <label for="<%- deviationID %>">Deviation</label>
  <input type="number" class="form-control" id="<%- deviationID %>" 
  name="<%- deviationID %>" placeholder=" &plusmn;0">
</div>
<div class="form-group col-md-2">
  <label for="<%- unitsID %>">units</label>
  <select class="form-control" id="<%- unitsID %>" 
  name="<%- unitsID %>" required="true">
    <option>wt%</option>
    <option>ppm</option>
    <option>ppb</option>
    <option>mg/g</option>
    <option>&micro;g/g</option>
    <option>ng/g</option>
  </select>
</div>
<div class="form-group col-md-1">
  <label for="<%- techniqueID %>">Technique</label>
  <input type="text" class="form-control" id="<%- techniqueID %>"
  name="<%- techniqueID %>">
</div>
<div class="form-group col-md-1">
  <label for="<%- pageID %>">Page</label>
  <input type="number" class="form-control" id="<%- pageID %>" 
  name="<%- pageID %>" min="1" required>
</div>
<div class="form-group col-md-1 mt-4">
  <i class="fa fa-lock-open fa-lg save-measurement"></i>
  <i class="fa fa-lock fa-lg edit-measurement" hidden="true"></i>
</div>
</div>
`;


const meteoriteTemplate = `
<div class="form-row meteorite-header" id="<%- meteoriteID %>">
  <h5 class="pt-1 mr-2"><strong>Meteorite</strong></h5>
  <i class="fas fa-plus-circle fa-lg add-meteorite mt-2 text-danger"></i>
</div>
<div class="form-row">
<div class="col-md-1">
  <i class="far fa-times-circle fa-lg remove remove-meteorite pt-4 text-danger" 
  title="Press to remove meteorite and all associated measurements."></i>
</div>
<div class="form-group col-md-4">
  <label for="<%- bodyNameID %>">Name</label>
  <input type="text" class="form-control" id="<%- bodyNameID %>" 
  name="<%- bodyNameID %>" required>
</div>
<div class="form-group col-md-3">
  <label for="<%- groupID %>">Group</label>
  <input type="text" class="form-control" id="<%- groupID %>"
  name="<%- groupID %>" required>
</div>
<div class="form-group col-md-3">
  <label for="<%- classID %>">Class</label>
  <input type="text" class="form-control" id="<%- classID %>" 
  name="<%- classID %>">
</div>
<div class="form-group col-md-1 mt-4">
  <i class="fa fa-lock-open fa-lg save-meteorite"></i>
  <i class="fa fa-lock fa-lg edit-meteorite" hidden="true"></i>
</div>
</div>
<div class="form-row">
  <h5 class="pt-1 mr-2  pl-3">
  <strong>Measurements</strong></h5>
  <i class="fas fa-plus-circle fa-lg add-measurement mt-2 text-danger"></i>
</div>
` + measurementTemplate; // Add single measurement row to meteorite template


/** ---------------------------- */
/**        UI Add Events         */
/** ---------------------------- */

// Set Global ID counts
let primaryNameIDCount = 1;
let firstNameIDCount = 1;
let middleNameIDCount = 1;
let singleEntityIDCount = 1;

let noteIDCount = 1;

let elementIDCount = 1;
let lessThanIDCount = 1;
let measurementIDCount = 1;
let deviationIDCount = 1;
let unitsIDCount = 1;
let techniqueIDCount = 1;
let pageIDCount = 1;

let meteoriteIDCount = 1;
let bodyNameIDCount = 1;
let groupIDCount = 1;
let classIDCount = 1;

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

  // Hide remove ui
  $( 'i.remove' ).hide();
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
  $(this).parent().siblings('button:submit').before(html);

  // Hide remove ui
  $( 'i.remove' ).hide();
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
  const pageID = 'page' + meteoriteID + '-' + pageIDCount;

  // Assign IDs
  const idObj = {};
  idObj['elementID'] = elementID;
  idObj['lessThanID'] = lessThanID;
  idObj['measurementID'] = measurementID;
  idObj['deviationID'] = deviationID;
  idObj['unitsID'] = unitsID;
  idObj['techniqueID'] = techniqueID;
  idObj['pageID'] = pageID;

  // Increment current count
  elementIDCount++;
  lessThanIDCount++;
  measurementIDCount++;
  deviationIDCount++;
  unitsIDCount++;
  techniqueIDCount++;
  pageIDCount++;

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

  // Hide remove ui
  $( 'i.remove' ).hide();
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
  const pageID = 'page' + meteoriteIDCount + '-' + pageIDCount;

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
  idObj['pageID'] = pageID;

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
  pageIDCount++;

  // Render note template with current ID
  // eslint-disable-next-line
  const html = ejs.render(meteoriteTemplate, idObj);

  // Insert template into DOM
  $(this).parent().siblings('.notes-header').before(html);

  // Hide remove ui
  $( 'i.remove' ).hide();
});

/** ---------------------------- */
/**        UI Remove Events      */
/** ---------------------------- */

$( '#insert-form' ).on('click', 'i.remove-note', function() {
  if ( $(this).parent().parent().hasClass('not-removable') === false ) {
    $(this).parent().parent().remove();
  }
});

$( '#insert-form' ).on('click', 'i.remove-inline', function() {
  if ( $(this).parent().parent().hasClass('not-removable') === false ) {
    $(this).parent().parent().remove();
  }
});

$( '#insert-form' ).on('click', 'i.remove-meteorite', function() {
  if ( $(this).parent().parent().hasClass('not-removable') === true ) {
    // Do not remove if saved
  } else {
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

    // Remove header if not last meteorite header on form
    const id = 'meteorite' + meteoriteID;
    if ( 'meteorite' + meteoriteID !== 'meteorite0' ) {
      $( '#' + id ).remove();
    }

    // Remove row
    $(this).parent().parent().remove();
  }
});


/* Save the form data */


$(document).ready(function() {
  $('#save-btn').click(function() {
    const serializedData = $('#insert-form').serializeArray();
    const jsondata_ = {};
    serializedData.forEach(function(element) {
      jsondata_[element['name']] = element['value'];
    });
    // eslint-disable-next-line no-undef
    const username_ = username; // username defined in ejs from route
    // eslint-disable-next-line no-undef
    const filename_ = filename; // filename defined in ejs from route

    const jsonsend = {
      username: username_,
      data: jsondata_,
      pdf_path: filename_,
    };

    // Send a post request to save the data
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/data-entry/save', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(jsonsend));
    alert('Saved the form');
  });
});


$('#insert-form').submit(function(event) {
  let measurementsAreNumbers = true;
  // For each field 'measrement*', check that it parses to a number
  $('[id^="measure"]').each(function(idx) {
    if (isNaN(parseFloat($(this).val()))) {
      $(this).addClass('is-invalid');
      measurementsAreNumbers = false;
    } else {
      $(this).removeClass('is-invalid');
    }
  });

  // send if checks pass
  if (measurementsAreNumbers == true) {
    return;
  } else {
    event.preventDefault();
  }
});
