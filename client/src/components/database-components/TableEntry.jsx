import React from "react";

const TableEntry = props => {
    console.log(props.object);
    const {meteorite_name, classification_group, technique, title, authors, 
        trace_elements, page_number, journal_name, volume, published_year} = props.object;

    return (
        <tr id="entry">
            <th>{meteorite_name}</th>
            <th>{classification_group}</th>
            <th>{technique}</th>
            <th></th>
            <th></th>
            <th></th>
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