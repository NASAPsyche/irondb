import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FirstRow = props => {
    const [icon, setIcon] = useState("plus-square");

    function handleRowClick(event) {
        if (icon === "plus-square") {
            setIcon("minus-square");
            document.getElementById("journal").hidden = false;
            props.changeMargin("secondRow", true);
        } else if (icon === "minus-square") {
            setIcon("plus-square");
            document.getElementById("journal").hidden = true;
            props.changeMargin("secondRow", false);
        }  
    }

    return (
        <div className="form-row mb-2">
            <div className="col-md-3 offset-md-1">
                <label className="sr-only" htmlFor="name" ></label>
                <input type="text" name="name" id="name" className="form-control" placeholder="meteorite name" onChange={props.action} value={props.values.name}/>
            </div>
            <div className="col-md-2">
                <label className="sr-only" htmlFor="title"></label>
                <input type="text" name="title" id="title" className="form-control" placeholder="paper title" onChange={props.action} value={props.values.title}/>
            </div>
            <div className="col-md-2">
                <label className="sr-only" htmlFor="author"></label>
                <input type="text" name="author" id="author" className="form-control" placeholder="author" onChange={props.action} value={props.values.author}/>
            </div>
            <div className="col-md-2">
                <label className="sr-only" htmlFor="group">group</label>
                <select className="form-control" name="group" id="group" onChange={props.action} value={props.values.group}>
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