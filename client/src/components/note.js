import React from "react"

export const Note = (props) => {

    const handleDelete = () => {
        props.onDelete(props.id)
    }

    return (
        <div className="note">
            <h2 className="title">{props.title}</h2>
            <p className="content">{props.content}</p>
            <button 
                disabled = {props.load ? true : false} 
                className="fa-solid fa-trash-can note-action-button" 
                onClick={handleDelete}>  
            </button>
        </div>
    )
}