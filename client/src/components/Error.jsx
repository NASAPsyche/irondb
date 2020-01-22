import React from 'react'

export default function Error({ error }) {
    return (
        <div class="container-fluid  err-msg">
            <h1 class="text-danger">Error: {error}</h1>
        </div>
    )
}
