import React, { useState } from "react";

const ResetSearch = props => {
    function handleReset() {
        props.setState({
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
        })
    }

    function handleSearch() {
        console.log(props.state);
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