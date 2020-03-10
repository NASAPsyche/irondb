import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddComposition = () => {
    var count = 0;

    function change(addRemove) {
        var elementArray = document.getElementsByClassName("composition" + count);
        for (let i = 0; i < elementArray.length; i++) {
            elementArray[i].hidden = addRemove;
        }
    }
    // 1: 17.2
    // 2: 54
    // 3: 54
    function handleAddComp() {
        const table = document.getElementById("table");
        if (count === 0) {
            change(false);
            
            count++;
        } else if (count === 1) {
            change(false);
            count++;
        } else if (count === 2) {
            change(false);
            count++;
        }
    }

    function handleRemoveComp() {
        if (count == 1) {
            count--;
            change(true);
        } else if (count == 2) {
            count--;
            change(true);
        } else if (count == 3) {
            count--; 
            change(true);
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