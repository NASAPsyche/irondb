import React from "react";
import elements from "./Elements"
import ElementOption from "./ElementOption"

const Composition = props => {
    function createOption(option) {
        return <ElementOption value={option.symbol}/>
    }
    return(
        <React.Fragment>
            <div className={`form-group col-md-1 hide-target ${props.className}`} hidden={true}>
                <label className="sr-only" htmlFor={`element${props.rowNum}_mod`}>Element modifier</label>
                <select className="form-control" name={`element${props.rowNum}_mod`} title="Select whether to search for an element that appears in the data or not" onChange={props.action}>
                    <option value="IN" default>IN</option>
                    <option value="NOT">NOT</option>
                </select>
            </div>
            <div className={`form-group col-sm-3 element hide-target ${props.className}`} hidden={true}>
                <label className="sr-only" htmlFor={`element${props.rowNum}`}>element</label>
                <select className="form-control custom-select element" name={`element${props.rowNum}`} id={`element${props.rowNum}`} onChange={props.action}>
                    <option disabled value="element">element</option>
                    {elements.map(createOption)};      
                </select>
            </div>
            <div className={`form-group col-sm-3 hide-target ${props.className}`} hidden={true}>
                <label className="sr-only" htmlFor={`range${props.rowNum}`}>Range</label>
                <select className="form-control" name={`range${props.rowNum}`} onChange={props.action}>
                    <option disabled selected value="range">Range</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="trace">Trace</option>
                </select>
            </div>
        </React.Fragment>
    );
}

export default Composition;