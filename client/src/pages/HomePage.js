import React, { useContext } from "react"

import { AuthContext } from "../context/AuthContext"

import { NotesList } from "../components/notesList"

import "../styles/homePage.css"

export const HomePage = () => {

    const auth = useContext(AuthContext)

    return (
        <>
            <div className="homepage-container">
                <h2>Hello, {auth.userName} !</h2>
                <div className="notes-container">
                <NotesList auth={auth} />
                </div>
            </div>
        </>
    )
}