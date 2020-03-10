import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FirstRow = props => {
    const [icon, setIcon] = useState("plus-square");
    var margin = 300;

    function handleRowClick(event) {
        const table = document.getElementById("table");

        if (icon === "plus-square") {
            setIcon("minus-square");
            document.getElementById("journal").hidden = false;
            margin += 62;
            console.log(margin);
        } else if (icon === "minus-square") {
            setIcon("plus-square");
            document.getElementById("journal").hidden = true;
            console.log(margin);
        }  
        table.style.marginTop = `${margin}px`;  
    }

    return (
        <div className="form-row mb-2">
            <div className="col-md-3 offset-md-1">
                <label className="sr-only" htmlFor="name" ></label>
                <input type="text" name="name" id="name" className="form-control" placeholder="meteorite name" onChange={props.action} value={props.state.name}/>
            </div>
            <div className="col-md-2">
                <label className="sr-only" htmlFor="title"></label>
                <input type="text" name="title" id="title" className="form-control" placeholder="paper title" onChange={props.action} value={props.state.title}/>
            </div>
            <div className="col-md-2">
                <label className="sr-only" htmlFor="author"></label>
                <input type="text" name="author" id="author" className="form-control" placeholder="author" onChange={props.action} value={props.state.author}/>
            </div>
            <div className="col-md-2">
                <label className="sr-only" htmlFor="group">group</label>
                <select className="form-control" name="group" id="group" onChange={props.action} value={props.state.group}>
                    <option value="group" disabled selected>group</option>
                    <option value="IAB">IAB</option>
                    <option value="IC">IC</option>
                    <option value="IIAB">IIAB</option>
                    <option value="IIG">IIG</option>
                    <option value="IIIAB">IIIAB</option>
                    <option value="IIICD">IIICD</option>
                    <option value="noGroup">No Group</option>
                </select>  
            </div>
            <FontAwesomeIcon onClick={handleRowClick} id="add-remove-row" icon={icon} className="text-warning fa-lg"/>
        </div>
    );
}

export default FirstRow;