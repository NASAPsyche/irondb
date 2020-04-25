import React from "react"

const SecondRow = props => {
    return(
        <div id="journal" className="form-row" hidden={true}>
            <div className="form-group col-md-3 offset-md-1">
                <label className="sr-only" htmlFor="journalName"></label>
                <input type="text" name="journalName" id="journalName" className="form-control" placeholder="journal name" onChange={props.action} value={props.values.journalName} />
            </div>
            <div className="form-group col-md-2">
                <label className="sr-only" htmlFor="volume"></label>
                <input type="number" name="volume" id="volume" className="form-control" placeholder="volume" step="1" onChange={props.action} value={props.values.volume} />
            </div>
            <div className="form-group col-md-1">
                <label className="sr-only" htmlFor="pg"></label>
                <input type="text" name="pg" id="pg" className="form-control" placeholder="pg" onChange={props.action} value={props.values.pg} />
            </div>
            <div className="form-group col-md-1 year">
                <label className="sr-only" htmlFor="sign">published year modifier sign</label>
                <select className="form-control" name="sign" onChange={props.action} value={props.values.sign} >
                    <option value="equal" default>=</option>
                    <option value="less">&lt;</option>
                    <option value="greater">&gt;</option>
                </select>
            </div>
            <div className="form-group col-md-2 year" >
                <label className="sr-only" htmlFor="year">published year</label>
                <input type="number" className="form-control" name="year" id="year" min="1900" max="2019" step="1" placeholder="year" onChange={props.action} value={props.values.year} />
            </div>
        </div>
    );
}

export default SecondRow;