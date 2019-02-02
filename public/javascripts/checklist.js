$('document').ready(function() {
  const fp = $( '#filepath' ).attr('value');
  const panel = $( '#pdf-panel' );
  // eslint-disable-next-line
  PDFObject.embed(fp, panel);
});
