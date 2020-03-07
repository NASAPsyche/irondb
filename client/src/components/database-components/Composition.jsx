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
                <label className="sr-only" htmlFor="element0_mod">Element modifier</label>
                <select className="form-control" name="element0_mod" title="Select whether to search for an element that appears in the data or not">
                    <option value="IN" default>IN</option>
                    <option value="NOT">NOT</option>
                </select>
            </div>
            <div className={`form-group col-sm-3 element hide-target ${props.className}`} hidden={true}>
                <label className="sr-only" htmlFor="element0">element</label>
                <select className="form-control custom-select element" name="element0" multiple id="element0">
                    <option disabled value="element">element</option>
                    {elements.map(createOption)};      
                </select>
            </div>
            <div className={`form-group col-sm-3 hide-target ${props.className}`} hidden={true}>
                <label className="sr-only" htmlFor="range0">Range</label>
                <select className="form-control" name="range0">
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