/* eslint-disable max-len */
/**
 * Functions for supporting inserting entries into DB
 */

const pg = require('./index'); // postgres conx

/**
 * @description Takes a full entry and inserts it into the database.
 * If any part of the transaction fails, then the entire insert fails
 * and will be rolled back.
 * @param  {object} journal
 * @param  {object} paper
 * @param  {Array} authors
 * @param  {Array} bodies
 * @param  {Array} notes
 * @param  {string} username
 * @param  {string} pdfPath
 * @param  {string} status default 'pending'
 * @return {number} 0 - normal, 1 - failure
 */
async function insertEntry(
    journal,
    paper,
    authors,
    bodies,
    notes,
    username,
    pdfPath,
    status = 'pending'
) {
  const client = await pg.pool.connect();
  let journalId = null;
  let paperId = null;
  let submissionId = null;
  try {
    await client.query('BEGIN');
    // START A SUBMISSION
    {
      const submissionQuery =`
      INSERT INTO
      submissions(pdf_path, username)
      VALUES($1, $2)
      RETURNING submission_id
      `;
      const submissionValue = [pdfPath, username];
      const {rows} = await client.query(submissionQuery, submissionValue);
      submissionId = rows[0].submission_id;
      if ( submissionId == null || submissionId == '') {
        throw new Error( 'invalid submission ID');
      }
    }
    // END SUBMISSION TRANSACTION

    // START JOURNAL TRANSACTION
    {
      const journalQuery = `
      INSERT INTO
      journals(journal_name, volume, issue, series, published_year)
      VALUES($1, $2, $3, $4, $5)
      RETURNING journal_id
      `;
      const journalValue = [
        journal.journalName,
        journal.volume,
        journal.issue,
        journal.series,
        journal.pubYear,
      ];
      let {rows} = await client.query(journalQuery, journalValue);
      const journalStatusQuery = `
      INSERT INTO journal_status(journal_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const journalId_ = rows[0].journal_id;
      journalId = journalId_;
      if ( journalId == null || journalId == '') {
        throw new Error( 'invalid journal ID');
      }
      const journalStatusValue = [
        journalId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(journalStatusQuery, journalStatusValue);

      const journalUpdateQuery = `
      UPDATE journals
      SET status_id = ($1)
      WHERE journal_id = ($2)
      `;
      const statusIdJournal = rows.rows[0].status_id;
      const journalUpdateValue = [
        statusIdJournal,
        journalId,
      ];
      await client.query(journalUpdateQuery, journalUpdateValue);
    // END JOURNAL TRANSACTION
    }

    { // PAPER TRANSACTION
      const paperQuery = `
      INSERT INTO
      papers(journal_id, title, doi)
      VALUES($1, $2, $3)
      RETURNING paper_id
      `;
      const paperValue = [
        journalId,
        paper.paperTitle,
        paper.doi,
      ];
      let {rows} = await client.query(paperQuery, paperValue);

      const paperId_ = rows[0].paper_id;
      paperId = paperId_;
      if ( paperId == null || paperId == '') {
        throw new Error( 'invalid paper ID');
      }
      const paperStatusQuery = `
      INSERT INTO
      paper_status(paper_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const paperStatusValue = [
        paperId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(paperStatusQuery, paperStatusValue);
      const statusIdPaper = rows.rows[0].status_id;
      const paperUpdateQuery = `
      UPDATE papers
      SET status_id = ($1)
      WHERE paper_id = ($2)
      `;
      const paperUpdateValue = [
        statusIdPaper,
        paperId,
      ];
      await client.query(paperUpdateQuery, paperUpdateValue);
    // END PAPER TRANSACTION
    }


    //
    // START AUTHORS AND ATTRIBUTIONS TRANSACTION
    for (const author of authors) {
      // START AUTHOR TRANSACTION
      const authorQuery = `
      INSERT INTO
      authors(primary_name, first_name, middle_name, single_entity)
      VALUES($1, $2, $3, $4)
      RETURNING author_id
      `;
      const authorValue = [
        author.primaryName,
        author.firstName,
        author.middleName,
        author.singleEntity,
      ];
      let {rows} = await client.query(authorQuery, authorValue);

      const authorId = rows[0].author_id;
      const authorStatusQuery = `
      INSERT INTO
      author_status(author_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const authorStatusValue = [
        authorId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(authorStatusQuery, authorStatusValue);

      const statusIdAuthor = rows.rows[0].status_id;
      const authorUpdateQuery = `
      UPDATE authors
      SET status_id = ($1)
      WHERE author_id = ($2)
      `;
      const authorUpdateValue = [
        statusIdAuthor,
        authorId,
      ];
      await client.query(authorUpdateQuery, authorUpdateValue);

      // Attribution transaction
      const attrQuery = `
      INSERT INTO
      attributions(paper_id, author_id)
      VALUES($1, $2)
      RETURNING attribution_id
      `;
      const attrValue = [
        paperId,
        authorId,
      ];
      rows = await client.query(attrQuery, attrValue);

      const attrId = rows.rows[0].attribution_id;
      const attrStatusQuery = `
      INSERT INTO
      attribution_status(attribution_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const attrStatusValue = [
        attrId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(attrStatusQuery, attrStatusValue);
      const statusIdAttr = rows.rows[0].status_id;
      const attrUpdateQuery = `
      UPDATE attributions
      SET status_id = ($1)
      WHERE attribution_id = ($2)
      `;
      const attrUpdateValue = [
        statusIdAttr,
        attrId,
      ];
      await client.query(attrUpdateQuery, attrUpdateValue);
    }

    // START METEORITE TRANSACTIONS
    for (const body of bodies) {
      // START BODY TRANSACTION
      const bodyQuery = `
      INSERT INTO
      bodies(nomenclature)
      VALUES($1)
      RETURNING body_id
      `;
      const bodyValue = [
        body.nomenclature,
      ];
      let {rows} = await client.query(bodyQuery, bodyValue);

      const bodyId = rows[0].body_id;
      const bodyStatusQuery = `
      INSERT INTO
      body_status(body_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const bodyStatusValue = [
        bodyId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(bodyStatusQuery, bodyStatusValue);

      const statusIdBody = rows.rows[0].status_id;
      const bodyUpdateQuery = `
      UPDATE bodies
      SET status_id = ($1)
      WHERE body_id = ($2)
      `;
      const bodyUpdateValue = [
        statusIdBody,
        bodyId,
      ];
      await client.query(bodyUpdateQuery, bodyUpdateValue);
      // END BODY TRANSACTION

      // START GROUP TRANSACTION
      const groupQuery = `
      INSERT INTO
      groups(body_id, the_group)
      VALUES($1, $2)
      RETURNING group_id
      `;
      const groupValue = [
        bodyId,
        body.group,
      ];
      rows = await client.query(groupQuery, groupValue);
      const groupId = rows.rows[0].group_id;
      const groupStatusQuery = `
      INSERT INTO
      group_status(group_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const groupStatusValue = [
        groupId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(groupStatusQuery, groupStatusValue);

      const statusIdGroup = rows.rows[0].status_id;
      const groupUpdateQuery = `
      UPDATE groups
      SET status_id = ($1)
      WHERE group_id = ($2)
      `;
      const groupUpdateValue = [
        statusIdGroup,
        groupId,
      ];
      await client.query(groupUpdateQuery, groupUpdateValue);
      // END GROUP TRANSACTION


      // START CLASSIFICATION TRANSACTION
      if (body.classification != '' && body.classification != null) {
        const classQuery = `
        INSERT INTO
        classifications(body_id, classification)
        VALUES($1, $2)
        RETURNING classification_id
        `;
        const classValue = [
          bodyId,
          body.classification,
        ];
        let {rows} = await client.query(classQuery, classValue);

        const classId = rows[0].classification_id;
        const classStatusQuery = `
        INSERT INTO
        classification_status(classification_id, current_status, submitted_by, submission_id)
        VALUES($1, $2, $3, $4)
        RETURNING status_id
        `;
        const classStatusValue = [
          classId,
          status,
          username,
          submissionId,
        ];
        rows = await client.query(classStatusQuery, classStatusValue);

        const statusId = rows.rows[0].status_id;
        const classUpdateQuery = `
        UPDATE classifications
        SET status_id = ($1)
        WHERE classification_id = ($2)
        `;
        const classUpdateValue = [
          statusId,
          classId,
        ];
        await client.query(classUpdateQuery, classUpdateValue);
      }
      // END CLASSIFICATION TRANSACTION

      // START MEASUREMENTS FOR BODIES TRANSACTIONS
      for (const measure of body.measurements) {
        // Normalize the measurements
        // TODO: review this section after implementing
        // normalization in submit form
        const measureVal = parseInt(measure.measurement, 10);
        measure.element = String(measure.element).toLowerCase();
        // eslint-disable-next-line max-len
        if (measure.deviation == '' || typeof measure.deviation == 'undefined') {
          measure.deviation = 0;
        }
        if (measure.deviation < 0) {
          measure.deviation = measure.deviation * -1;
        }
        const deviation = parseInt(measure.deviation, 10);
        if (measure.sigfig == '' || typeof measure.sigfig == 'undefined') {
          measure.sigfig = 0;
        }
        const sigfigVal = parseInt(measure.sigfig, 10);

        const measureQuery = `
        INSERT INTO
        element_entries(
          body_id,
          element_symbol,
          paper_id,
          page_number,
          ppb_mean,
          deviation,
          less_than,
          original_unit,
          technique,
          sigfig
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING element_id
        `;
        const measureValue = [
          bodyId,
          measure.element,
          paperId,
          measure.page,
          measureVal,
          deviation,
          measure.lessThan,
          measure.unit,
          measure.technique,
          sigfigVal,
        ];
        let {rows} = await client.query(measureQuery, measureValue);

        const elementId = rows[0].element_id;
        const measureStatusQuery = `
        INSERT INTO
        element_status(element_id, current_status, submitted_by, submission_id)
        VALUES($1, $2, $3, $4)
        RETURNING
        status_id
        `;
        const measureStatusValue = [
          elementId,
          status,
          username,
          submissionId,
        ];
        rows = await client.query(measureStatusQuery, measureStatusValue);

        const statusIdMeasure = rows.rows[0].status_id;
        const measureUpdateQuery = `
        UPDATE element_entries
        SET status_id = ($1)
        WHERE element_id = ($2)
        `;
        const measureUpdateValue = [
          statusIdMeasure,
          elementId,
        ];
        await client.query(measureUpdateQuery, measureUpdateValue);
      } // END MEASUREMENTS FOR BODIES TRANSACTIONS
    } // END METEORITE TRANSACTIONS


    // START NOTE TRANSACTIONS
    for (const note of notes) {
      const noteQuery = `
      INSERT INTO
      notes(paper_id, note)
      VALUES($1, $2)
      RETURNING note_id
      `;
      const noteValue = [
        paperId,
        note,
      ];
      let {rows} = await client.query(noteQuery, noteValue);

      const noteId = rows[0].note_id;
      const noteStatusQuery = `
      INSERT INTO
      note_status(note_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const noteStatusValue = [
        noteId,
        status,
        username,
        submissionId,
      ];
      rows = await client.query(noteStatusQuery, noteStatusValue);

      const statusIdNote = rows.rows[0].status_id;
      const noteUpdateQuery = `
      UPDATE notes
      SET status_id = ($1)
      WHERE note_id = ($2)
      `;
      const noteUpdateValue = [
        statusIdNote,
        noteId,
      ];
      await client.query(noteUpdateQuery, noteUpdateValue);
    }
    // END NOTE TRANSACTIONS

    // START REMOVE TEMPORARY JSON STORE
    {
      const removeStoreQuery = `
      DELETE FROM entry_store
      WHERE entry_store.username = ($1)
      `;
      const removeStoreValue = [username];
      await client.query(removeStoreQuery, removeStoreValue);
    }
    // END REMOVE TEMPORARY JSON STORE

    // COMMIT ALL TRANSACTIONS AS SINGLE TRANSACTION
    await client.query('COMMIT');
    console.log('Insertion was successful, changes committed');
  } catch (error) {
    await client.query('ROLLBACK');
    console.log(error);
    return 1;
  } finally {
    client.release();
  }
  return 0;
}

module.exports = {insertEntry};
