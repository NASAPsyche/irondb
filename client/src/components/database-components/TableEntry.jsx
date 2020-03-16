import React from "react";

const TableEntry = props => {
    const {name, group, technique, trace, title, author, pg, journal, volume, year} = props.object;

    return (
        <tr id="entry">
            <th>{name}</th>
            <th>{group}</th>
            <th>{technique}</th>
            <th>Major Elements (wt%)</th>
            <th>Minor Elements (ppm)</th>
            <th>Trace Elements (ppb)</th>
            <th>{title}</th>
            <th>{author}</th>
            <th>{pg}</th> 
            <th>{journal}</th> 
            <th>{volume}</th>
            <th>{year}</th> 
        </tr>
    );
}

export default TableEntry;