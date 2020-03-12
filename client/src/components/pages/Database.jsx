import React, {useState} from 'react';
import DatabaseSearch from '../database-components/DatabaseSearch';
import DatabaseTable from '../database-components/DatabaseTable';
import '../styles/Database.scss'

const Database = () => {
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

    const [margin, setMargin] = useState(250);

    function handleChange(event) {
        const {value, name} = event.target;

        setFormOptions(prevValue => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

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
            <DatabaseSearch data={formOptions} setData={setFormOptions} change={handleChange} changeMargin={handleMargin} />
            <DatabaseTable margin={margin} setMargin={setMargin} />
        </div>
    );
}

export default Database;