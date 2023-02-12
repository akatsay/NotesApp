import React, { useState } from "react"

import {NoteModal} from "./noteModal"

export const Note = (props) => {

    const [openModal, setOpenModal] = useState(false)

    const handleDelete = () => {
        props.onDelete(props.id)
    }

    return (
        <>
            <div 
            className="note"
            onClick={() => setOpenModal(true)}
            >
                <h2 className="title">{props.title}</h2>
                <p className="content">{props.content}</p>
                <button 
                    disabled = {props.load ? true : false} 
                    className="fa-solid fa-trash-can note-action-button" 
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete()}}
                >  
                </button>
            </div>
            <NoteModal 
                id={props.id}
                title={props.title}
                content={props.content}
                open = {openModal}
                load = {props.load}
                onClose = {() => {setOpenModal(false)}}
                onDelete = {handleDelete}
                onUpdate = {props.onUpdate}
            />
        </>
    )
}