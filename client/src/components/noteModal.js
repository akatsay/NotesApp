import React, { useState } from "react";

import "../styles/noteModal.css"

export const NoteModal = ({id, open, onClose, title, content, load, onDelete, onUpdate}) => {

    const [note, setNote] = useState({
        title: title,
        content: content
    })

    const handleChange = (e) => {
        setNote({...note, [e.target.name] : e.target.value})
    }

    const handleUpdate = () => {
        onUpdate(note, id)
    }

    const expandTextAreaWhenTyping = () => {
        const textarea = document.getElementById("noteModal-textArea")
        textarea.addEventListener("keyup", e => {
            let scHeight = e.target.scrollHeight
            textarea.style.height = `${scHeight}px`
        })
    }

    const expandTextAreaWhenClicked = () => {
        const textarea = document.getElementById("noteModal-textArea")
        textarea.addEventListener("click", e => {
            let scHeight = e.target.scrollHeight
            textarea.style.height = `${scHeight}px`
        })
    }

    if (!open) {
        return null
    }

    return (
        <>
            <div className="overlay" onClick={() => {
                onClose()
                setNote({
                        title: title,
                        content: content
                    })
                }
            }
            >
                <div 
                className="note-modal-container" onClick={(e) => {e.stopPropagation()}}>

                    <input 
                    className="title-input title input"
                    name="title"
                    value={note.title}
                    onChange={handleChange}
                    >
                    </input>

                    <textarea 
                    className="content-input"
                    id = "noteModal-textArea"
                    name="content"
                    value={note.content}
                    onChange={handleChange}
                    onKeyUp={expandTextAreaWhenTyping}
                    onFocus = {expandTextAreaWhenClicked}
                    >
                    </textarea>

                    <button 
                    className="fa fa-refresh note-action-button" 
                    id="update-button"
                    onClick={handleUpdate}
                    disabled = { load ? true : false}
                    >
                    </button>

                    <button 
                    className="fa fa-trash-can note-action-button" 
                    onClick={onDelete}
                    disabled = { load ? true : false}
                    >
                    </button>

                </div>
            </div>
        </>
    )
}