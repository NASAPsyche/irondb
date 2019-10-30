// Some functions inline on template to avoid import issues.
// This file used on all editor templates
/* eslint-disable no-invalid-this */


// eslint-disable-next-line no-undef
ElementsArr = Elements.slice(0, -1).split(',');


// eslint-disable-next-line no-undef
TechniqueArr = Technique.slice(0, -1).split(',');


/** ----------------------------- */
/**         Tool Specific         */
/** ----------------------------- */
// Render pdf and set filename value on checklist hidden input
$('document').ready(function() {
  const fp = $( '#filepath' ).attr('value');
  const panel = $( '#pdf-panel' );
  // eslint-disable-next-line
  PDFObject.embed(fp, panel);

  // Set hidden input
  $('#fileName-checklist').attr('value', $('#filepath').attr('value').slice(6));
});


// No extraction checkbox
$( '#event-div' ).on( 'click', '#manual', function() {
  if ($('#manual').prop('checked') === true) {
    // on check of manual, uncheck all other checkboxes
    $('#collapse').collapse('hide');
    $( '#attributes' ).prop( 'checked', false ).prop('disabled', true);
    $( '#allTables' ).prop( 'checked', false ).prop('disabled', true);
    $( '#singleTable' ).prop( 'checked', false ).prop('disabled', true);
  } else {
    // on uncheck renable other checkboxes
    $( '#attributes' ).prop('disabled', false);
    $( '#allTables' ).prop('disabled', false);
    $( '#singleTable' ).prop('disabled', false);
  }
});

// On select of allTables unselect single table
$( '#event-div' ).on( 'click', '#allTables', function() {
  if ($('#allTables').prop('checked') === true) {
    // if all tables uncheck single table and close collapse
    $('#collapse').collapse('hide');
    $( '#singleTable' ).prop( 'checked', false );
    $( '#singleTable' ).prop('disabled', true);
  } else {
    $( '#singleTable' ).prop('disabled', false);
  }
});

// On select of single tables unselect allTables
$( '#event-div' ).on( 'click', '#singleTable', function() {
  if ($('#singleTable').prop('checked') === true) {
    // if single tables selected uncheck all tables
    $( '#allTables' ).prop( 'checked', false );
    $( '#allTables' ).prop('disabled', true);
  } else {
    $( '#allTables' ).prop('disabled', false);
  }
});

// On select of any
$( '#event-div' ).on( 'click',
    '#attributes,#allTables, #singleTable', function() {
      if ($('#attributes').prop('checked') === true ||
      $('#allTables').prop('checked') === true ||
      $('#singleTable').prop('checked') === true
      ) {
        $( '#manual' ).prop('disabled', true);
      } else {
        $( '#manual' ).prop('disabled', false);
      }
    });


// Submit checklist and replace with ui
$( '#checklist-form' ).on( 'submit', function( event ) {
  event.preventDefault();

  // JSON of checklist inputs
  const formData = $('#checklist-form').serializeArray();
  const postData = {};
  for (let i = 0; i < formData.length; i++) {
    postData[formData[i].name] = formData[i].value;
  }

  if (
    postData.hasOwnProperty('attributes') ||
    postData.hasOwnProperty('allTables') ||
    postData.hasOwnProperty('singleTable') ||
    postData.hasOwnProperty('manual')
  ) {
    // eslint-disable-next-line no-invalid-this
    $.post('/data-entry/tool/', postData, function( data ) {
      // Remove checklist and replace with ui panel
      $('#secondary-panel').replaceWith( data );
      $('#fileName').attr('value', $('#filepath').attr('value').slice(6));

      // Disable validate button if not manual
      if (!postData.hasOwnProperty('manual')) {
        $('#validate-btn').prop('disabled', true);
        $('#validate-tables-btn').prop('disabled', true);
      }

      let processCount = 0;
      if (postData.hasOwnProperty('attributes')
      && postData.attributes === 'on') {
        processCount++;
        $.post('/data-entry/tool/attributes', postData, function(data) {
          processCount--;
          $('#attributes-target').replaceWith(data);
          if (processCount === 0) {
            $('#validate-btn').prop('disabled', false);
            $('#validate-tables-btn').prop('disabled', false);
          }
        });
      }

      if (postData.hasOwnProperty('singleTable')
          && postData.singleTable === 'on') {
        processCount++;
        $.post('/data-entry/tool/onePageTables', postData, function(data) {
          processCount--;
          $('#table-target').append(data);
          $('#table-loader').remove();
          if (processCount === 0) {
            $('#validate-btn').prop('disabled', false);
            $('#validate-tables-btn').prop('disabled', false);
          }
        });
      }

      if (postData.hasOwnProperty('allTables')
          && postData.allTables === 'on') {
        processCount++;
        $.post('/data-entry/tool/allPagesTables', postData, function(data) {
          processCount--;
          $('#table-target').append(data);
          $('#table-loader').remove();
          if (processCount === 0) {
            $('#validate-btn').prop('disabled', false);
            $('#validate-tables-btn').prop('disabled', false);
          }
        });
      }
    });
  } else {
    // No checkbox selected
    const alertMessage = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      Please select one of the options before submitting checklist.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;

    $('#alert-target').replaceWith(alertMessage);
  }
});

// Table button ajax post
$( '#table-div' ).on('submit', '#single-page-form', function( event ) {
  event.preventDefault();
  $('#get-btn').prop('disabled', true);
  // eslint-disable-next-line no-invalid-this
  $.post('/data-entry/tool/onePageTables',
      $(this).serialize(), function( data ) {
        $('#table-target').append(data);
        showEditor();
        $('#get-btn').prop('disabled', false);
      });
});

// remove inline style on change
$('#event-div').on('change', 'input.page-number', function() {
  $(this).removeAttr('style');
});

// Remove Table X-Button
$('#event-div').on('click', 'i.remove-table', function() {
  // remove closest div.table
  $(this).closest('div.table').remove();
});

// Table control toggle collapsed form
$('#event-div').on('click', 'a.table-update-btn', function() {
  // Toggle confirmation visibility
  $(this).siblings('div.collapse').collapse('toggle');
});

// On select of col/row show associated number select
$('#event-div').on('change', 'select.type', function() {
  if ($(this).val() === 'row') {
    $(this).siblings('select.row-number').prop('hidden', false);
    $(this).siblings('select.col-number').prop('hidden', true);
  } else if ($(this).val() === 'column') {
    $(this).siblings('select.row-number').prop('hidden', true);
    $(this).siblings('select.col-number').prop('hidden', false);
  }
});

/* eslint-disable max-len*/
const tableAlertTemplate = `<div 
class="alert alert-danger alert-dismissible fade show" role="alert">
<strong>Warning: </strong>
Cannot delete <%= type %> 0.
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
</div>`;
/* eslint-enable max-len*/

// Call function for table control form
$('#event-div').on('click', 'a.table-control-update', function() {
  // Remove any previous alerts
  $(this).parent().siblings('div.table-alert-target').empty();

  // Collect options
  const options = {};
  options.command = $(this).siblings('select.command').val();
  options.type = $(this).siblings('select.type').val();
  options.rowNumber = $(this).siblings('select.row-number').val();
  options.colNumber = $(this).siblings('select.col-number').val()
  
  const table = $(this).closest('div.collapse').siblings('table');

  // Execute specified command
  if (options.type === 'row' && options.rowNumber != 'Number') {
    const select = $(this).siblings('select.row-number');
    options.number = select.val();

    if ( options.command === 'add' ) {
      addRow(table, options.number, select);
    } else if ( options.command === 'delete' ) {
      if (options.number !== '0') {
        deleteRow(table, options.number, select);
      } else {
        // eslint-disable-next-line
        const tableAlert = ejs.render(tableAlertTemplate, {type: options.type});
        $(this).parent().siblings('div.table-alert-target').html(tableAlert);
      }
    }
  } else if (options.type === 'column'  && options.colNumber != 'Number') {
    const select = $(this).siblings('select.col-number');
    options.number = select.val();
    if ( options.command === 'add' ) {
      addColumn(table, options.number, select);
    } else if ( options.command === 'delete' ) {
      if (options.number !== '0') {
        deleteColumn(table, options.number, select);
      } else {
        // eslint-disable-next-line
        const tableAlert = ejs.render(tableAlertTemplate, {type: options.type});
        $(this).parent().siblings('div.table-alert-target').html(tableAlert);
      }
    }
  }
  console.log(options);
});

// Single Table Form Button
$('#event-div').on('click', '#tableToggle', function() {
  hideEditor();
  // Scroll to top of window
  window.scrollTo(0, 0);
});


// Cancel Button
$('#table-div').on('click', '#cancel-btn', function() {
  showEditor();
});

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


// Validation button
$('#event-div').on('click', '#validate-btn', function() {
  if ($('#table-data-input').length) {
    // serialize all tables
    const tables = [];
    const tableObjects = $('#table-target').children('div.table');
    $.each( tableObjects, function(tableIndex, table) {
      tables.push(serializeTable(table));
    });
    $('#table-data-input').attr('value', JSON.stringify(tables));
  }

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
      if ( entry[0] === 'tableData') {
        // Parse table data
        if (typeof entry[1] !== 'string') {
          const tables = $('div.table');
          for (let i = 0; i < entry[1].length; i++) {
            // for each table parse feedback
            const tableDiv = tables.eq(i);
            const pageNumObj = tableDiv.children('div.page-row')
                .children().children().children('input');
            const rows = tableDiv.children('table')
                .children('tbody').children();

            if (entry[1][i]['page_number'] === 'invalid') {
              pageNumObj.removeClass('is-valid')
                  .removeClass('is-invalid').addClass('is-invalid');
              pageNumObj.attr('style', 'outline: 3px solid #FBDCD7');
            } else if (entry[1][i]['page_number'] === 'success') {
              pageNumObj.removeClass('is-valid')
                  .removeClass('is-invalid').addClass('is-valid');
              pageNumObj.attr('style', 'outline: 2px solid #78BE20');
            }

            // Set analysis technique to valid
            $(rows[0]).children().children('select').addClass('is-valid');

            const elements = $(rows[1]).children().children('input');
            const units = $(rows[2]).children().children('input');

            // Check measurements
            entry[1][i]['cells'].map(function(cell) {
              const input = $(rows[cell.row]).children()
                  .eq(cell.column).children('input');
              const element = elements.eq(cell.column);
              const unit = units.eq(cell.column);
              const meteorite = $(rows[cell.row])
                  .children().eq(0).children('input');


              if (cell.measurement === 'invalid') {
                input.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                input.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.measurement === 'success') {
                input.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                input.attr('style', 'outline: 2px solid #78BE20');
              }

              if (cell.element === 'invalid') {
                element.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                element.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.element === 'success') {
                element.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                element.attr('style', 'outline: 2px solid #78BE20');
              }

              if (cell.units === 'invalid') {
                unit.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                unit.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.units === 'success') {
                unit.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                unit.attr('style', 'outline: 2px solid #78BE20');
              }

              if (cell.meteorite_name === 'invalid') {
                meteorite.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                meteorite.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.meteorite_name === 'success') {
                meteorite.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                meteorite.attr('style', 'outline: 2px solid #78BE20');
              }
            });
          }
        }
      } else {
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

    console.log(allValid);
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
      // Alert invalid
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

// Validation table button
$('#event-div').on('click', '#validate-tables-btn', function() {
  if ($('#table-data-input').length) {
    // serialize all tables
    const tables = [];
    const tableObjects = $('#table-target').children('div.table');
    $.each( tableObjects, function(tableIndex, table) {
      tables.push(serializeTable(table));
    });
    $('#table-data-input').attr('value', JSON.stringify(tables));
  }

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
      if ( entry[0] === 'tableData') {
        // Parse table data
        if (typeof entry[1] !== 'string') {
          const tables = $('div.table');
          for (let i = 0; i < entry[1].length; i++) {
            // for each table parse feedback
            const tableDiv = tables.eq(i);
            const pageNumObj = tableDiv.children('div.page-row')
                .children().children().children('input');
            const rows = tableDiv.children('table')
                .children('tbody').children();

            if (entry[1][i]['page_number'] === 'invalid') {
              pageNumObj.removeClass('is-valid')
                  .removeClass('is-invalid').addClass('is-invalid');
              pageNumObj.attr('style', 'outline: 3px solid #FBDCD7');
            } else if (entry[1][i]['page_number'] === 'success') {
              pageNumObj.removeClass('is-valid')
                  .removeClass('is-invalid').addClass('is-valid');
              pageNumObj.attr('style', 'outline: 2px solid #78BE20');
            }

            // Set analysis technique to valid
            $(rows[0]).children().children('select').addClass('is-valid');

            const elements = $(rows[1]).children().children('input');
            const units = $(rows[2]).children().children('input');

            // Check measurements
            entry[1][i]['cells'].map(function(cell) {
              const input = $(rows[cell.row]).children()
                  .eq(cell.column).children('input');
              const element = elements.eq(cell.column);
              const unit = units.eq(cell.column);
              const meteorite = $(rows[cell.row])
                  .children().eq(0).children('input');


              if (cell.measurement === 'invalid') {
                input.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                input.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.measurement === 'success') {
                input.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                input.attr('style', 'outline: 2px solid #78BE20');
              }

              if (cell.element === 'invalid') {
                element.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                element.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.element === 'success') {
                element.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                element.attr('style', 'outline: 2px solid #78BE20');
              }

              if (cell.units === 'invalid') {
                unit.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                unit.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.units === 'success') {
                unit.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                unit.attr('style', 'outline: 2px solid #78BE20');
              }

              if (cell.meteorite_name === 'invalid') {
                meteorite.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-invalid');
                meteorite.attr('style', 'outline: 3px solid #FBDCD7');
              } else if (cell.meteorite_name === 'success') {
                meteorite.removeClass('is-valid')
                    .removeClass('is-invalid').addClass('is-valid');
                meteorite.attr('style', 'outline: 2px solid #78BE20');
              }
            });
          }
        }
      }
      // Do nothing for none tables
    });

    // Check if all valid
    const allInputs = $('input,textarea,select');
    let allValid = true;
    allInputs.each(function() {
      if ($(this).hasClass('is-invalid') || !$(this).hasClass('is-valid')) {
        allValid = false;
      }
    });

    console.log(allValid);
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
      // Alert invalid
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

// Manual change value on table inputs
$('#event-div').on('change', 'input.table-input', function() {
  $(this).attr('value', $(this).val());
});

// On change of any input remove classes, alert user, and disable submit button.
$('#event-div').on('change', 'input,textarea,select', function() {
  if ($(this).hasClass('is-valid')) {
    // Alert change
    // eslint-disable-next-line no-undef
    const alert = ejs.render(validationWarningAlertTemplate, {
      type: 'warning',
      messageTitle: 'Warning:',
      message: `Valid data changed, revalidation 
      required before submission.`,
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
 * @param  {object} table html element of given table div
 * @return {json} json serialization of table xhr response div
 */
function serializeTable(table) {
  const rows = $(table).children('table').children('tbody').children();
  const pageNumber = $(table).children('div.page-row')
      .children('div').children('label').children('input').val();
  const tableObj = {};

  const cellData = [];
  const techniqueColumns = [];
  const elementColums = [];
  const unitColumns = [];
  const meteoriteRows = [];

  $.each( rows, function(rowIndex, value) {
    $.each( $(this).children(), function(columnIndex, value) {
      if (columnIndex === 0) {
        // meteorite name
        meteoriteRows[rowIndex] = $(value)
            .children('input').attr('value') === '' ? null : $(value)
                .children('input').val();
      } else if (rowIndex === 0) {
        // Analysis Technique
        techniqueColumns[columnIndex] = $(value)
            .children('select').attr('value') === '' ? null : $(value)
                .children('select').val();
      } else if (rowIndex === 1 && columnIndex !== 0) {
        // Element
        elementColums[columnIndex] = $(value)
            .children('input').attr('value') === '' ? null : $(value)
                .children('input').val();
      } else if (rowIndex === 2 && columnIndex !== 0) {
        // Unit
        unitColumns[columnIndex] = $(value)
            .children('input').attr('value') === '' ? null : $(value)
                .children('input').val();
      }
    });
  });

  // Add each cell with accompanying values to table array
  let temp = {};
  $.each( rows, function(rowIndex, value) {
    $.each( $(this).children(), function(columnIndex, value) {
      if (columnIndex > 0 && rowIndex > 2) {
        // Fill temp with cells attributes
        temp.analysis_technique = techniqueColumns[columnIndex];
        temp.meteorite_name = meteoriteRows[rowIndex];
        temp.element = elementColums[columnIndex];
        temp.units = unitColumns[columnIndex];
        if ($(value).children('input').attr('value').charAt(0) === '<') {
          temp.less_than = true;
          temp.measurement = $(value)
              .children('input').attr('value').slice(1);
        } else {
          temp.less_than = false;
          temp.measurement = $(value)
              .children('input').attr('value') === '' ? null : $(value)
                  .children('input').val();
        }
        temp.column = columnIndex;
        temp.row = rowIndex;

        // Push and reset temp
        cellData.push(temp);
        temp = {};
      }
    });
  });

  tableObj.page_number = pageNumber;
  tableObj.cells = cellData;
  return tableObj;
}

/**
 * @param  {object} table JQuery table object
 * @param {number} num number of row
 * @param {object} select select of the associated form
 */
function addRow(table, num, select) {
  // Add row after selected row
  const target = table.children('tbody').children('tr').eq(num);
  let rowStr = '<tr>';
  for ( let i = 0; i < target.children().length; i++ ) {
    rowStr += '<th><input type="text"></th>';
  }
  rowStr += '</tr>';
  target.after(rowStr);

  // Update select
  const count = parseInt(select.children('option').last().val()) + 1;
  select.append('<option value="'+ count +'">'+ count +'</option>');
}

/**
 * @param  {object} table JQuery table object
 * @param {number} num number of row
 * @param {object} select select of the associated form
 */
function deleteRow(table, num, select) {
  // Remove specified row
  table.children('tbody').children('tr').eq(num).remove();
  // Update select
  select.children('option').last().remove();
}

/**
 * @param  {object} table JQuery table object
 * @param {number} num number of row
 * @param {object} select select of the associated form
 */
function addColumn(table, num, select) {
  /* eslint-disable max-len*/
  const techniqueSelectTemplate = `<th>
  <select class="form-control">
      <option value="None">None</option>
      <% for(var k=0; k < Technique.length; k++) { %>
          <option value="<%= Technique[k] %>"><%= Technique[k] %></option> 
      <% } %>                   
  </select>
  </th>`;
  /* eslint-enable max-len*/

  // Render technique select
  // eslint-disable-next-line
  const techniqueSelect = ejs.render(techniqueSelectTemplate, {Technique: TechniqueArr});

  // Add column after specified column
  const rows = table.children('tbody').children('tr');
  for (let i = 0; i <= rows.length; i++) {
    if (i === 0) {
      if ((num - 1) === -1) {
        rows.eq(i).children().eq(num).before(techniqueSelect);
      } else {
        rows.eq(i).children().eq(num - 1).after(techniqueSelect);
      }
    } else {
      if ((num - 1) === -1) {
        rows.eq(i).children()
            .eq(num).before('<th><input type="text"></th>');
      } else {
        rows.eq(i).children().eq(num - 1).after('<th><input type="text"></th>');
      }
    }
  }

  // Update select
  const count = parseInt(select.children('option').last().val()) + 1;
  select.append('<option value="'+ count +'">'+ count +'</option>');
}

/**
 * @param  {object} table JQuery table object
 * @param {number} num number of row
 * @param {object} select select of the associated form
 */
function deleteColumn(table, num, select) {
  // Remove specified column
  const rows = table.children('tbody').children('tr');
  for (let i = 0; i <= rows.length; i++) {
    rows.eq(i).children().eq(num - 1).remove();
  }
  // Update select
  select.children('option').last().remove();
}

/**
 * @description Hides Editor to visible and Toggles signle table form to visible
 */
function hideEditor() {
  $('#event-div').prop('hidden', true);
  $('#table-div').prop('hidden', false);
}

/**
 * @description Toggles Editor to visible and hides single table form
 */
function showEditor() {
  $('#event-div').prop('hidden', false);
  $('#table-div').prop('hidden', true);
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
  addAuthor(this);
});


$( '#event-div' ).on('click', 'i.add-note', function( event ) {
  addNote(this);
});


$( '#event-div' ).on('click', 'i.add-measurement', function( event ) {
  addMeasurement(this);
});


$( '#event-div' ).on('click', 'i.add-meteorite', function( event ) {
  addMeteorite(this);
});

/**
 * @param  {object} e this
 */
function addAuthor( e ) {
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
  $(e).parent().siblings('.authors-end').first().before(html);
}

/**
 * @param  {object} e this
 */
function addNote( e ) {
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
  $(e).parent().siblings('button:submit').before(html);
}

/**
 * @param  {object} e this
 */
function addMeasurement( e ) {
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
  const html = ejs.render(measurementTemplate, idObj);

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
 */
function addMeteorite( e ) {
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

  // Render note template with current ID
  // eslint-disable-next-line
  const html = ejs.render(meteoriteTemplate, idObj);

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
    if ($('#table-data-input').length) {
      // serialize all tables
      const tables = [];
      const tableObjects = $('#table-target').children('div.table');
      $.each( tableObjects, function(tableIndex, table) {
        tables.push(serializeTable(table));
      });
      $('#table-data-input').attr('value', JSON.stringify(tables));
    }

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
