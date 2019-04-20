
const testObj = {
  submissionID: 1,
  actions: [
    {
      type: 'basic',
      command: 'update',
      paperID: '8',
      paperTitle: 'New Paper Title',
      doi: '2351235',
      journalID: '8',
      journalName: 'New Journal Name',
      pub_year: '1998',
      volume: '99',
      issue: '98',
      series: '97',
    },
    {
      type: 'author',
      command: 'update',
      paperID: '8',
      authorID: '9',
      primaryName: 'Mind',
      firstName: 'Lost',
      middleName: 'My',
    },
    {
      type: 'author',
      command: 'insert',
      paperID: '8',
      primaryName: 'Samson',
      firstName: 'Brock',
      middleName: '',
    },
    {
      type: 'author',
      command: 'delete',
      paperID: '8',
      authorID: '9',
    },
    {
      type: 'body',
      command: 'update',
      bodyName: 'Even Bigger Rock',
      bodyID: '18',
      group: 'IAB',
      groupID: '18',
      measurements: [
        {
          elementID: '143',
          element: 'h',
          lessThan: 'true',
          units: 'ppb',
          technique: 'RNAA',
          page: '12',
          sigfig: '3',
          convertedMeasurement: '200',
          convertedDeviation: '121',
        },
        {
          elementID: '144',
          element: 'fe',
          lessThan: 'true',
          units: 'ppm',
          technique: 'RNAA',
          page: '13',
          sigfig: '3',
          convertedMeasurement: '999',
          convertedDeviation: '666',
        },
      ],
    },
    {
      type: 'body',
      command: 'insert',
      bodyName: 'Medium Rock',
      group: 'IAB',
      paperID: '8',
      measurements: [{
        element: 'K',
        lessThan: 'false',
        units: 'mg_g',
        technique: 'RNAA',
        page: '12',
        sigfig: '1',
        convertedMeasurement: '6000',
        convertedDeviation: '0',
      }], // array for if more than one element
    },
    {
      type: 'body',
      command: 'delete',
      bodyID: '18',
      groupID: '18',
    },
    {
      type: 'note',
      command: 'update',
      noteID: '1',
      paperID: '8',
      note: 'This note has been updated, oh yeaaaaah',
    },
    {
      type: 'note',
      command: 'insert',
      paperID: '2',
      note: 'this is a note',
    },
    {
      type: 'note',
      command: 'delete',
      noteID: '1',
    },
  ],
};
const testObjStr = JSON.stringify(testObj);

$( '#testbtn' ).on( 'click', function() {
  // $.post('/data-entry/insert/update', testObjStr);
  $.ajax({
    type: 'POST',
    url: '/data-entry/insert/update',
    data: testObjStr,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) {
      console.log('data');
    },
    failure: function(errMsg) {
      console.log('errMsg');
    },
  });
});


