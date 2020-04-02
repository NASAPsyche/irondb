import React, {useState, useEffect} from 'react';
import DatabaseSearch from '../database-components/DatabaseSearch';
import DatabaseTable from '../database-components/DatabaseTable';
import '../styles/Database.scss'

const Database = () => {
    // Values used to hold data found in DatabaseSearch component
    const [formData, setFormData] = useState({
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
    // Value used to control how many pixels the margin changes
    const [expanded, setExpanded] = useState([
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
        }
    ]);
    // Holds current margin value
    const [margin, setMargin] = useState(250);
    // Holds data fetched from API
    const [data, setData] = useState({Entries: []});
    // Count used to control how many times page renders. Used for effect hook
    const [count, setCount] = useState(0);

    // Effect hook used to fetch data, [count] parameter included to control how often
    // this effect is executed
    useEffect(() => {
        fetchData();
    }, [count])

    // Fetches all meteorite table data from API
    function fetchData() {
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
            .catch(function(error) {
                console.log(error);
            })  
    }
    
    // Changes state when and input field is changed
    function handleChange(event) {
        const {value, name} = event.target;

        setFormData(prevValue => {
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

    return (
        <div>
            <DatabaseSearch data={formData} setData={setFormData} change={handleChange} changeMargin={handleMargin} values={data} setValues={setData} />
            <DatabaseTable margin={margin} setMargin={setMargin} values={data} />
        </div>
    );
}

export default Database;