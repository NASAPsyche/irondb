import React from 'react';
import TableEntry from "./TableEntry";
import '../styles/Database.scss';

const DatabaseTable = props => {
      const obj = [{
          name: "Guanaco",
          group: "IIG",
          technique: "RNAA",
          trace: "Ge: 71000",
          title: "Meteorites in Space",
          author: "John T. Wasson",
          pg: 4880,
          journal: "Geochimica et Cosmochimica Acta",
          volume: 73,
          year: 2009
        }, {
          name: "Tombigbee R.",
          group: "IIG",
          technique: "",
          trace: "",
          title: "The IIG iron meteorites: Probable formation in the IIAB core",
          author: "John T. Wasson",
          pg: 4880,
          journal: "Geochimica et Cosmochimica Acta",
          volume: 73,
          year: 2009
      }]

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
                      {obj.map(entry => {
                        return <TableEntry object={entry} />
                      })}
                  </tbody>
              </table>
          </div>   
      );
}

export default DatabaseTable;