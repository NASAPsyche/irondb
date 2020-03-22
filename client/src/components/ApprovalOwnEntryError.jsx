import React from 'react'

export default function ApprovalOwnEntryError() {
    return (
        <div className="mt-6">
            <div className="d-flex flex-row align-items-center justify-content-center">
                <h1>Can't approve own entries 🙅‍♀️</h1>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center">
                {/* TODO: CREATE DATABASE/UNAPPROVED PAGE */}
                <a href="/database/unapproved" className="btn btn-danger btn-lg mt-3">Back to unapproved</a>
            </div>
        </div>
    )
}
