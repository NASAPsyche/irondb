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
        group: "",
        journalName: "",
        volume: "",
        pg: "",
        sign: "",
        year: ""
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
                    year: prevValue.year
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
                    year: prevValue.year
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
                    year: prevValue.year
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
                    year: prevValue.year
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
                    year: prevValue.year
                };
            }
            else if (name === "volume") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: value,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: prevValue.year
                };
            }
            else if (name === "page_number") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: value,
                    sign: prevValue.sign,
                    year: prevValue.year
                };
            }
            else if (name === "pub_yr_sign") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: value,
                    year: prevValue.year
                };
            }
            else if (name === "pub_year") {
                return {
                    name: prevValue.name,
                    title: prevValue.title,
                    author: prevValue.author,
                    group: prevValue.group,
                    journalName: prevValue.journalName,
                    volume: prevValue.volume,
                    pg: prevValue.pg,
                    sign: prevValue.sign,
                    year: value
                };
            }
        })
        console.log(formOptions);
    }

    return (
        <div className="container-fluid fixed-top p-2 border-bottom border-dark" id="search-panel">
            <div className="row ml-2 mt-2">
                <ExportDataButton />
                <div className="col-sm-10">
                    <div id="search-form">
                        <FirstRow action={handleChange} state={formOptions} />
                        <SecondRow action={handleChange} state={formOptions}/>
                        <div className="form-row mt-3">
                            <AddComposition />
                            <Composition className="composition0"/>           
                        </div>
                        <div className="form-row mt-2">
                            <div className="offset-md-3"></div>
                            <Composition className="composition1"/>
                        </div>
                        <div className="form-row mt-2">
                            <div className="offset-md-3"></div>
                            <Composition className="composition2"/>
                        </div>
                        <ResetSearch />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatabaseSearch;