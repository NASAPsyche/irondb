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
            expanded: false,
            value: 62
        },
        {
            name: "firstComp",
            expanded: false,
            value: 17.2
        },
        {
            name: "secondComp",
            expanded: false,
            value: 54
        },
        {
            name: "thirdComp",
            expanded: false,
            value: 54
        }
    ]);

    const [margin, setMargin] = useState("300");

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
        <div>
            <DatabaseSearch data={formOptions} setData={setFormOptions} change={handleChange} />
            <DatabaseTable margin={margin} setMargin={setMargin} />       
        </div>
    );
}

export default Database;