import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataEntryAlert from '../data-entry-components/DataEntryAlert';
import '../styles/DataEntry.scss';

const DataEntry = () => {

    const [[alert, alertType], setAlert] = useState(['Alert','error']);

    return (
        <div className="data-entry">
            <DataEntryAlert alert={alert} alertType={alertType} />
            <div class="container-fluid pt-3" id="content"></div>
            <div class="d-flex flex-row align-items-center justify-content-center mt-5 mb-2">
                <h3>Select a data entry approach below:</h3>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center pt-3">
                <button class="btn btn-danger btn-lg text-light" id="tool">With PDF</button>
                <h3 class="mx-4 mb-2"> - or - </h3>
                <a href="/data-entry/editor" class="btn btn-danger btn-lg">Without PDF</a>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center pt-3">
                <form method="POST" action="/data-entry" enctype="multipart/form-data" class="border border-dark align-top mx-auto bg p-3" id="pdf-form" hidden="true">
                    <div class="form-group">
                        <label for="filetoupload">Choose file to upload</label>
                        <input type="file" id="pdf" name="filetoupload"
                            accept=".pdf" />
                    </div>
                    <button type="submit" class="btn btn-secondary float-right">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default DataEntry;