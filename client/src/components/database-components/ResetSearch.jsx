import React, { useState } from "react";

const ResetSearch = props => {
    function handleReset() {
        var inputArray = document.getElementsByTagName("input");
        var selectArray = document.getElementsByTagName("select");
        for (let i = 0; i < inputArray.length; i++) {
            inputArray[i].value = "";
        }
        selectArray[0].value = "group";
        selectArray[1].value = "equal";
        for (let i = 2; i < selectArray.length; i += 3) {
            selectArray[i].value = "IN";
            selectArray[i + 1].value = "none"
            selectArray[i + 2].value = "range"
        }
        props.setState({
            name: "",
            title: "",
            author: "",
            group: "",
            journalName: "",
            volume: "",
            pg: "",
            sign: "",
            year: ""
        })
    }

    function handleSearch() {
        console.log(document.getElementById("group").value);
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