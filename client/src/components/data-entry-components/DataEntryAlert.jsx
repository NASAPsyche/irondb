import React, { useState } from 'react';

const DataEntryAlert = ({ alert, alertType }) => {

    const [hidden, setHidden] = useState(false);

    if (alert !== "") {
        if (alertType === "error") {
            if (!hidden) {
                return (
                    <div class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                        <strong>Error: </strong>
                        {alert}
                        <button type="button" class="close" aria-label="Close" onClick={() => setHidden(true)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                );
            } else {
                return null;
            }
        }
        else {
            if (!hidden) {
                return (
                    <div class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                        <strong>Success: </strong>
                        {alert}
                        <button type="button" class="close" aria-label="Close" onClick={() => setHidden(true)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                );
            } else {
                return null;
            }
        }
    } else {
        return null;
    }
}

export default DataEntryAlert;