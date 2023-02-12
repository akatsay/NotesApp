import { toast, Slide } from "react-toastify"
import React, { useState, useEffect, useCallback } from "react"

import {useHttp} from "../hooks/http.hook"

import { CreateArea } from "../components/createArea"
import { Note } from "../components/note"

import "../styles/notesList.css"

export const NotesList = ({auth}) => {

    const {loading, request, error, clearError} = useHttp()

    const [notes, setNotes] = useState([])

    const fetchNotes = useCallback(async () => {
        const data = await request("api/notes/getNotes", "get", null, {
            Authorization: `Bearer ${auth.token}`
        })
      setNotes(data)
    }, [auth.token, request, setNotes])

    const addNote = async (newNote) => {
        try {
            await request("api/notes/newNote", "post", {...newNote}, {
                Authorization: `Bearer ${auth.token}`
            })
        fetchNotes()
        } catch (e) {}
    }

    const updateNote = async (updatedNote, id) => {
        try {
            await request("api/notes/updateNote", "put", {...updatedNote, id}, {
                Authorization: `Bearer ${auth.token}`
            })
        fetchNotes()
        } catch (e) {}
    }

    const deleteNote = async (id) => {
        try {
            await request("api/notes/deleteNote", "delete", {id}, {
                Authorization: `Bearer ${auth.token}`
            })
        fetchNotes()
        } catch (e) {}
    }


    useEffect(() => {
        fetchNotes()
    }, [fetchNotes])

    useEffect(() => {
        if (error) {
            if (error.message === "No auth") {
                auth.logout()
                toast.error("Session expired", {
                    style: {backgroundColor: "#555", color: "white"},
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                    });

                    clearError()
            
            } else {

                toast.error(error.message, {
                    style: {backgroundColor: "#555", color: "white"},
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                    });

                    clearError()
            }
        }
        }, [auth, error, clearError, notes])

    return (
        <>
            <CreateArea 
                onAdd = {addNote} 
                load = {loading}
                />
            {notes.map((noteItem) => (
                <Note
                    key = {noteItem._id}
                    id = {noteItem._id}
                    title = {noteItem.title}
                    content = {noteItem.content}
                    onDelete = {deleteNote}
                    onAdd = {addNote}
                    onUpdate = {updateNote}
                    load = {loading}
                 />
            ))}
        </>
    )
}