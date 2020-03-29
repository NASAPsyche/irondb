import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddComposition = props => {
    const [count, setCount] = useState(0);

    function change(index, addRemove) {
        var elementArray = document.getElementsByClassName("composition" + index);
        for (let i = 0; i < elementArray.length; i++) {
            elementArray[i].hidden = addRemove;
        }
    }

    function handleAddComp() {
        if (count === 0) {
            change(0, false);
            setCount(count + 1);
            props.changeMargin("firstComp", true);
            
        } else if (count === 1) {
            props.changeMargin("secondComp", true);
            change(1, false);
            setCount(count + 1);
            
        } else if (count === 2) {
            props.changeMargin("thirdComp", true);
            change(2, false); 
            setCount(count + 1);           
        }
    }

    function handleRemoveComp() {
        if (count === 1) { 
            change(0, true);
            setCount(count - 1);
            props.changeMargin("firstComp", false);
        } else if (count === 2) {
            change(1, true);
            setCount(count - 1);
            props.changeMargin("secondComp", false);
        } else if (count === 3) {
            change(2, true);
            setCount(count - 1);
            props.changeMargin("thirdComp", false);
        }
    }

    return(
        <React.Fragment>
            <div className="col-md-2">
                <h4 className="text-light">Composition:</h4>
            </div>
            <div className="col-md-1 mt-1">
                <FontAwesomeIcon onClick={handleAddComp} id="add-remove-comp" icon="plus-circle" className="text-warning fa-lg"/>
                <FontAwesomeIcon onClick={handleRemoveComp} id="add-remove-comp" icon="minus-circle" className="text-warning fa-lg"/>
            </div>
        </React.Fragment>
    );
}

export default AddComposition;