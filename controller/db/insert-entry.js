/**
 * Functions for supporting inserting entries into DB
 */

const pg = require('./index');

/**
 * @param  {object} journal
 * @param  {object} paper
 * @param  {Array} authors
 * @param  {Array} bodies
 * @param  {Array} notes
 * @param  {string} username
 * @param  {string} status default 'pending'
 */
function insertEntry(
    journal,
    paper,
    authors,
    bodies,
    notes,
    username,
    status = 'pending'
) {
  /* eslint-disable max-len */

  // Start DB transaction
  pg.getClient((err, client, done) => {
    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack);
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack);
          }
          // release the client back to the pool
          done();
        });
      }
      return !!err;
    };
    client.query('BEGIN', (err) => {
      if (shouldAbort(err)) return;
      // JOURNAL TRANSACTION
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
      client.query(journalQuery, journalValue, (err, res) => {
        if (shouldAbort(err)) return;
        // JOURNAL STATUS
        const journalStatusQuery = `
        INSERT INTO journal_status(journal_id, current_status, submitted_by)
        VALUES($1, $2, $3)
        RETURNING status_id
        `;
        const journalId = res.rows[0].journal_id;
        const journalStatusValue = [
          journalId,
          status,
          username,
        ];
        client.query(journalStatusQuery, journalStatusValue, (err, res) => {
          if (shouldAbort(err)) return;
          // JOURNAL ADD STATUS ID
          const journalUpdateQuery = `
          UPDATE journals
          SET status_id = ($1)
          WHERE journal_id = ($2)
          `;
          const statusId = res.rows[0].status_id;
          const journalUpdateValue = [
            statusId,
            journalId,
          ];
          client.query(journalUpdateQuery, journalUpdateValue, (err, res) => {
            if (shouldAbort(err)) return;
            // PAPER TRANSACTION
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
            client.query(paperQuery, paperValue, (err, res) => {
              if (shouldAbort(err)) return;
              // PAPER STATUS
              const paperId = res.rows[0].paper_id;
              const paperStatusQuery = `
              INSERT INTO
              paper_status(paper_id, current_status, submitted_by)
              VALUES($1, $2, $3)
              RETURNING status_id
              `;
              const paperStatusValue = [
                paperId,
                status,
                username,
              ];
              client.query(paperStatusQuery, paperStatusValue, (err, res) => {
                if (shouldAbort(err)) return;
                // PAPER ADD STATUS ID
                const statusId = res.rows[0].status_id;
                const paperUpdateQuery = `
                UPDATE papers
                SET status_id = ($1)
                WHERE paper_id = ($2)
                `;
                const paperUpdateValue = [
                  statusId,
                  paperId,
                ];
                client.query(paperUpdateQuery, paperUpdateValue, (err, res) => {
                  if (shouldAbort(err)) return;
                  // AUTHOR TRANSACTIONS
                  authors.forEach((author, i) => {
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
                    client.query(authorQuery, authorValue, (err, res) => {
                      if (shouldAbort(err)) return;
                      // AUTHOR STATUS
                      const authorId = res.rows[0].author_id;
                      const authorStatusQuery = `
                      INSERT INTO
                      author_status(author_id, current_status, submitted_by)
                      VALUES($1, $2, $3)
                      RETURNING status_id
                      `;
                      const authorStatusValue = [
                        authorId,
                        status,
                        username,
                      ];
                      client.query(authorStatusQuery, authorStatusValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        // AUTHOR ADD STTAUS ID
                        const statusId = res.rows[0].status_id;
                        const authorUpdateQuery = `
                        UPDATE authors
                        SET status_id = ($1)
                        WHERE author_id = ($2)
                        `;
                        const authorUpdateValue = [
                          statusId,
                          authorId,
                        ];
                        client.query(authorUpdateQuery, authorUpdateValue, (err, res) => {
                          // ATTRIBUTION TRANSACTION
                          if (shouldAbort(err)) return;
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
                          client.query(attrQuery, attrValue, (err, res) => {
                            if (shouldAbort(err)) return;
                            // ATTRIBUTION STATUS
                            const attrId = res.rows[0].attribution_id;
                            const attrStatusQuery = `
                            INSERT INTO 
                            attribution_status(attribution_id, current_status, submitted_by)
                            VALUES($1, $2, $3)
                            RETURNING status_id
                            `;
                            const attrStatusValue = [
                              attrId,
                              status,
                              username,
                            ];
                            client.query(attrStatusQuery, attrStatusValue, (err, res) => {
                              if (shouldAbort(err)) return;
                              // ATTRIBUTIONS ADD STATUS ID
                              const statusId = res.rows[0].status_id;
                              const attrUpdateQuery = `
                              UPDATE attributions
                              SET status_id = ($1)
                              WHERE attribution_id = ($2)
                              `;
                              const attrUpdateValue = [
                                statusId,
                                attrId,
                              ];
                              client.query(attrUpdateQuery, attrUpdateValue, (err, res) => {
                                if (shouldAbort(err)) return;
                                // End of author attributions
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                  // END AUTHORS

                  // BODIES TRANSACTIONS
                  bodies.forEach((body, i) => {
                    const bodyQuery = `
                    INSERT INTO
                    bodies(nomenclature)
                    VALUES($1)
                    RETURNING body_id
                    `;
                    const bodyValue = [
                      body.nomenclature,
                    ];
                    // Insert body
                    client.query(bodyQuery, bodyValue, (err, res) => {
                      if (shouldAbort(err)) return;
                      // BODY STATUS
                      const bodyId = res.rows[0].body_id;
                      const bodyStatusQuery = `
                      INSERT INTO
                      body_status(body_id, current_status, submitted_by)
                      VALUES($1, $2, $3)
                      RETURNING status_id
                      `;
                      const bodyStatusValue = [
                        bodyId,
                        status,
                        username,
                      ];
                      // ADD BODY STATUS ID
                      client.query(bodyStatusQuery, bodyStatusValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        const statusId = res.rows[0].status_id;
                        const bodyUpdateQuery = `
                        UPDATE bodies
                        SET status_id = ($1)
                        WHERE body_id = ($2)
                        `;
                        const bodyUpdateValue = [
                          statusId,
                          bodyId,
                        ];
                        client.query(bodyUpdateQuery, bodyUpdateValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          // end body update
                        });
                      });
                      // ADD GROUP
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
                      client.query(groupQuery, groupValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        const groupId = res.rows[0].group_id;
                        const groupStatusQuery = `
                        INSERT INTO
                        group_status(group_id, current_status, submitted_by)
                        VALUES($1, $2, $3)
                        RETURNING status_id
                        `;
                        const groupStatusValue = [
                          groupId,
                          status,
                          username,
                        ];
                        // Group status insert
                        client.query(groupStatusQuery, groupStatusValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          const statusId = res.rows[0].status_id;
                          const groupUpdateQuery = `
                          UPDATE groups
                          SET status_id = ($1)
                          WHERE group_id = ($2)
                          `;
                          const groupUpdateValue = [
                            statusId,
                            groupId,
                          ];
                          // Udate status ID for groups
                          client.query(groupUpdateQuery, groupUpdateValue, (err, res) => {
                            if (shouldAbort(err)) return;
                            // end groups
                          });
                        });
                      });
                      // END GROUPS
                      // BEGIN CLASSIFICATIONS
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
                        client.query(classQuery, classValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          const classId = res.rows[0].classification_id;
                          const classStatusQuery = `
                          INSERT INTO 
                          classification_status(classification_id, current_status, submitted_by)
                          VALUES($1, $2, $3)
                          RETURNING status_id
                          `;
                          const classStatusValue = [
                            classId,
                            status,
                            username,
                          ];
                          // INSERT CLASS STATUS
                          client.query(classStatusQuery, classStatusValue, (err, res) => {
                            if (shouldAbort(err)) return;
                            const statusId = res.rows[0].status_id;
                            const classUpdateQuery = `
                            UPDATE classifications
                            SET status_id = ($1)
                            WHERE classification_id = ($2)
                            `;
                            const classUpdateValue = [
                              statusId,
                              classId,
                            ];
                            client.query(classUpdateQuery, classUpdateValue, (err, res) => {
                              if (shouldAbort(err)) return;
                              // end classifications update
                            });
                          });
                        });
                      }
                      // END CLASSIFICATIONS

                      // START measurements FOR BODIES
                      body.measurements.forEach((measure, i) => {
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
                        if (measure.deviation == '') {
                          measure.deviation = 0.0;
                        }
                        if (measure.deviation < 0) {
                          measure.deviation = measure.deviation * -1;
                        }
                        const sigfigVal = parseInt(measure.sigfig, 10);
                        const measureVal = parseInt(measure.measurement, 10);
                        measure.element = String(measure.element).toLowerCase();
                        const measureValue = [
                          bodyId,
                          measure.element,
                          paperId,
                          measure.page,
                          measureVal,
                          parseFloat(measure.deviation),
                          measure.lessThan,
                          measure.unit,
                          measure.technique,
                          sigfigVal,
                        ];

                        // INSERT MEASUREMENT
                        client.query(measureQuery, measureValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          const elementId = res.rows[0].element_id;
                          const measureStatusQuery = `
                          INSERT INTO 
                          element_status(element_id, current_status, submitted_by)
                          VALUES($1, $2, $3)
                          RETURNING
                          status_id
                          `;
                          const measureStatusValue = [
                            elementId,
                            status,
                            username,
                          ];
                          // INSERT ELEMENT STATUS
                          client.query(measureStatusQuery, measureStatusValue, (err, res) => {
                            const statusId = res.rows[0].status_id;
                            const measureUpdateQuery = `
                            UPDATE element_entries
                            SET status_id = ($1)
                            WHERE element_id = ($2)
                            `;
                            const measureUpdateValue = [
                              statusId,
                              elementId,
                            ];
                            // Update with status id
                            client.query(measureUpdateQuery, measureUpdateValue, (err, res) => {
                              if (shouldAbort(err)) return;
                              // end element inserts
                            });
                          });
                        });
                      }); // END BODY MEASUREMENTS
                    });
                  });// END BODIES
                  // START NOTES
                  notes.forEach((note, i) => {
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
                    // INSERT NOTE
                    client.query(noteQuery, noteValue, (err, res) => {
                      if (shouldAbort(err)) return;
                      const noteId = res.rows[0].note_id;
                      const noteStatusQuery = `
                      INSERT INTO
                      note_status(note_id, current_status, submitted_by)
                      VALUES($1, $2, $3)
                      RETURNING status_id
                      `;
                      const noteStatusValue = [
                        noteId,
                        status,
                        username,
                      ];
                      // INSERT NOTE STATUS
                      client.query(noteStatusQuery, noteStatusValue, (err, res) => {
                        if (shouldAbort(err)) return;
                        const statusId = res.rows[0].status_id;
                        const noteUpdateQuery = `
                        UPDATE notes
                        SET status_id = ($1)
                        WHERE note_id = ($2)
                        `;
                        const noteUpdateValue = [
                          statusId,
                          noteId,
                        ];
                        // UPDATE NOTE STATUS REF
                        client.query(noteUpdateQuery, noteUpdateValue, (err, res) => {
                          if (shouldAbort(err)) return;
                          // end note update
                        });
                      });
                    });
                  }); // END NOTES
                  // COMMIT ALL CHANGES
                  client.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error committing transaction ', err.stack);
                    }
                    done(); // Release the client
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  /* eslint-enable max-len */
}

module.exports = {insertEntry};
