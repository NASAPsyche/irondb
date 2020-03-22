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
import DataEntryPDF from '../data-entry-components/DataEntryPDF'
import '../styles/DataEntry.scss';

const DataEntry = () => {

    let { path, url } = useRouteMatch();

    const [[alert, alertType], setAlert] = useState(['Alert', 'success']);

    return (
        <div className="data-entry">
            <DataEntryAlert alert={alert} alertType={alertType} />
            <div className="container-fluid pt-3" id="content"></div>
            <div className="d-flex flex-row align-items-center justify-content-center mt-5 mb-2">
                <h3>Select a data entry approach below:</h3>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pt-3">
                <Link
                    to={`${url}/pdf`}
                    className="btn btn-danger btn-lg text-light"
                    id="tool"
                >
                    With PDF
                </Link>
                <h3 className="mx-4 mb-2"> - or - </h3>
                <Link
                    to={`${url}/editor`}
                    className="btn btn-danger btn-lg"
                >
                    Without PDF
                </Link>
            </div>

            <Switch>
                <Route path={`${path}/editor`}>
                    <DataEntryEditor />
                </Route>
                <Route path={`${path}/pdf`}>
                    <DataEntryPDF />
                </Route>
            </Switch>
        </div>
    )
}

export default DataEntry;
