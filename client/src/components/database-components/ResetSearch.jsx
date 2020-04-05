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
            sign: "equal",
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
    
    // Searches through major, minor, and/or trace elements for a specific elements
    function searchElement(element, range, mod, ...array) {
        if (element !== "element") {
            array = array[0].filter(entry => {
                if (range === "range") {
                    // Make an array of all major, minor, and trace elements
                    let elementList = [];
                    if (entry.major_elements !== null) {
                        elementList = [...elementList, ...entry.major_elements];
                    }
                    if (entry.minor_elements !== null) {
                        elementList = [...elementList, ...entry.minor_elements];
                    }
                    if (entry.trace_elements !== null) {
                        elementList = [...elementList, ...entry.trace_elements];
                    }
                    // Search through array for specific element
                    for (let i = 0; i < elementList.length; i++) {
                        let value = elementList[i].split(",");
                        if (value[0].toLowerCase() === element.toLowerCase()) {
                            return true;
                        }
                    }
                } else if (range === "major") {
                    if (mod === "IN") {
                        if (entry.major_elements !== null) {
                            for (let i = 0; i < entry.major_elements.length; i++) {
                                let value = entry.major_elements[i].split(",");
                                if (value[0].toLowerCase() === element.toLowerCase()) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        let elementList = [];
                        if (entry.minor_elements !== null) {
                            elementList = [...elementList, ...entry.minor_elements];
                        }
                        if (entry.trace_elements !== null) {
                            elementList = [...elementList, ...entry.trace_elements];
                        }
                        for (let i = 0; i < elementList.length; i++) {
                            let value = elementList[i].split(",");
                            if (value[0].toLowerCase() === element.toLowerCase()) {
                                return true;
                            }
                        }
                    }
                } else if (range === "minor") {
                    if (mod === "IN") {
                        if (entry.minor_elements !== null) {
                            for (let i = 0; i < entry.minor_elements.length; i++) {
                                let value = entry.minor_elements[i].split(",");
                                if (value[0].toLowerCase() === element.toLowerCase()) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        let elementList = [];
                        if (entry.major_elements !== null) {
                            elementList = [...elementList, ...entry.major_elements];
                        }
                        if (entry.trace_elements !== null) {
                            elementList = [...elementList, ...entry.trace_elements];
                        }
                        for (let i = 0; i < elementList.length; i++) {
                            let value = elementList[i].split(",");
                            if (value[0].toLowerCase() === element.toLowerCase()) {
                                return true;
                            }
                        }
                    }
                } else if (range === "trace") {
                    if (mod === "IN") {
                        if (entry.trace_elements !== null) {
                            for (let i = 0; i < entry.trace_elements.length; i++) {
                                let value = entry.trace_elements[i].split(",");
                                if (value[0].toLowerCase() === element.toLowerCase()) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        let elementList = [];
                        if (entry.minor_elements !== null) {
                            elementList = [...elementList, ...entry.minor_elements];
                        }
                        if (entry.major_elements !== null) {
                            elementList = [...elementList, ...entry.major_elements];
                        }
                        for (let i = 0; i < elementList.length; i++) {
                            let value = elementList[i].split(",");
                            if (value[0].toLowerCase() === element.toLowerCase()) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            });
            return array;
        }
    }

    // Filters table information based on user input
    function handleSearch() {
        console.log(props.values);
        //console.log(props.data.Entries);
        // Initialize array to hold filtered data
        let filteredData = props.data.Entries;

        const meteorite_name = props.values.name.toLowerCase();
        const title = props.values.title.toLowerCase();
        const authors = props.values.author.toLowerCase();
        const classification_group = props.values.group;
        const journal_name = props.values.journalName.toLowerCase();
        const volume = props.values.volume;
        const page_number = props.values.pg;
        const sign = props.values.sign;
        const published_year = props.values.year;
        const element0 = props.values.element0;
        const element1 = props.values.element1;
        const element2 = props.values.element2;
        const mod0 = props.values.mod0;
        const mod1 = props.values.mod1;
        const mod2 = props.values.mod2;
        const range0 = props.values.range0;
        const range1 = props.values.range1;
        const range2 = props.values.range2;

        // First row search criteria
        if (meteorite_name !== "") {
            filteredData = filteredData.filter(entry => entry.meteorite_name.toLowerCase() === meteorite_name);     
        }
        if (title !== "") {
            filteredData.filter(entry => entry.title.toLowerCase() === title);
        }
        if (authors !== "") {
            let authorList = authors.split(/,\s+|,/);
            filteredData = filteredData.filter(entry => {
                var found = false;
                var entryList = entry.authors.toLowerCase().split(/,\s+|,/);
                // Compares every author searched for against every author within each entry
                for (let i = 0; i < entryList.length; i++) {
                    for (let k = 0; k < authorList.length; k++) {
                        if (entryList[i].replace(/\s+/g, "") === authorList[k].replace(/\s+/g, "")) {
                            found = true;
                        }
                    }
                }
                return found;
            })
        }
        if (classification_group !== "group") {
            filteredData = filteredData.filter(entry => entry.classification_group == classification_group);
        }
        // Second row search criteria
        if (journal_name !== "") {
            filteredData = filteredData.filter(entry => entry.journal_name.toLowerCase() === journal_name);
        }
        if (volume !== "") {
            filteredData = filteredData.filter(entry => entry.volume === volume);
        }
        if (page_number !== "") {
            filteredData= filteredData.filter(entry => entry.page_number == page_number);
        }
        if (published_year !== "") {
            if (sign === "equal") {
                filteredData= filteredData.filter(entry => entry.published_year == published_year);
            } else if (sign === "less") {
                filteredData= filteredData.filter(entry => entry.published_year < published_year);
            } else {
                filteredData= filteredData.filter(entry => entry.published_year > published_year);
            }
        }
        // First composition row search criteria
        if (element0 !== "element") {
            filteredData = searchElement(element0, range0, mod0, filteredData);
        }
        // Second composition row search criteria
        if (element1 !== "element") {
            filteredData = searchElement(element1, range1, mod1, filteredData);
        }
        // Third composition row search criteria
        if (element2 !== "element") {
            filteredData = searchElement(element2, range2, mod2, filteredData);
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