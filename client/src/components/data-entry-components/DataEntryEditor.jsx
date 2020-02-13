import React, { useState, useEffects } from 'react';
import DataEntryForm from './DataEntryForm'

const DataEntryEditor = () => {
    const [meteoriteData, setData] = useState({
        data: null,
        elements: [
            {symbol: "Fe"},
            {symbol: "Co"},
            {symbol: "Ni"}
        ],
        techniques: [
            {abbreviation: "T1"},
            {abbreviation: "T2"}
        ],
    })

    return (
        <div class="container-fluid pt-1 pb-4" id="event-div">
            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="card text-center border-dark">
                    <div class="card-header bg-danger">
                        <h3 class="card-title text-warning">Editor</h3>
                    </div>

                    <div class="card-body tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="insert" role="tabpanel" aria-labelledby="insert-tab">

                            <form method="POST" action="/data-entry/insert" class="align-top mx-auto text-left" id="insert-form">
                                <DataEntryForm elements={meteoriteData.elements} techniques={meteoriteData.techniques} />
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataEntryEditor;