import React, { useState } from "react";
import ExportDataButton from "./ExportDataButton";
import FirstRow from "./FirstRow"
import SecondRow from "./SecondRow"
import Composition from "./Composition"
import AddComposition from './AddComposition';
import ResetSearch from "./ResetSearch";
import '../styles/Database.scss'


const DatabaseSearch = props => {

    return (
        <div className="container-fluid fixed-top p-2 border-bottom border-dark" id="search-panel">
            <div className="row ml-2 mt-2">
                <ExportDataButton />
                <div className="col-sm-10">
                    <div id="search-form">
                        <FirstRow action={props.change} state={props.data} changeMargin={props.changeMargin} />
                        <SecondRow action={props.change} state={props.data} />
                        <div className="form-row mt-3">
                            <AddComposition changeMargin={props.changeMargin} />
                            <Composition className="composition0" rowNum="0" action={props.change} mod={props.data.mod0} element={props.data.element0} range={props.data.range0} />           
                        </div>
                        <div className="form-row mt-2">
                            <div className="offset-md-3"></div>
                            <Composition className="composition1" rowNum="1" action={props.change} mod={props.data.mod1} element={props.data.element1} range={props.data.range1} />
                        </div>
                        <div className="form-row mt-2">
                            <div className="offset-md-3"></div>
                            <Composition className="composition2" rowNum="2" action={props.change} mod={props.data.mod2} element={props.data.element2} range={props.data.range2} />
                        </div>
                        <ResetSearch setData={props.setData} data={props.data}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatabaseSearch;