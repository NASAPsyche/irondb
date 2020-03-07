import React from 'react';
import ExportDataButton from "./ExportDataButton";
import FirstRow from "./FirstRow"
import SecondRow from "./SecondRow"

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../styles/Database.scss'

const DatabaseSearch = () => {
    return (
        <div className="container-fluid fixed-top p-2 border-bottom border-dark" id="search-panel">
            <div className="row ml-2 mt-2">
                <ExportDataButton />
                <div className="col-sm-10">
                    <div id="search-form">
                        <FirstRow />
                        <SecondRow />
                        <div class="form-row mt-3" id="composition0">
                            <div class="col-md-2">
                                <h4 class="text-light">Composition:</h4>
                                <FontAwesomeIcon icon={faHome} />
                            </div>
                            <div class="col-md-1 mt-1">
                                <i class="fas fa-plus-circle fa-lg text-warning show-element" title="Add element constraint"></i>
                                <i class="fas fa-minus-circle fa-lg text-warning hide-element" title="Remove element constraint"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatabaseSearch;