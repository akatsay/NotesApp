import React, { useContext, useState, useEffect, useRef } from "react"
import { toast, Slide } from "react-toastify"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from 'react-router-dom'
import { useHttp } from "../hooks/http.hook"

import { Modal } from "../components/modal"

import "../styles/accountPage.css"

export const AccountPage = () => {

    const nameRef = useRef(null)
    const oldPasswordRef = useRef(null)
    const newPasswordRef = useRef(null)    

    const auth = useContext(AuthContext)
    const {loading, request, error, clearError} = useHttp()
    const [showChangeNameMenu, setShowChangeNameMenu] = useState(false)
    const [showChangePasswordMenu, setShowChangePasswordMenu] = useState(false)
    const [changeNameErrorMessageDetails, setChangeNameErrorMessageDetails] = useState({})
    const [changePasswordErrorMessageDetails, setChangePasswordErrorMessageDetails] = useState({})
    const [openModal, setOpenModal] = useState(false);

    const [nameForm, setNameForm] = useState({
        name: "",
        userId: auth.userId
    })

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        userId: auth.userId
    })

    const navigate = useNavigate()

    const NameChangeHandler = (event) => {
        setNameForm({...nameForm, [event.target.name]: event.target.value})
    }

    const nameChangeSubmitHandler = async () => {
        try {
            const data = await request("/api/account/name", "put", {...nameForm}, {
                Authorization: `Bearer ${auth.token}`
              })
            auth.userName = nameForm.name
            setChangeNameErrorMessageDetails({})
            nameRef.current.style.borderBottomColor = ""
            setShowChangeNameMenu(false)
            setNameForm({...nameForm, name: "" })
            toast.success(data.message, {
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
        } catch (e) {
            
        }
    }

    const passwordChangeHandler = (event) => {
        setPasswordForm({...passwordForm, [event.target.name]: event.target.value})
    }

    const passwordChangeSubmitHandler = async () => {
        try {
            const data = await request("/api/account/password", "post", {...passwordForm}, {
                Authorization: `Bearer ${auth.token}`
              })
            setChangePasswordErrorMessageDetails({})
            oldPasswordRef.current.style.borderBottomColor = ""
            newPasswordRef.current.style.borderBottomColor = ""
            setShowChangePasswordMenu(false)
            setPasswordForm({...passwordForm, oldPassword: "", newPassword: ""})
            toast.success(data.message, {
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
        } catch (e) {
            
        }
    }


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
            }
                
            if (error.cause !== undefined) {
                if (error.cause.origin === "name") {
                    setChangeNameErrorMessageDetails(error.cause)
                    nameRef.current.focus()
                    nameRef.current.style.borderBottomColor = "#FF7276"
                } else if (error.cause.origin === "oldPassword") {
                    setChangePasswordErrorMessageDetails(error.cause)
                    oldPasswordRef.current.focus()
                    oldPasswordRef.current.style.borderBottomColor = "#FF7276"
                    newPasswordRef.current.style.borderBottomColor = ""
                } else if (error.cause.origin === "newPassword") {
                    setChangePasswordErrorMessageDetails(error.cause)
                    newPasswordRef.current.focus()
                    newPasswordRef.current.style.borderBottomColor = "#FF7276"
                    oldPasswordRef.current.style.borderBottomColor = ""
                }
            }
            clearError()
        }
    }, [error, clearError, auth])

    return (
        <>
            <div className="account-page-container">
                <button className="link" onClick={() => {navigate("/home")}}>{"<-"}Back to Home Page</button>
                <h1 className="page-title">Account settings</h1>
                <div className="settings-container">
                    <div className="setting-wrapper">
                        <label className="setting-label">Your email: </label>
                        <label className="parameter-label">{auth.userEmail}</label>
                        <button className="pustishka">Change</button>
                    </div>
                    <div className="setting-wrapper">
                        <label className="setting-label">Your name: </label>
                        <label className="parameter-label">{auth.userName}</label>
                        <button 
                            onClick={() => 
                                {
                                    setShowChangeNameMenu(!showChangeNameMenu);
                                    showChangeNameMenu ? setShowChangePasswordMenu(false) : setShowChangePasswordMenu(false);
                                    !showChangeNameMenu ? setChangeNameErrorMessageDetails({}) : setChangeNameErrorMessageDetails({});
                                    nameRef.current.style.borderBottomColor = "";
                                    nameRef.current.value = "";
                                    !showChangeNameMenu ?  setNameForm({...nameForm, name: ""}) : setNameForm({...nameForm, name: ""});
                                }
                            }  
                            className="change-btn grow"
                        >
                            {!showChangeNameMenu ? "Change" : "Cancel"} <i className="fa fa-chevron-down rc-accordion-icon"></i>
                        </button>
                    </div>
                        <div className={`change-menu name ${showChangeNameMenu ? "show" : "hide"}`}>
                            <input 
                                ref={nameRef}
                                className="input input-name"
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="off"
                                onChange={NameChangeHandler}
                                placeholder={auth.userName}
                            />
                            <button 
                                className="submit-button grow"
                                onClick={nameChangeSubmitHandler}
                                disabled={loading ? true : false}
                            >
                            Change name
                            </button>
                            { 
                                JSON.stringify(changeNameErrorMessageDetails) === "{}"
                                ? 
                                    null
                                :
                                    <div className="error-details">
                                        * {changeNameErrorMessageDetails.details}
                                    </div>
                                
                            }
                        </div>
                    <div className="setting-wrapper setting-wrapper-toggle-type">
                        <button 
                            onClick={() => 
                                {
                                    setShowChangePasswordMenu(!showChangePasswordMenu);
                                    showChangePasswordMenu ? setShowChangeNameMenu(false) : setShowChangeNameMenu(false);
                                    !showChangePasswordMenu ? setChangePasswordErrorMessageDetails({}) : setChangePasswordErrorMessageDetails({});
                                    oldPasswordRef.current.style.borderBottomColor = "";
                                    newPasswordRef.current.style.borderBottomColor = "";
                                    oldPasswordRef.current.value = "";
                                    newPasswordRef.current.value = "";
                                    !showChangePasswordMenu ?  setPasswordForm({...passwordForm, oldPassword: "", newPassword: ""}) : setPasswordForm({...passwordForm, oldPassword: "", newPassword: ""})
                                }
                            } 
                            className="change-btn grow"
                        >
                            {!showChangePasswordMenu ? "Change Password" : "Cancel"} <i className="fa fa-chevron-down rc-accordion-icon"></i>
                        </button>
                    </div>
                        <div className={`change-menu password ${showChangePasswordMenu ? "show" : "hide"}`}>
                            <label className="input-label" htmlFor="oldPassword">Old password</label>
                            <input 
                                ref={oldPasswordRef}
                                className="input input-old-password"
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                autoComplete="off"
                                onChange={passwordChangeHandler}
                                placeholder="Input old password"
                            />
                            <label className="input-label" htmlFor="newPassword">New password</label>
                            <input 
                                ref={newPasswordRef}
                                className="input input-new-password"
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                autoComplete="off"
                                onChange={passwordChangeHandler}
                                placeholder="Input new password"
                            />
                            <button 
                                className="submit-button grow"
                                onClick={() => {console.log(loading); passwordChangeSubmitHandler();}}
                                disabled={loading ? true : false}
                            >
                            Change it!
                            </button>
                            { JSON.stringify(changePasswordErrorMessageDetails) === "{}"
                                ? 
                                    null
                                :
                                    <div className="error-details">
                                        * {changePasswordErrorMessageDetails.details}
                                    </div>
                            }
                        </div>
                    <div className="setting-wrapper setting-wrapper-toggle-type">
                        <button 
                            onClick={() => setOpenModal(true)}   
                            className="delete-account-btn grow"
                        >
                            Delete My account
                        </button>
                    </div>
                </div>
                <Modal 
                open={openModal} 
                onClose={() => setOpenModal(false)}
                />
            </div>
        </>
    )
}