import React, { useState, useEffect, useRef } from 'react'

export default function Error({ error }) {
    if (error == undefined) {
        error = {
            code: "Error",
            message: "😱 looks like something broke, please try again."
        }
    }

    const [oldTitle] = useState(document.title)

    useEffect(() => {
        document.title = error.code
        return () => {
            document.tile = oldTitle
        }
    })

    return (
        <div className="container-fluid  mt-6">
            <h1 className="text-danger">Error: {error.message}</h1>
        </div>
    )
}
