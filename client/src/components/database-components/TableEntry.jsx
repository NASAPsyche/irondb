import React from "react";

const TableEntry = props => { 
    const {meteorite_name, classification_group, technique, title, authors, 
        trace_elements, major_elements, minor_elements, page_number, journal_name, 
        volume, published_year} = props.object;

    return (
        <tr id="entry">
            <th>{meteorite_name}</th>
            <th>{classification_group}</th>
            <th>{technique}</th>
            <th>{major_elements !== null ? major_elements.map(entry => {
                let value = entry.split(",");
                let element = value[0].charAt(0).toUpperCase() + value[0].substring(1);
                let symbol = ": ";
                if (value[3] == "true") {symbol += "< ";}
                return <span>{element}{symbol}{value[1]}<br/></span>
                }) : null}</th>
            <th>{minor_elements !== null ? minor_elements.map(entry => {
                let value = entry.split(",");
                let element = value[0].charAt(0).toUpperCase() + value[0].substring(1);
                let symbol = ": ";
                if (value[3] == "true") {symbol += "< ";}
                return <span>{element}{symbol}{value[1]}<br/></span>
                }) : null}</th>
            <th>{trace_elements !== null ? trace_elements.map(entry => {
                let value = entry.split(",");
                let element = value[0].charAt(0).toUpperCase() + value[0].substring(1);
                let symbol = ": ";
                if (value[3] == "true") {symbol += "< ";}
                return <span>{element}{symbol}{value[1]}<br/></span>
                }) : null}</th>
            <th>{title}</th>
            <th>{authors}</th>
            <th>{page_number}</th> 
            <th>{journal_name}</th> 
            <th>{volume}</th>
            <th>{published_year}</th> 
        </tr>
    );
}

export default TableEntry;