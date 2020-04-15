import React from "react";
import '../styles/Database.scss'

const ExportDataButton = () => {
    return (
        <div className="col-sm-2 align-self-end">
            <div className="d-flex flex-row">
                <div className="d-flex flex-row">
                    <form action="/database/export" method="GET" id="export-form">
                        <button className="btn btn-outline-light btn-block mt-2" type="submit">Export Data</button>
                    </form>
                </div>
            </div>
        </div>      
    );
}

export default ExportDataButton;