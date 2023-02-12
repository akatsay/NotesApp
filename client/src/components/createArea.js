import React, { useState, useRef, useEffect } from "react";

import {CreateAreaModal} from "./createAreaModal"

export const CreateArea = ({onAdd, load}) => {

    const [openModal, setOpenModal] = useState(false)

    const titleInputRef = useRef(null)
    const contentInputRef = useRef(null)

    const [note, setNote] = useState({
        title: "",
        content: ""
    })

    useEffect(() => {
        titleInputRef.current.focus()
    }, [])

    const handleChange = (e) => {
        setNote({...note, [e.target.name] : e.target.value})
    }

    const submitNote = () => {
        onAdd(note)
        setNote({
            title: "",
            content: ""
        })
    }

    const expandTextAreaWhenTyping = () => {
        const textarea = document.getElementById("createArea-textArea")
        textarea.addEventListener("keyup", e => {
            let scHeight = e.target.scrollHeight
            textarea.style.height = `${scHeight}px`
        })

    }

    return (
        <>
            <div onClick={() => setOpenModal(true)} className="create-area note">

                <input 
                ref = {titleInputRef}
                className="title-input title input"
                name="title"
                value={note.title}
                onChange={handleChange}
                onClick={e => e.stopPropagation()}
                >

                </input>

                <textarea 
                className="content-input"
                id = "createArea-textArea"
                ref = {contentInputRef}
                name="content"
                value={note.content}
                onChange={handleChange}
                onKeyUp={expandTextAreaWhenTyping}
                onClick={e => e.stopPropagation()}
                >

                </textarea>
                <button 
                className="fa fa-plus note-action-button" 
                onClick={submitNote}
                disabled = { load ? true : false}>
                </button>
        
            </div>

            {openModal
            ? 
            <CreateAreaModal 
                title={note.title}
                content={note.content}
                open = {openModal}
                load = {load}
                onClose = {() => {setOpenModal(false)}}
                onAdd = {onAdd}
            />
            :
            null
            }
            
        </>
    )
} 
