// Some functions inline on template to avoid import issues.
// This file used on all editor templates
/* eslint-disable no-invalid-this */
/** ----------------------------- */
/**         Tool Specific         */
/** ----------------------------- */

// Render pdf
$('document').ready(function() {
  const fp = $( '#filepath' ).attr('value');
  const panel = $( '#pdf-panel' );
  // eslint-disable-next-line
  PDFObject.embed(fp, panel);
});

// Submit checklist and replace with ui
$( '#checklist-form' ).on( 'submit', function( event ) {
  event.preventDefault();
  // eslint-disable-next-line no-invalid-this
  $.post('/data-entry/tool/', $(this).serialize(), function( data ) {
    // Remove checklist and replace with ui panel
    $('#secondary-panel').replaceWith( data );
    $( 'i.remove' ).hide();
  });
});

// Table button ajax post
$( '#event-div' ).on('submit', '#single-page-form', function( event ) {
  event.preventDefault();
  // eslint-disable-next-line no-invalid-this
  $.post('/data-entry/tool/tables', $(this).serialize(), function( data ) {
    $('#table-target').append(data);
    $('#tableModal').modal('hide');
  });
});

$( '#event-div' ).on('click', 'button.table-validate', function() {
  // Serialize table
  const rows = $(this).parent().siblings('table').children('tbody').children();
  const tableData = serializeTable(rows);

  // console.log('~~~~~~~ Table Data ~~~~~~~~');
  // console.log(JSON.stringify(tableData));

  const postData = {
    'tableData': JSON.stringify(tableData),
  };

  // Call Post Request for validation with table data
  $.post('/data-entry/tool/validate', postData, function( data ) {
    console.log(data);
  });
});

$( '#event-div' ).on('click', 'button.table-edit', function() {
  console.log('clicked edit');
});

/**
 * @param  {object} rows JQuery collection of rows
 * @return {json} json serialization of table
 */
function serializeTable(rows) {
  // Serialize table
  const tableData = {};
  $.each( rows, function(rowIndex, value) {
    $.each( $(this).children(), function(columnIndex, value) {
      if (tableData.hasOwnProperty(columnIndex.toString()) === false) {
        tableData[columnIndex] = {};
      }

      // Set cell equal to it's value or null if empty
      tableData[columnIndex][rowIndex] = $(value)
          .children('input').attr('value') === '' ? null : $(value)
              .children('input').val();
    });
  });
  return tableData;
}


/** ---------------------------- */
/**     Remove Hover Toggle      */
/** ---------------------------- */
$( '#event-div' ).on('mouseover', 'div.form-row', function( event ) {
// Show remove ui on mouseover of parent div
  $(this).children().children( 'i.remove' ).show();
});

$( '#event-div' ).on('mouseout', 'div.form-row', function( event ) {
// Hide remove ui on mouseout of parent div
  $(this).children().children( 'i.remove' ).hide();
});


/** ---------------------------- */
/**      Save/Edit Events        */
/** ---------------------------- */

// Bacis section
$( '#event-div' ).on( 'click', 'i.save-basic', function( event ) {
// Disable all inputs in the basic information section.
  $(this).parent().siblings().slice(0, 3)
      .children().children('input').prop('readonly', true);

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $( 'i.edit-basic' ).prop('hidden', false);
});

$( '#event-div' ).on( 'click', 'i.edit-basic', function( event ) {
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
$( '#event-div' ).on( 'click', 'i.save-author', function( event ) {
// Disable inputs
  disableInline($(this));

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-author' ).prop('hidden', false);
});

$( '#event-div' ).on( 'click', 'i.edit-author', function( event ) {
// Enable inputs
  enableInline($(this));

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-author' ).prop('hidden', false);
});


// Meteorite Section
$( '#event-div' ).on( 'click', 'i.save-meteorite', function( event ) {
  disableInline($(this));

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-meteorite' ).prop('hidden', false);
});

$( '#event-div' ).on( 'click', 'i.edit-meteorite', function( event ) {
  enableInline($(this));

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-meteorite' ).prop('hidden', false);
});


// Measurement Section
$( '#event-div' ).on( 'click', 'i.save-measurement', function( event ) {
  disableInline($(this));

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-measurement' ).prop('hidden', false);
});

$( '#event-div' ).on( 'click', 'i.edit-measurement', function( event ) {
  enableInline($(this));

  // Remove not-removable class
  $(this).parent().parent().removeClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.save-measurement' ).prop('hidden', false);
});


// Note Section
$( '#event-div' ).on( 'click', 'i.save-note', function( event ) {
// Disable textfield
  $(this).parent().parent().children('textarea').prop('disabled', true);

  // Give not-removable class
  $(this).parent().parent().addClass('not-removable');

  // Toggle UI
  $(this).prop('hidden', true);
  $(this).siblings().closest( 'i.edit-note' ).prop('hidden', false);
});

$( '#event-div' ).on( 'click', 'i.edit-note', function( event ) {
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

/**
 * @param  {string} num The number that you need
 * the number of significant figures of
 * @return {number}
 * @description Takes a string and if it parses to a number then it returns the
 * number of significant figures, else it returns undefined
 */
function getSigFig(num) {
  if (typeof num != 'string') return; // invalid
  if (isNaN(parseFloat(num))) return; // invalid
  if ((parseFloat(num)) == 0) return 0;
  const splitStr = num.split('.');
  // remove non numeric characters
  splitStr.forEach((value, i) =>{
    splitStr[i] = value.replace(/\D/g, '');
  });

  return (
    (typeof splitStr[1] == 'undefined') // if no decimals
    ? splitStr[0].length
    : splitStr[0].length + splitStr[1].length
  );
}


/** ----------------------------------- */
/**        EJS Templates for Add        */
/** ----------------------------------- */

/* eslint-disable max-len*/
const authorTemplate = `
<div class="form-row">
<div class="col-md-1">
  <i class="far fa-times-circle fa-lg remove remove-inline pt-4 text-danger" 
  title="Press to remove author."></i></div>
<div class="form-group col-md-4">
  <label for="<%- primaryNameID %>">Last Name</label>
  <input type="text" class="form-control" id="<%- primaryNameID %>" 
  name="<%- primaryNameID %>" required="true" placeholder="required">
</div>
<div class="form-group col-md-4">
  <label for="<%- firstNameID %>">First Name</label>
  <input type="text" class="form-control" id="<%- firstNameID %>"
  name="<%- firstNameID %>">
</div>
<div class="form-group col-md-3">
  <label for="<%- middleNameID %>">Middle Name</label>
  <input type="text" class="form-control" id="<%- middleNameID %>"
  name="<%- middleNameID %>">
</div>
</div>
`;

const noteTemplate = `
<div class="form-row mt-2">
  <label for="<%- noteID %>">Note:
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
<div class="form-group col-md-1 mr-3">
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
  <label for="<%- deviationID %>">(&plusmn;)</label>
  <input type="number" class="form-control" id="<%- deviationID %>" 
  name="<%- deviationID %>" value="0" min="0">
</div>
<div class="form-group col-md-2">
  <label for="<%- unitsID %>">units</label>
  <select class="form-control" id="<%- unitsID %>" 
  name="<%- unitsID %>" required="true">
  <option value="wt_percent">wt%</option>
  <option value="ppm">ppm</option>
  <option value="ppb">ppb</option>
  <option value="mg_g">mg/g</option>
  <option value="ug_g">&micro;g/g</option>
  <option value="ng_g">ng/g</option>
  </select>
</div>
<div class="form-group col-md-2">
  <label for="<%- techniqueID %>">Technique</label>
  <input type="text" class="form-control" id="<%- techniqueID %>"
  name="<%- techniqueID %>">
</div>
<div class="form-group col-md-1">
  <label for="<%- pageID %>">Page</label>
  <input type="number" class="form-control p-1" id="<%- pageID %>" 
  name="<%- pageID %>" min="1" required>
</div>
<div class="form-group">
  <input type="hidden" id="<%- sigfigID %>" name="<%- sigfigID %>" value="0">
  <input type="hidden" id="<%- convertedMeasurementID %>" name="<%- convertedMeasurementID %>" value="0">
  <input type="hidden" id="<%- convertedDeviationID %>" name="<%- convertedDeviationID %>" value="0">
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
<div class="form-group col-md-6">
  <label for="<%- bodyNameID %>">Name</label>
  <input type="text" class="form-control" id="<%- bodyNameID %>" 
  name="<%- bodyNameID %>" required>
</div>
<div class="form-group col-md-4">
  <label for="<%- groupID %>">Group</label>
  <input type="text" class="form-control" id="<%- groupID %>"
  name="<%- groupID %>" required>
</div>
</div>
<div class="form-row">
  <h5 class="pt-1 mr-2 pl-3">
  <strong>Measurements</strong></h5>
  <i class="fas fa-plus-circle fa-lg add-measurement mt-2 text-danger"></i>
</div>
` + measurementTemplate; // Add single measurement row to meteorite template

/* eslint-enable max-len*/

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
let sigfigIDCount = 1;
let convertedMeasurementIDCount = 1;
let convertedDeviationIDCount = 1;

let meteoriteIDCount = 1;
let bodyNameIDCount = 1;
let groupIDCount = 1;
let classIDCount = 1;

// Simple Add Event Handlers
$( '#event-div' ).on('click', 'i.add-author', function( event ) {
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


$( '#event-div' ).on('click', 'i.add-note', function( event ) {
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


$( '#event-div' ).on('click', 'i.add-measurement', function( event ) {
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
  const sigfigID = 'sigfig' + meteoriteID + '-' + sigfigIDCount;
  const convertedMeasurementID =
    'convertedMeasurement' + meteoriteID + '-' + convertedMeasurementIDCount;
  const convertedDeviationID =
    'convertedDeviation' + meteoriteID + '-' + convertedDeviationIDCount;

  // Assign IDs
  const idObj = {};
  idObj['elementID'] = elementID;
  idObj['lessThanID'] = lessThanID;
  idObj['measurementID'] = measurementID;
  idObj['deviationID'] = deviationID;
  idObj['unitsID'] = unitsID;
  idObj['techniqueID'] = techniqueID;
  idObj['pageID'] = pageID;
  idObj['sigfigID'] = sigfigID;
  idObj['convertedMeasurementID'] = convertedMeasurementID;
  idObj['convertedDeviationID'] = convertedDeviationID;


  // Increment current count
  elementIDCount++;
  lessThanIDCount++;
  measurementIDCount++;
  deviationIDCount++;
  unitsIDCount++;
  techniqueIDCount++;
  pageIDCount++;
  sigfigIDCount++;
  convertedMeasurementIDCount++;
  convertedDeviationIDCount++;

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

$( '#event-div' ).on('click', 'i.add-meteorite', function( event ) {
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
  const sigfigID = 'sigfig' + meteoriteID + '-' + sigfigIDCount;
  const convertedMeasurementID =
    'convertedMeasurement' + meteoriteID + '-' + convertedMeasurementIDCount;
  const convertedDeviationID =
    'convertedDeviation' + meteoriteID + '-' + convertedDeviationIDCount;


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
  idObj['sigfigID'] = sigfigID;
  idObj['convertedMeasurementID'] = convertedMeasurementID;
  idObj['convertedDeviationID'] = convertedDeviationID;

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
  sigfigIDCount++;
  convertedMeasurementIDCount++;
  convertedDeviationIDCount++;

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

$( '#event-div' ).on('click', 'i.remove-note', function() {
  if ( $(this).parent().parent().hasClass('not-removable') === false ) {
    $(this).parent().parent().remove();
  }
});

$( '#event-div' ).on('click', 'i.remove-inline', function() {
  if ( $(this).parent().parent().hasClass('not-removable') === false ) {
    $(this).parent().parent().remove();
  }
});

$( '#event-div' ).on('click', 'i.remove-meteorite', function() {
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

/** ---------------------------- */
/**       Submit the form        */
/** ---------------------------- */

// the range for PPB
const ZERO = 0;
const ONE_BILLION = 1000000000;

/**
 * @description Performs validation before submitting the form.
 * If it fails validation, the form is not sent and the offending fields
 * are highlighted. It also grabs the number of significant figures
 * for each measure and assigns them to the appropriate hidden fields.
 * The measurements and deviations are normalized to PPB and assigned
 * to the appropriate hidden fields.
 */
$( '#event-div' ).on('submit', '#insert-form', function(event) {
  $('#insert-form').each(() => {
    $(this).find(':input').removeClass('is-invalid');
  });
  // flag - are all entries valid?
  let allValid = true;
  // For each field 'measurement*', check that it parses to a number
  $('[id^="measure"]').each(function(idx) {
    const _name = $(this).attr('name');
    const _expr = 'measurement';
    // scrape the idx from elem name, ex: '0-0'
    const _idx = _name.substring(_expr.length);
    // get the original measurement
    const _originalMeasurement = parseFloat($(this).val());
    if (isNaN(_originalMeasurement)) {
    // Mark invalid field entry
      $(this).addClass('is-invalid');
      allValid = false;
    } else {
    // get the current units
      const _unitID = '#units' + _idx;
      const _unit = $(_unitID).val();
      // get the original deviation
      const _deviationID = '#deviation' + _idx;
      const _originalDeviation = parseFloat($(_deviationID).val());
      if (isNaN(_originalDeviation)) {
        $(_deviationID).addClass('is-invalid');
        allValid = false;
      }
      // Convert the measurement and deviation to PPB
      let _convertedMeasurement;
      let _convertedDeviation;
      switch (_unit) {
        case 'wt_percent':
          _convertedMeasurement = percentToPPB(_originalMeasurement);
          _convertedDeviation = percentToPPB(_originalDeviation);
          break;
        case 'ppm':
          _convertedMeasurement = ppmToPPB(_originalMeasurement);
          _convertedDeviation = ppmToPPB(_originalDeviation);
          break;
        case 'ppb':
          _convertedMeasurement = _originalMeasurement;
          _convertedDeviation = _originalDeviation;
          break;
        case 'mg_g':
          _convertedMeasurement = milligramsPerGramToPPB(_originalMeasurement);
          _convertedDeviation = milligramsPerGramToPPB(_originalDeviation);
          break;
        case 'ug_g':
          _convertedMeasurement = microgramsPerGramToPPB(_originalMeasurement);
          _convertedDeviation = microgramsPerGramToPPB(_originalDeviation);
          break;
        case 'ng_g':
          _convertedMeasurement = nanogramsPerGramToPPB(_originalMeasurement);
          _convertedDeviation = nanogramsPerGramToPPB(_originalDeviation);
          break;
      }
      /*
        Now that the measurement and deviation have been normalized to PPB
        we can check that they are in range (zero - one billion) and that
        the deviation is not greater than the measurement.
        Then assign them to the appropriate hidden fields.
    */
      if (typeof _convertedMeasurement === 'number') {
        if ( _convertedMeasurement < ZERO
            || _convertedMeasurement > ONE_BILLION) {
          $(this).addClass('is-invalid');
          allValid = false;
        } else {
          const sfVal = getSigFig($(this).val());
          const _sigfig = '#sigfig' + _idx;
          $(_sigfig).val(sfVal); // assign sig fig val to matching hidden field

          // assign normalized measurement to hidden field
          const convertedMeasurementId = '#convertedMeasurement' + _idx;
          $(convertedMeasurementId).val(_convertedMeasurement);
        }
      } else {
        $(this).addClass('is-invalid'); // measurement not a number
        allValid = false;
      }
      if ( typeof _convertedDeviation === 'number' ) {
        if (_convertedDeviation < ZERO
            || _convertedDeviation > ONE_BILLION
            || _convertedDeviation > _convertedMeasurement) {
          $(_deviationID).addClass('is-invalid');
          allValid = false;
        } else {
        // assign normalized deviation to hidden field
          const convertedDeviationID = '#convertedDeviation' + _idx;
          $(convertedDeviationID).val(_convertedDeviation);
        }
      } else {
        $(_deviationID).addClass('is-invalid'); // deviation not a number
        allValid == false;
      }
    }
  });

  // Submit if checks pass
  if (allValid === true) {
    // serialize all tables
    const tables = [];
    const tableObjects = $('#table-target').children('div.table-div');
    $.each( tableObjects, function(tableIndex, table) {
      const rows = $(table).children('table').children('tbody').children();
      tables.push(serializeTable(rows));
    });
    $('#table-data-input').attr('value', JSON.stringify(tables));

    return; // submit
  } else {
    event.preventDefault(); // prevent submission
  }
});

/** ---------------------------- */
/**       UNIT CONVERSION        */
/** ---------------------------- */

/**
 * @param  {number} num in percent weight
 * @return {number} in parts per billion
 */
function percentToPPB(num) {
  if (typeof num !== 'number') return;
  return parseInt(num * 10000000); // num * ten_million
}
/**
 * @param  {number} num in parts per million
 * @return {number} in parts per billion
 */
function ppmToPPB(num) {
  if (typeof num !== 'number') return;
  return parseInt(num * 1000); // num * one_thousand
}
/**
 * @param  {number} num in milligrams per gram
 * @return {number} in parts per billion
 */
function milligramsPerGramToPPB(num) {
  if (typeof num !== 'number') return;
  return parseInt(num * 1000000); // num * one_million
}
/**
 * @param  {number} num in micrograms per gram
 * @return {number} in parts per billion
 */
function microgramsPerGramToPPB( num ) {
  if (typeof num !== 'number') return;
  return parseInt(num * 1000); // num * one_thousand
}
/**
 * @param  {number} num in nanograms per gram
 * @return {number} in PPB;
 */
function nanogramsPerGramToPPB(num) {
  if (typeof num !== 'number') return;
  return parseInt(num); // nanograms/gram is equivalent to ppb
}
