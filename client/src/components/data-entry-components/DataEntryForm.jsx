import React from 'react';
import BasicAttributesFormGroup from './BasicAttributesFormGroup';
import MeteoriteFormGroup from './MeteoriteFormGroup';
import NotesFormGroup from './NotesFormGroup';

const DataEntryForm = ({ elements, techniques }) => (
    <React.Fragment>
        <BasicAttributesFormGroup />
        <MeteoriteFormGroup elements={elements} techniques={techniques} />
        <NotesFormGroup />
        <button type="submit" className="btn btn-warning mt-2 float-right" disabled="true" title="Validate or override to enable" id="submit-btn">Submit</button>
        <button type="button" className="btn btn-danger mt-2 mr-3 float-right" id="validate-btn">Validate</button>
        <button type="button" className="btn btn-danger mt-2 mr-3 float-right" id="override-btn">Override Validation</button>
        <button type="button" className="btn btn-secondary mt-2 mr-2 float-left" id="save-btn">Save</button>
    </React.Fragment>
);

export default DataEntryForm;