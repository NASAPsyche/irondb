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
        mod0: "",
        element0: "element",
        range0: "range",
        mod1: "",
        element1: "element",
        range1: "range",
        mod2: "",
        element2: "element",
        range2: "range"
    });

    function handleChange(event) {
        const {value, name} = event.target;

        setFormOptions(prevValue => {
            if (name === "name") {
                return {
                    name: value,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "title") {
                return {
                    name: prevValue.name,
                    title: value,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "author") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: value,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "group") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: value,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "journal_name") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: value,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "volume") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: value,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "page_number") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: value,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "pub_yr_sign") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: value,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "pub_year") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: value,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "element0_mod") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: value,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "element0") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: value,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "range0") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: value,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "element1_mod") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: value,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "element1") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: value,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "range1") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: value,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "element2_mod") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: value,
                    element2: prevValue.element2,
                    range2: prevValue.range2
                };
            } else if (name === "element2") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: value,
                    range2: prevValue.range2
                };
            } else if (name === "range2") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year,
                    mod0: prevValue.mod0,
                    element0: prevValue.element0,
                    range0: prevValue.range0,
                    mod1: prevValue.mod1,
                    element1: prevValue.element1,
                    range1: prevValue.range1,
                    mod2: prevValue.mod2,
                    element2: prevValue.element2,
                    range2: value
                };
            }
        })
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