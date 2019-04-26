// Some functions inline on template to avoid import issues.
// Uses functions defined in editor.js, must be added after
/* eslint-disable no-invalid-this */

$('document').ready( function() {
  console.log('length:' + $('div.body-update').length);
  console.log('Log 1');
  console.log($('div.body-update').children('div.element') );
  console.log('Log 2');
  console.log($('div.body-update').children().eq(5).children('input').val() );
  console.log('Serialization: ');
  for (let i = 0; i < $('div.body-update').length; i++) {
    console.log( serialzeBody( $('div.body-update').eq(i) ));
  }
});

/** ---------------------------- */
/**      Validate Button         */
/** ---------------------------- */

/* eslint-disable no-undef*/
$('#event-div').on('click', '#validate-btn-edit', function() {
  const formData = $('#edit-form').serializeArray();
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
      const alert = ejs.render(validationWarningAlertTemplate, {
        type: 'success',
        messageTitle: 'Success:',
        message: 'All inputs valid. Submission enabled.',
      });
      $('div.main-alert-target').html(alert);
    } else {
      // Alert in valid
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
/* eslint-enable no-undef*/

/** ----------------------------------- */
/**        EJS Templates for Add        */
/** ----------------------------------- */
/* eslint-disable max-len*/
const authorInsertTemplate = `<div class="author-insert">
<input type="hidden" name="paperID" value="">
<input type="hidden" name="authorID" value="">
<div class="form-row">
    <div class="col-md-1">
        <i class="far fa-times-circle fa-lg remove remove-author pt-4 text-danger" title="Press to remove author."></i>
    </div>
    <div class="form-group col-md-4">
        <label for="<%= primaryNameID %>">Last Name</label>
        <input type="text" class="form-control" id="<%= primaryNameID %>" name="<%= primaryNameID %>" required="true" placeholder="required"> 
    </div>
    <div class="form-group col-md-4">
        <label for="<%= firstNameID %>">First Name</label>
        <input type="text" class="form-control" id="<%= firstNameID %>" name="<%= firstNameID %>" required="true" placeholder="required"> 
    </div>
    <div class="form-group col-md-3">
        <label for="<%= middleNameID %>" >Middle Initial</label>
        <input type="text" class="form-control" id="<%= middleNameID %>" name="<%= middleNameID %>" placeholder="optional"> 
    </div>
</div>
</div>`;


const noteInsertTemplate = `<div class="note-insert">
  <input type="hidden" name="paperID" value="">
  <input type="hidden" name="noteID" value="">

  <div class="form-row pt-1">
      <label for="<%= noteID %>">Note:
          <i class="far fa-times-circle fa-lg remove remove-note-edit pl-5 text-danger" title="Press to remove note."></i>
      </label>
      <textarea class="form-control" id="<%= noteID %>" name="<%= noteID %>" rows="5"></textarea>
  </div>
</div>`;

const measurementInsertTemplate =`<div class="element element-insert">
<label class="sr-only" for="elementID">ID of current element</label>
<input type="hidden" name="elementID" value="">

<div class="form-row">
    <div class="col-md-1 p-0">
        <i class="far fa-times-circle fa-lg remove remove-element-edit pt-4 text-danger" title="Press to remove measurement."></i>
    </div>

    <div class="form-group col-md-1 mr-3">
        <label for="<%= elementID %>">Element</label>
        <select class="form-control p-1" id="<%= elementID %>" name="<%= elementID %>" required="true">
          <% for(var i=0; i < Elements.length; i++) { %>
            <option value="<%= Elements[i].toLowerCase()%>"><%= Elements[i] %></option> 
          <% } %>               
        </select>
    </div>

    <div class="form-check-inline col-md-1">
        <input class="form-check-input" type="checkbox" id="<%= lessThanID %>">
        <label class="form-check-label" for="<%= lessThanID %>">&lt;</label>
    </div>

    <div class="form-group col-md-2">
        <label for="<%= measurementID %>">Measurement</label>
        <input type="text" class="form-control" id="<%= measurementID %>" name="<%= measurementID %>" required="true" min="0">
    </div>
    <div class="form-group col-md-1">
        <label for="<%= deviationID %>">(&plusmn;)</label>
        <input type="number" class="form-control" id="<%= deviationID %>" name="<%= deviationID %>" value="0" min="0">
    </div>
    <div class="form-group col-md-2">
        <label for="<%= unitsID %>">Units</label>
        <select class="form-control" id="<%= unitsID %>" name="<%= unitsID %>" required="true">
            <option value="wt_percent">wt%</option>
            <option value="ppm">ppm</option>
            <option value="ppb">ppb</option>
            <option value="mg_g">mg/g</option>
            <option value="ug_g">&micro;g/g</option>
            <option value="ng_g">ng/g</option>
        </select>
    </div>
  
    <div class="form-group col-md-2">
        <label for="<%= techniqueID %>">Technique</label>
        <select class="form-control p-1" id="<%= techniqueID %>" name="<%= techniqueID %>" required="true">
          <% for(var i=0; i < Technique.length; i++) { %>
            <option value="<%= Technique[i]%>"><%= Technique[i] %></option> 
          <% } %>                 
        </select>
    </div>
    <div class="form-group col-md-1">
        <label for="<%= pageID %>">Page</label>
        <input type="number" class="form-control p-1" id="<%= pageID %>" name="<%= pageID %>" min="1" required>
    </div>
    <div class="form-group">
        <input type="hidden" id="<%= sigfigID %>" name="<%= sigfigID %>" value="0">
        <input type="hidden" id="<%= convertedMeasurementID %>" name="<%= convertedMeasurementID %>" value="0">
        <input type="hidden" id="<%= convertedDeviationID %>" name="<%= convertedDeviationID %>" value="0">
    </div>
</div>
</div>`;


const meteoriteInsertTemplate = `<div class="body-insert">
<label class="sr-only" for="paperID">ID of current body</label>
<input type="hidden" name="paperID" value="">

<label class="sr-only" for="bodyID">ID of current body</label>
<input type="hidden" name="bodyID" value="">

<div class="form-row meteorite-header" id="<%= meteoriteID %>">
    <h5 class="pt-1 mr-2"><strong>Meteorite</strong></h5>
    <i class="fas fa-plus-circle fa-lg add-meteorite-edit mt-2 text-danger"></i>
</div>

<div class="form-row">
    <div class="col-md-1">
        <i class="far fa-times-circle fa-lg remove remove-body-edit pt-4 text-danger" title="Press to remove meteorite and all associated measurements."></i>
    </div>
    <div class="form-group col-md-6">
        <label for="<%= bodyNameID %>">Meteorite</label>
        <input type="text" class="form-control" id="<%= bodyNameID %>" name="<%= bodyNameID %>" required="true">
    </div>

    <div class="form-group col-md-2">
        <label for="<%= groupID %>">Group</label>
        <input type="text" class="form-control" id="<%= groupID %>" name="<%= groupID %>" required="true">
    </div>

    <label class="sr-only" for="groupID">ID of current group</label>
    <input type="hidden" name="groupID" value="">
</div>

<div class="form-row">
    <h5 class="pt-1 mr-2 pl-3"><strong>Measurements</strong></h5>
    <i class="fas fa-plus-circle fa-lg add-measurement-edit mt-2 text-danger"></i>
</div>` + measurementInsertTemplate // Add single measurement row to meteorite template
+ '</div>';
/* eslint-enable max-len*/

/** ---------------------------- */
/**        UI Add Events         */
/** ---------------------------- */
$( '#event-div' ).on('click', 'i.add-author-edit', function( event ) {
  // eslint-disable-next-line no-undef
  addAuthor(this, authorInsertTemplate);
});

$( '#event-div' ).on('click', 'i.add-note-edit', function( event ) {
  // eslint-disable-next-line no-undef
  addNote(this, noteInsertTemplate);
});

/* eslint-disable no-undef*/
$( '#event-div' ).on('click', 'i.add-measurement-edit', function( event ) {
  // Get parent meteorite
  const meteoriteID = $(this).parent()
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
  const html = ejs.render(measurementInsertTemplate, idObj);

  // Insert template into DOM at end of current body
  $(this).parent().parent().append(html);
});

$( '#event-div' ).on('click', 'i.add-meteorite-edit', function( event ) {
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
  const html = ejs.render(meteoriteInsertTemplate, idObj);

  // Insert template into DOM
  $(this).parent().parent().after(html);
});
/* eslint-enable no-undef*/


/** ---------------------------- */
/**        UI Remove Events      */
/** ---------------------------- */
const removedArray = [];

$( '#event-div' ).on('click', 'i.remove-author', function() {
  const author = $(this).parent().parent().parent();
  if (author.hasClass('author-update')) {
    removedArray.push(deleteAuthor(serialzeAuthor( author )));
  }
  author.remove();
});

$( '#event-div' ).on('click', 'i.remove-note-edit', function() {
  const note = $(this).parent().parent().parent();
  if (note.hasClass('note-update')) {
    removedArray.push(deleteNote(serialzeNote( note )));
  }
  note.remove();
});

$( '#event-div' ).on('click', 'i.remove-element-edit', function() {
  const element = $(this).parent().parent().parent();
  if (element.hasClass('element-update')) {
    removedArray.push(deleteElement(serialzeElement( element )));
    console.log(removedArray);
  }
  element.remove();
});

$( '#event-div' ).on('click', 'i.remove-body-edit', function() {
  const body = $(this).parent().parent().parent();
  if (body.hasClass('body-update')) {
    removedArray.push(deleteBody(serialzeBody( body )));
    // Add remove element commands
    const elements = body.children('div.element');
    for (let i = 0; i < elements.length; i++ ) {
      removedArray.push( deleteElement(serialzeElement( $(elements[i]) )));
    }
    console.log(removedArray);
  }
  body.remove();
});
/** ---------------------------- */
/**       Submit the form        */
/** ---------------------------- */

/**
 * @description Performs validation before submitting the form.
 * If it fails validation, the form is not sent and the offending fields
 * are highlighted. It also grabs the number of significant figures
 * for each measure and assigns them to the appropriate hidden fields.
 * The measurements and deviations are normalized to PPB and assigned
 * to the appropriate hidden fields.
 */
/* eslint-disable no-undef*/
// Using defintions from editor.js
$('#edit-form').submit(function(event) {
  $('#edit-form').each(() => {
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
  /* eslint-enable no-undef*/

  // Submit if checks pass
  if (allValid === true) {
    const actionsArr = removedArray;
    const PaperID = $('#paperID').val();
    // Serialize all ui elements and add them to actions
    actionsArr.push(serialzeBasic( $('div.basic') ));

    // Authors
    for (let i = 0; i < $('div.author-update').length; i++) {
      actionsArr.push(
          updateAuthor(serialzeAuthor($('div.author-update').eq(i)))
      );
    }

    for (let i = 0; i < $('div.author-insert').length; i++) {
      actionsArr.push(
          insertAuthor( serialzeAuthor($('div.author-insert').eq(i)), PaperID )
      );
    }

    // Bodies
    for (let i = 0; i < $('div.body-update').length; i++) {
      actionsArr.push(
          updateBody(serialzeBody($('div.body-update').eq(i)))
      );
    }

    for (let i = 0; i < $('div.body-insert').length; i++) {
      actionsArr.push(
          insertBody( serialzeBody($('div.body-insert').eq(i)), PaperID )
      );
    }

    // Notes
    for (let i = 0; i < $('div.note-update').length; i++) {
      actionsArr.push(
          updateNote(serialzeNote($('div.note-update').eq(i)))
      );
    }

    for (let i = 0; i < $('div.note-insert').length; i++) {
      actionsArr.push(
          insertNote( serialzeNote($('div.note-insert').eq(i)), PaperID )
      );
    }

    // Add actions array to hidden input
    $('#actions').val(JSON.stringify(actionsArr));
    return; // submit
  } else {
    event.preventDefault(); // prevent submission
  }
});


/** ---------------------------- */
/**        SERIALIZATION         */
/** ---------------------------- */

/**
 * @param  {object} obj a div of class basic-update
 * @return {object} action object for update
 */
function serialzeBasic( obj ) {
  const temp = {};
  temp.type = 'basic';
  temp.command = 'update';
  temp.paperID = obj.children().eq(0).val();
  temp.paperTitle = $('#paperTitle').val();
  temp.doi = $('#doi').val();
  temp.journalID = obj.children().eq(1).val();
  temp.journalName = $('#journalName').val();
  temp.pub_year = $('#pubYear').val();
  temp.volume = $('#volume').val();
  temp.issue = $('#issue').val();
  temp.series = $('#series').val();
  return temp;
}

/**
 * @param  {object} obj a div of class author-*
 * @return {object} author object for creation of action object
 */
function serialzeAuthor( obj ) {
  const temp = {};
  temp.type = 'author';
  temp.command = 'update';
  temp.paperID = obj.children().eq(0).val();
  temp.authorID = obj.children().eq(1).val();
  temp.primaryName = obj.children().eq(2)
      .children().eq(1).children('input').val();
  temp.firstName = obj.children().eq(2)
      .children().eq(2).children('input').val();
  temp.middleName = obj.children().eq(2)
      .children().eq(3).children('input').val();
  return temp;
}

/**
 * @param  {object} author a serialized author object
 * @return {object} action object for update
 */
function updateAuthor( author ) {
  author.type = 'author';
  author.command = 'update';
  return author;
}

/**
 * @param  {object} author a serialized author object
 * @param {number} PaperID Id of loaded paper
 * @return {object} action object for insert
 */
function insertAuthor( author, PaperID ) {
  const temp = {};
  temp.type = 'author';
  temp.command = 'insert';
  temp.paperID = PaperID;
  temp.primaryName = author.primaryName;
  temp.firstName = author.firstName;
  temp.middleName = author.middleName;
  return temp;
}

/**
 * @param  {object} author a serialized author object
 * @return {object} action object for delete
 */
function deleteAuthor( author ) {
  const temp = {};
  temp.type = 'author';
  temp.command = 'delete';
  temp.paperID = author.paperID;
  temp.authorID = author.authorID;
  return temp;
}

/**
 * @param  {object} obj a div of class note-*
 * @return {object} note object for creation of action object
 */
function serialzeNote( obj ) {
  const temp = {};
  temp.paperID = obj.children().eq(0).val();
  temp.noteID = obj.children().eq(1).val();
  temp.note = obj.children('div').children('textarea').val();
  return temp;
}

/**
 * @param  {object} note a serialized note object
 * @return {object} action object for update
 */
function updateNote( note ) {
  note.type = 'note';
  note.command = 'update';
  return note;
}

/**
 * @param  {object} note a serialized note object
 * @param {number} PaperID Id of loaded paper
 * @return {object} action object for insert
 */
function insertNote( note, PaperID ) {
  const temp = {};
  temp.type = 'note';
  temp.command = 'insert';
  temp.paperID = PaperID;
  temp.note = note.note;
  return temp;
}

/**
 * @param  {object} note a serialized note object
 * @return {object} action object for delete
 */
function deleteNote( note ) {
  const temp = {};
  temp.type = 'note';
  temp.command = 'delete';
  temp.noteID = note.noteID;
  return temp;
}

/**
 * @param  {object} obj a div of class element-*
 * @return {object} element object for creation of action object
 */
function serialzeElement( obj ) {
  const temp = {};
  temp.elementID = obj.children().eq(1).val();
  temp.element = obj.children('div.form-row')
      .children().eq(1).children('select').val();
  if (obj.children('div.form-row')
      .children().eq(2).children('input:checked').length
  ) {
    temp.lessThan = 'true';
  } else {
    temp.lessThan = 'false';
  }
  temp.units = obj.children('div.form-row')
      .children().eq(5).children('select').val();
  temp.technique = obj.children('div.form-row')
      .children().eq(6).children('select').val();
  temp.page = obj.children('div.form-row')
      .children().eq(7).children('input').val();
  temp.sigfig = obj.children('div.form-row')
      .children().eq(8).children('input').eq(0).val();
  temp.convertedMeasurement = obj.children('div.form-row')
      .children().eq(8).children('input').eq(1).val();
  temp.convertedDeviation = obj.children('div.form-row')
      .children().eq(8).children('input').eq(2).val();
  return temp;
}

/**
 * @param  {object} element a serialized element object
 * @return {object} action object for delete
 */
function deleteElement( element ) {
  const temp = {};
  temp.type = 'element';
  temp.command = 'delete';
  temp.elementID = element.elementID;
  return temp;
}

/**
 * @param  {object} obj a div of class body-*
 * @return {object} body object for creation of action object
 */
function serialzeBody( obj ) {
  const temp = {};
  temp.paperID = obj.children().eq(1).val();
  temp.bodyID = obj.children().eq(3).val();
  temp.bodyName = obj.children().eq(5).children().eq(1).children('input').val();
  temp.group = obj.children().eq(5).children().eq(2).children('input').val();
  temp.groupID = obj.children().eq(5).children('input').val();
  const tempArray = [];
  const elements = obj.children('div.element');
  for (let i = 0; i < elements.length; i++ ) {
    tempArray.push( serialzeElement( $(elements[i]) ));
  }
  temp.measurements = tempArray;
  return temp;
}

/**
 * @param  {object} body a serialized body object
 * @return {object} action object for update
 */
function updateBody( body ) {
  body.type = 'body';
  body.command = 'update';
  return body;
}

/**
 * @param  {object} body a serialized body object
 * @param {number} PaperID Id of loaded paper
 * @return {object} action object for insert
 */
function insertBody( body, PaperID ) {
  const temp = {};
  temp.type = 'body';
  temp.command = 'insert';
  temp.paperID = PaperID;
  temp.bodyName = body.bodyName;
  temp.group = body.group;
  temp.measurements = body.measurements;
  return temp;
}


/**
 * @param  {object} body a serialized body object
 * @return {object} action object for delete
 */
function deleteBody( body ) {
  const temp = {};
  temp.type = 'body';
  temp.command = 'delete';
  temp.bodyID = body.bodyID;
  temp.groupID = body.groupID;
  return temp;
}
