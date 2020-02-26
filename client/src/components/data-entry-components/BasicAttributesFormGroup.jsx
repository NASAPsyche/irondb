import React from 'react';


//Component of basic attribute form elements for editor
const BasicAttributesFormGroup = () => (
    <React.Fragment>
        <div className="main-alert-target"></div>
        <h5 className="pt-1 pr-1 mr-2"><strong>Basic Information</strong></h5>
        <div className="form-row">
            <div className="form-group col-md-8">
                <label for="paperTitle">Paper Title</label>
                <input type="text" className="form-control" id="paperTitle" name="paperTitle" required="true" placeholder="required" />
            </div>
            <div className="form-group col-md-4">
                <label for="doi">DOI</label>
                <input type="text" className="form-control" id="doi" name="doi" placeholder="optional" />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group col-md-7">
                <label for="journalName">Journal Name</label>
                <input type="text" className="form-control" id="journalName" name="journalName" required="true" placeholder="required" />
            </div>
            <div className="form-group offset-md-1 col-md-4">
                <label for="pub_year">Year Published</label>
                <input type="number" className="form-control" id="pubYear" name="pubYear" required="true" min="1900" Max="2100" step="1" />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group col-md-3">
                <label for="volume">Volume</label>
                <input type="text" className="form-control" id="volume" name="volume" required="true" placeholder="required" />
            </div>
            <div className="form-group offset-md-1 col-md-3">
                <label for="issue">Issue</label>
                <input type="text" className="form-control" id="issue" name="issue" placeholder="optional" />
            </div>
            <div className="form-group offset-md-1 col-md-3">
                <label for="series">ISSN</label>
                <input type="text" className="form-control" id="series" name="series" placeholder="optional" />
            </div>
        </div>

        <div className="form-row author-header">
            <h6 className="pt-1 mr-2">Author(s)</h6>
            <i className="fas fa-plus-circle fa-lg add-author mt-2 text-danger"></i>
        </div>

        <div className="form-row">
            <div className="col-md-1">
                <i className="far fa-times-circle fa-lg remove remove-inline pt-4 text-danger" title="Press to remove author."></i>
            </div>
            <div className="form-group col-md-4">
                <label for="primaryName">Last Name</label>
                <input type="text" className="form-control" id="primaryName0" name="primaryName0" required="true" placeholder="required" />
            </div>
            <div className="form-group col-md-4">
                <label for="firstName">First Name</label>
                <input type="text" className="form-control" id="firstName0" name="firstName0" required="true" placeholder="required" />
            </div>
            <div className="form-group col-md-3">
                <label for="middleName">Middle Initial</label>
                <input type="text" className="form-control" id="middleName0" name="middleName0" placeholder="optional" />
            </div>
        </div>

        <div className="authors-end"></div>
    </React.Fragment>
);

export default BasicAttributesFormGroup;