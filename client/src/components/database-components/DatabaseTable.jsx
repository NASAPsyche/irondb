import React, { useState } from 'react';
import TableEntry from "./TableEntry";
import '../styles/Database.scss';

const DatabaseTable = props => {
        return (
            <div class="container-fluid p-0 pb-5" id="table" style={{marginTop: `${props.margin}px`}}>
                <table class="table table-striped table-bordered table-hover ">
                    <thead class="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Group</th>
                            <th>Measurement Technique</th>
                            <th>Major Elements (wt%)</th>
                            <th>Minor Elements (ppm)</th>
                            <th>Trace Elements (ppb)</th>
                            <th>Title</th>
                            <th>Authors</th>
                            <th>Pg.#</th> 
                            <th>Journal</th> 
                            <th>Volume</th>
                            <th>Year Published</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {props.filtered !== null ? props.filtered.map(entry => {
                            return <TableEntry object={entry} />
                        }) : props.data.Entries.map(entry => {
                            return <TableEntry object={entry} />
                        })}
                        
                    </tbody>
                </table>
            </div>   
      );
}

export default DatabaseTable;