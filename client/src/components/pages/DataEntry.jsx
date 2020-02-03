import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import DataEntryAlert from '../data-entry-components/DataEntryAlert';
import DataEntryEditor from '../data-entry-components/DataEntryEditor';
import '../styles/DataEntry.scss';

const DataEntry = () => {

    let { path, url } = useRouteMatch();

    const [[alert, alertType], setAlert] = useState(['Alert', 'success']);

    return (
        <div className="data-entry">
            <DataEntryAlert alert={alert} alertType={alertType} />
            <div class="container-fluid pt-3" id="content"></div>
            <div class="d-flex flex-row align-items-center justify-content-center mt-5 mb-2">
                <h3>Select a data entry approach below:</h3>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center pt-3">
                <button
                    class="btn btn-danger btn-lg text-light"
                    id="tool"
                    onClick={() => document.getElementById("pdf-form").removeAttribute("hidden")}
                >
                    With PDF
                </button>
                <h3 class="mx-4 mb-2"> - or - </h3>
                <Link 
                    to={`${url}/editor`}
                    class="btn btn-danger btn-lg" 
                    onClick={() => document.getElementById("pdf-form").setAttribute("hidden", true)}>Without PDF</Link>
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

            <Switch>
                <Route path={`${path}/editor`}>
                    <DataEntryEditor />
                </Route>
            </Switch>
        </div>
    )
}

export default DataEntry;