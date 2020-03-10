import React, { useState } from "react";
import ExportDataButton from "./ExportDataButton";
import FirstRow from "./FirstRow"
import SecondRow from "./SecondRow"
import Composition from "./Composition"
import AddComposition from './AddComposition';
import ResetSearch from "./ResetSearch";
import '../styles/Database.scss'


const DatabaseSearch = () => {
    const [formOptions, setFormOptions] = useState({
        name: "",
        title: "",
        author: "",
        group: "group",
        journalName: "",
        volume: "",
        pg: "",
        sign: "",
        year: "",
        mod0: "IN",
        element0: "element",
        range0: "range",
        mod1: "IN",
        element1: "element",
        range1: "range",
        mod2: "IN",
        element2: "element",
        range2: "range"
    });

    function handleChange(event) {
        const {value, name} = event.target;

        setFormOptions(prevValue => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

    return (
        <div className="container-fluid fixed-top p-2 border-bottom border-dark" id="search-panel">
            <div className="row ml-2 mt-2">
                <ExportDataButton />
                <div className="col-sm-10">
                    <div id="search-form">
                        <FirstRow action={handleChange} state={formOptions} />
                        <SecondRow action={handleChange} state={formOptions} />
                        <div className="form-row mt-3">
                            <AddComposition />
                            <Composition className="composition0" rowNum="0" action={handleChange} mod={formOptions.mod0} element={formOptions.element0} range={formOptions.range0} />           
                        </div>
                        <div className="form-row mt-2">
                            <div className="offset-md-3"></div>
                            <Composition className="composition1" rowNum="1" action={handleChange} mod={formOptions.mod1} element={formOptions.element1} range={formOptions.range1} />
                        </div>
                        <div className="form-row mt-2">
                            <div className="offset-md-3"></div>
                            <Composition className="composition2" rowNum="2" action={handleChange} mod={formOptions.mod2} element={formOptions.element2} range={formOptions.range2} />
                        </div>
                        <ResetSearch setState={setFormOptions} state={formOptions}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatabaseSearch;