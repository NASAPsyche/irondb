import React from "react"

const SecondRow = () => {
    return(
        <div className="form-row journal">
            <div className="form-group col-md-3 offset-md-1">
                <label className="sr-only" for="journal_name"></label>
                <input type="text" name="journal_name" id="journal_name" className="form-control" placeholder="journal name" />
            </div>
            <div className="form-group col-md-2">
                <label className="sr-only" for="volume"></label>
                <input type="number" name="volume" id="volume" className="form-control" placeholder="volume" step="1" />
            </div>
            <div className="form-group col-md-1">
                <label className="sr-only" for="page_number"></label>
                <input type="text" name="page_number" id="page_number" className="form-control" placeholder="pg" />
            </div>
            <div className="form-group col-md-1 year">
                <label className="sr-only" for="pub_yr_sign">published year modifier sign</label>
                <select className="form-control" name="pub_yr_sign" >
                    <option value="equal" default>=</option>
                    <option value="less">&lt;</option>
                    <option value="greater">&gt;</option>
                </select>
            </div>
            <div className="form-group col-md-2 year" >
                <label className="sr-only" for="pub_year">published year</label>
                <input type="number" className="form-control" name="pub_year" id="pub_year" min="1900" Max="2019" step="1" placeholder="year" />
            </div>
        </div>
    );
}

export default SecondRow;