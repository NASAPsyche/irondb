import React, { useState } from "react";

const ResetSearch = props => {
    // Resets state and text fields
    function handleReset() {
        props.setValues({
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
        })
        props.setFiltered(null);
    }
    // Filters table information based on user input
    function handleSearch() {
        console.log(props.values);
        console.log(props.data.Entries);
        // Initialize array to hold filtered data
        let filteredData = props.data.Entries;

        const meteorite_name = props.values.name.toLowerCase();
        const title = props.values.title.toLowerCase();
        const authors = props.values.author.toLowerCase().split(/,\s+|,/);
        const classification_group = props.values.group;
        const journal_name = props.values.journalName.toLowerCase();
        const volume = props.values.volume;
        const page_number = props.values.pg;
        const sign = props.values.sign;
        const published_year = props.values.year;
        if (meteorite_name !== "") {
            filteredData = filteredData.filter(entry => entry.meteorite_name.toLowerCase() === meteorite_name);     
        }
        if (title !== "") {
            filteredData.filter(entry => entry.title.toLowerCase() === title);
        }
        // TO DO
        // if (!authors.includes("")) {
        //     filteredData.filter(entry => {
        //             let a = entry.authors.toLowerCase().split(/,\s+|,/);
        //             console.log(a);
        //             for (let i = 0; i < authors.length; i++) {
        //                 return a.includes(authors[i])
        //             }
        //         });
        // }
        if (classification_group !== "group") {
            filteredData = filteredData.filter(entry => entry.classification_group == classification_group);
        }
        if (journal_name !== "") {
            filteredData = filteredData.filter(entry => entry.journal_name.toLowerCase() === journal_name);
        }
        if (volume !== "") {
            filteredData = filteredData.filter(entry => entry.volume === volume);
        }

        props.setFiltered(filteredData);
        console.log(filteredData);
    }

    return (
        <div className="row mt-1">
            <div className=" col-md-2 offset-md-6 col-sm-3 offset-sm-6">
                <a className="btn btn-outline-light btn-block mt-2" id="reset-btn" onClick={handleReset}>Reset</a>
            </div>
            <div className="col-md-2 col-sm-3">
                <button className="btn btn-outline-warning btn-block mt-2" onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
}
export default ResetSearch;