import React from "react"

import "../styles/loader.css"

export const Loader = () => {

    return (
        <>
            <div className="loader-container">
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                <p className="loading">Loading...</p>
            </div>
        </>
    )
}