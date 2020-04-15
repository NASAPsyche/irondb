import React, {useState, useEffect} from 'react';
import DatabaseSearch from '../database-components/DatabaseSearch';
import DatabaseTable from '../database-components/DatabaseTable';
import '../styles/Database.scss'

const Database = ({match, location}) => {
    // Values used to hold data found in DatabaseSearch component
    const [values, setValues] = useState({
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
    });
    // Holds current margin value
    const [margin, setMargin] = useState(250);
    // Holds data fetched from API
    const [data, setData] = useState({Entries: []});
    // Holds filtered data for table
    const [filtered, setFiltered] = useState(null);
    // Count used to control how many times page renders. Used for effect hook
    const [count, setCount] = useState(0);
    // Value used to control how many pixels the margin changes
    const expanded = [
        {
            name: "secondRow",
            value: 62
        },
        {
            name: "firstComp",
            value: 17.2
        },
        {
            name: "secondComp",
            value: 54
        },
        {
            name: "thirdComp",
            value: 54
        }];    

    // Effect hook used to fetch data, [count] parameter included to control how often
    // this effect is executed
    useEffect(() => {
        fetchData();
    }, [count])

    // Fetches all meteorite table data from API
    function fetchData() {
        console.log("fetching");
        fetch("/api/database", {
            method: 'GET',
            headers:{'Content-Type': 'application/json'}
        })
            .then(res => {
                res.text().then(info => {
                    // Parses JSON from API and sets data
                    setData(JSON.parse(info));

                    // Changes count to 0 to stop effect hook from executing more than twice
                    if (count == 0) {
                        setCount(1);
                    }
                })
            })
            .then(res => {
                if (location.search != "") {
                    // Build query string and change values based on query
                    let query = JSON.stringify(location.search);
                    let params = [];
                    let temp = values;
                    query = query.substring(2,query.length-1).split("&");
                    for (let i = 0; i < query.length; i++) {
                        params[i] = query[i].split("=");
                    }
                    if (params[0][1] != "undefined") {
                        temp.name = params[0][1];
                    }
                    if (params[1][1] != "undefined") {
                        temp.title = params[1][1];
                    }
                    if (params[2][1] != "undefined") {
                        temp.group = params[2][1];
                    }
                    if (params[3][1] != "undefined") {
                        temp.author = params[3][1];
                    }
                    // Make search
                    handleSearch();
                }  
            })
            .catch(function(error) {
                console.log(error);
            })
    }
    
    // Changes state when and input field is changed
    function handleChange(event) {
        const {value, name} = event.target;

        setValues(prevValue => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

    // Changes margin value based on what search options are expanded
    function handleMargin(name, expand) {
        if (name === "secondRow") {
            if (expand === true) {
                setMargin(`${parseInt(margin) + parseInt(expanded[0].value)}`);
            } else {
                setMargin(`${parseInt(margin) - parseInt(expanded[0].value)}`);
            }  
        } else if (name === "firstComp") {
            if (expand === true) {
                setMargin(`${parseInt(margin) + parseInt(expanded[1].value)}`);
            } else {
                setMargin(`${parseInt(margin) - parseInt(expanded[1].value)}`);
            } 
        } else if (name === "secondComp") {
            if (expand === true) {
                setMargin(`${parseInt(margin) + parseInt(expanded[2].value)}`);
            } else {
                setMargin(`${parseInt(margin) - parseInt(expanded[2].value)}`);
            } 
        } else if (name === "thirdComp") {
            if (expand === true) {
                setMargin(`${parseInt(margin) + parseInt(expanded[3].value)}`);
            } else {
                setMargin(`${parseInt(margin) - parseInt(expanded[3].value)}`);
            } 
        }
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
        // Initialize array to hold filtered data
        let filteredData = data.Entries;

        const meteorite_name = values.name.toLowerCase();
        const title = values.title.toLowerCase();
        const authors = values.author.toLowerCase();
        const classification_group = values.group;
        const journal_name = values.journalName.toLowerCase();
        const volume = values.volume;
        const page_number = values.pg;
        const sign = values.sign;
        const published_year = values.year;
        const element0 = values.element0;
        const element1 = values.element1;
        const element2 = values.element2;
        const mod0 = values.mod0;
        const mod1 = values.mod1;
        const mod2 = values.mod2;
        const range0 = values.range0;
        const range1 = values.range1;
        const range2 = values.range2;

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
        setFiltered(filteredData);
    }

    return (
        <div>
            <DatabaseSearch values={values} setValues={setValues} change={handleChange} changeMargin={handleMargin} setFiltered={setFiltered} handleSearch={handleSearch} />
            <DatabaseTable margin={margin} setMargin={setMargin} data={data} filtered={filtered} />
        </div>
    );
}

export default Database;