// Some functions inline on template to avoid import issues.
// This file used on all editor templates
/* eslint-disable no-invalid-this */

// eslint-disable-next-line no-undef
ElementsArr = Elements.slice(0, -1).split(',');

// eslint-disable-next-line no-undef
TechniqueArr = Technique.slice(0, -1).split(',');

/** ---------------------------- */
/**      Validate Button         */
/** ---------------------------- */

/* eslint-disable max-len*/
const validationWarningAlertTemplate = `<div 
class="alert alert-<%= type %> alert-dismissible fade show" role="alert">
<strong><%= messageTitle %> </strong>
<%= message %>
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
</div>`;
/* eslint-enable max-len*/


$('#event-div').on('click', '#validate-btn', function() {
  const formData = $('#insert-form').serializeArray();
  const postData = {};
  for (let i = 0; i < formData.length; i++) {
    if (
      !formData[i].name.includes('convertedDeviation') &&
      !formData[i].name.includes('convertedMeasurement') &&
      !formData[i].name.includes('sigfig')
    ) {
      if (formData[i].name.includes('primaryName') ||
          formData[i].name.includes('firstName') ||
          formData[i].name.includes('middleName') ||
          formData[i].name.includes('bodyName')
      ) {
        const input = $('input[name="' + formData[i].name + '"]');
        input.val(input.val().charAt(0).toUpperCase() + input.val().slice(1));
        postData[formData[i].name.toString()] = input.val();
      } else {
        postData[formData[i].name.toString()] = formData[i].value;
      }
    }
  }

  // Call Post Request for validation with all data
  $.post('/data-entry/tool/validate', postData, function( data ) {
    // $('#event-div').append('<p>' + JSON.stringify(data) + '</p>');
    const parsedData = JSON.parse(data[0]);
    // Set classes on all attributes
    Object.entries(parsedData).map(function(entry) {
      const selector = '#' + entry[0];
      const object = $(selector);
      // Parse Attributes
      if (entry[1] === 'invalid') {
        object.removeClass('is-valid')
            .removeClass('is-invalid').addClass('is-invalid');
      } else if (entry[1] === 'success') {
        object.removeClass('is-valid')
            .removeClass('is-invalid').addClass('is-valid');
      } else {
        object.removeClass('is-valid')
            .removeClass('is-invalid').addClass('is-valid');
      }
    });

    // Check if all valid
    const allInputs = $('input,textarea,select');
    let allValid = true;
    allInputs.each(function() {
      if ($(this).hasClass('is-invalid')) {
        allValid = false;
      }
    });

    if (allValid) {
      // If all valid enable submit
      $('#submit-btn').prop('disabled', false);
      // Alert all valid
      // eslint-disable-next-line no-undef
      const alert = ejs.render(validationWarningAlertTemplate, {
        type: 'success',
        messageTitle: 'Success:',
        message: 'All inputs valid. Submission enabled.',
      });
      $('div.main-alert-target').html(alert);
    } else {
      // Alert in valid
      // eslint-disable-next-line no-undef
      const alert = ejs.render(validationWarningAlertTemplate, {
        type: 'danger',
        messageTitle: 'Warning:',
        message: 'Invalid inputs present. Please fix and revalidate.',
      });
      $('div.main-alert-target').html(alert);
    }
  }); // End validation post
});

// On change of any input remove classes, alert user, and disable submit button.
$('#event-div').on('change', 'input,textarea,select', function() {
  if ($(this).hasClass('is-valid')) {
    // Alert change
    // eslint-disable-next-line no-undef
    const alert = ejs.render(validationWarningAlertTemplate, {
      type: 'warning',
      messageTitle: 'Warning:',
      message: `Valid data changed revalidation 
      or override required before submission.`,
    });
    $('div.main-alert-target').html(alert);
  }

  $(this).removeClass('is-valid').removeClass('is-invalid');
  $(this).removeAttr('style');
  $('#submit-btn').prop('disabled', true);
});

$('#event-div').on('click', '#override-btn', function() {
  $('#submit-btn').prop('disabled', false);
});


/** ---------------------------- */
/**    Functions Declarations    */
/** ---------------------------- */


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
  name="<%- firstNameID %>"
  required="true" placeholder="required">
</div>
<div class="form-group col-md-3">
  <label for="<%- middleNameID %>">Middle Initial</label>
  <input type="text" class="form-control" id="<%- middleNameID %>"
  name="<%- middleNameID %>" placeholder="optional">
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
  <select class="form-control p-1" id="<%- elementID %>" name="<%- elementID %>" required="true">
    <% for(var i=0; i < Elements.length; i++) { %>
        <option value="<%= Elements[i].toLowerCase()%>"><%= Elements[i] %></option> 
    <% } %>                   
  </select>
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
  <select class="form-control p-1" id="<%- techniqueID %>" name="<%- techniqueID %>" required="true">
      <% for(var i=0; i < Technique.length; i++) { %>
          <option value="<%= Technique[i]%>"><%= Technique[i] %></option> 
      <% } %>                   
  </select>
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
  <label for="<%- bodyNameID %>">Meteorite</label>
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
  addAuthor(this, authorTemplate);
});


$( '#event-div' ).on('click', 'i.add-note', function( event ) {
  addNote(this, noteTemplate);
});


$( '#event-div' ).on('click', 'i.add-measurement', function( event ) {
  addMeasurement(this, measurementTemplate);
});


$( '#event-div' ).on('click', 'i.add-meteorite', function( event ) {
  addMeteorite(this, meteoriteTemplate);
});

/**
 * @param  {object} e this
 * @param {string} template the template to be rendered
 */
function addAuthor( e, template ) {
  // Dynamically create IDs
  const primaryNameID = 'primaryName' + primaryNameIDCount;
  const firstNameID = 'firstName' + firstNameIDCount;
  const middleNameID = 'middleName' + middleNameIDCount;

  // Assign IDs
  const idObj = {};
  idObj['primaryNameID'] = primaryNameID;
  idObj['firstNameID'] = firstNameID;
  idObj['middleNameID'] = middleNameID;

  // Increment current counts
  primaryNameIDCount++;
  firstNameIDCount++;
  middleNameIDCount++;

  // Render Author template with current IDs
  // eslint-disable-next-line
  const html = ejs.render(template, idObj);

  // Insert template into DOM
  $(e).parent().siblings('.authors-end').first().before(html);
}

/**
 * @param  {object} e this
 * @param {string} template the template to be rendered
 */
function addNote( e, template ) {
  // Dynamically create IDs
  const noteID = 'note' + noteIDCount;

  // Assign IDs
  const idObj = {noteID: noteID};

  // Increment current count
  noteIDCount++;

  // Render note template with current ID
  // eslint-disable-next-line
  const html = ejs.render(template, idObj);

  // Insert template into DOM
  $(e).parent().siblings('button:submit').before(html);
}

/**
 * @param  {object} e this
 * @param {string} template the template to be rendered
 */
function addMeasurement( e, template ) {
  // Get parent meteorite
  const meteoriteID = $(e).parent()
      .prevAll( 'div.meteorite-header' ).first().attr('id').slice(9);

  // Dynamically create IDs
  const elementID = 'element' + meteoriteID + '_' + elementIDCount;
  const lessThanID = 'lessThan' + meteoriteID + '_' + lessThanIDCount;
  const measurementID = 'measurement' + meteoriteID + '_' + measurementIDCount;
  const deviationID = 'deviation' + meteoriteID + '_' + deviationIDCount;
  const unitsID = 'units' + meteoriteID + '_' + unitsIDCount;
  const techniqueID = 'technique' + meteoriteID + '_' + techniqueIDCount;
  const pageID = 'page' + meteoriteID + '_' + pageIDCount;
  const sigfigID = 'sigfig' + meteoriteID + '_' + sigfigIDCount;
  const convertedMeasurementID =
    'convertedMeasurement' + meteoriteID + '_' + convertedMeasurementIDCount;
  const convertedDeviationID =
    'convertedDeviation' + meteoriteID + '_' + convertedDeviationIDCount;

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

  // eslint-disable-next-line no-undef
  idObj['Elements'] = ElementsArr;
  // eslint-disable-next-line no-undef
  idObj['Technique'] = TechniqueArr;


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
  const html = ejs.render(template, idObj);

  // Insert template into DOM
  const nextID = 'meteorite' + (1 + Number(meteoriteID));
  if ( $( '#' + nextID ).length ) {
    $( '#' + nextID ).before(html);
  } else {
    $(e).parent().siblings('.notes-header')
        .first().before(html);
  }
}

/**
 * @param  {object} e this
 * @param {string} template the template to be rendered
 */
function addMeteorite( e, template ) {
  // Dynamically create IDs
  const meteoriteID = 'meteorite' + meteoriteIDCount;
  const bodyNameID = 'bodyName' + bodyNameIDCount;
  const groupID = 'group' + groupIDCount;
  const classID = 'class' + classIDCount;
  const elementID = 'element' + meteoriteIDCount + '_' + elementIDCount;
  const lessThanID = 'lessThan' + meteoriteIDCount + '_' + lessThanIDCount;
  const measurementID =
  'measurement' + meteoriteIDCount + '_' + measurementIDCount;
  const deviationID = 'deviation' + meteoriteIDCount + '_' + deviationIDCount;
  const unitsID = 'units' + meteoriteIDCount + '_' + unitsIDCount;
  const techniqueID = 'technique' + meteoriteIDCount + '_' + techniqueIDCount;
  const pageID = 'page' + meteoriteIDCount + '_' + pageIDCount;
  const sigfigID = 'sigfig' + meteoriteIDCount + '_' + sigfigIDCount;
  const convertedMeasurementID =
  'convertedMeasurement' + meteoriteIDCount + '_' + convertedMeasurementIDCount;
  const convertedDeviationID =
  'convertedDeviation' + meteoriteIDCount + '_' + convertedDeviationIDCount;

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

  // eslint-disable-next-line no-undef
  idObj['Elements'] = ElementsArr;
  // eslint-disable-next-line no-undef
  idObj['Technique'] = TechniqueArr;

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

  // Render meteorite template with current ID
  // eslint-disable-next-line
  const html = ejs.render(template, idObj);

  // Insert template into DOM
  $(e).parent().siblings('.notes-header').before(html);
}

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
$('#insert-form').submit(function(event) {
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
