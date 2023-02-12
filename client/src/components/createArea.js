import React, { useState, useRef, useEffect } from "react";

export const CreateArea = ({onAdd, load}) => {

    const titleInputRef = useRef(null)
    const contentInputRef = useRef(null)

    useEffect(() => {
        titleInputRef.current.focus()
    }, [])

    const [note, setNote] = useState({
        title: "",
        content: ""
    })

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
    <div className="create-area note">

            <input 
            ref = {titleInputRef}
            className="title-input title input"
            name="title"
            value={note.title}
            onChange={handleChange}
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
            >

            </textarea>
            <button 
            className="fa fa-plus note-action-button" 
            onClick={submitNote}
            disabled = { load ? true : false}>
            </button>

        </div>
    )
} 
