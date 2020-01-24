import React from 'react';

const DataEntryAlert = ({ alert, alertType }) => {
    if (alert !== "") {
        if (alertType === "error") {
            return (
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error: </strong>
                    {alert}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            );
        }
        else {
            return (
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success: </strong>
                    {alert}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            );
        }
    } else {
        return null
    }
}

export default DataEntryAlert;