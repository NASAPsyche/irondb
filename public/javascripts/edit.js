
// Some functions inline on template to avoid import issues.
// Uses functions defined in editor.js
/* eslint-disable no-invalid-this */

$('document').ready( function() {
  console.log('Serialization: ');
  console.log('length:' + $('div.basic').length);
  console.log($('div.basic').children());
  console.log($('div.basic').children().eq(3).children().children());
  console.log( serialzeBasic( $('div.basic') ));
});

/** ---------------------------- */
/**      Validate Button         */
/** ---------------------------- */

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

  console.log(postData);

  // Call Post Request for validation with all data
  $.post('/data-entry/tool/validate', postData, function( data ) {
    console.log(data);
  });
});

/** ----------------------------------- */
/**        EJS Templates for Add        */
/** ----------------------------------- */
/* eslint-disable max-len*/
/* eslint-enable max-len*/

/** ---------------------------- */
/**        UI Add Events         */
/** ---------------------------- */


/** ---------------------------- */
/**        UI Remove Events      */
/** ---------------------------- */


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
    const actionsArr = [];
    // Serialize all ui elements and add them to actions
    actionsArr.push(serialzeBasic( $('div.basic') ));

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
