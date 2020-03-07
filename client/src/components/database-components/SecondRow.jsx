import React from "react"

const SecondRow = props => {
    return(
        <div id="journal" className="form-row" hidden={true}>
            <div className="form-group col-md-3 offset-md-1">
                <label className="sr-only" htmlFor="journal_name"></label>
                <input type="text" name="journal_name" id="journal_name" className="form-control" placeholder="journal name" onChange={props.action} value={props.state.jornalName} />
            </div>
            <div className="form-group col-md-2">
                <label className="sr-only" htmlFor="volume"></label>
                <input type="number" name="volume" id="volume" className="form-control" placeholder="volume" step="1" onChange={props.action} value={props.state.volume} />
            </div>
            <div className="form-group col-md-1">
                <label className="sr-only" htmlFor="page_number"></label>
                <input type="text" name="page_number" id="page_number" className="form-control" placeholder="pg" onChange={props.action} value={props.state.pg} />
            </div>
            <div className="form-group col-md-1 year">
                <label className="sr-only" htmlFor="pub_yr_sign">published year modifier sign</label>
                <select className="form-control" name="pub_yr_sign" onChange={props.action} value={props.state.sign} >
                    <option value="equal" default>=</option>
                    <option value="less">&lt;</option>
                    <option value="greater">&gt;</option>
                </select>
            </div>
            <div className="form-group col-md-2 year" >
                <label className="sr-only" htmlFor="pub_year">published year</label>
                <input type="number" className="form-control" name="pub_year" id="pub_year" min="1900" max="2019" step="1" placeholder="year" onChange={props.action} value={props.state.year} />
            </div>
        </div>
    );
}

export default SecondRow;