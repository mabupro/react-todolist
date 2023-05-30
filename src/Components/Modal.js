import React, { useState } from 'react'

import { FiXCircle } from 'react-icons/fi'

import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from '../services/firebase.config'

export const Modal = ({ editTodoValue, editModal,updateTodoHandler }) => {

    const [editTodo, setEditTodo] = useState(editTodoValue.Todo);

    const handleClose = () => {
        editModal(null)
    }

    const handleEditTodoSubmit = async (e) => {
        e.preventDefault();
        handleClose();
        updateTodoHandler(editTodo, editTodoValue.id);
        await auth.onAuthStateChanged(user => {
            if (user) {
                const todoRef = doc(db, 'todos of' + user.uid,editTodoValue.id);
                updateDoc(todoRef, {
                    Todo: editTodo
                })

            }
            else {
                console.log("user is not signed");
            }
        })
    }

    return (
        <div className='modal-container'>

            <div className='modal'>

                <div className='header'>

                    <div className='update-text'>
                        Update your todo
                    </div>

                    <div className='close-btn'
                        onClick={handleClose}
                    >
                        <FiXCircle size={28} />
                    </div>

                </div>

                <div className='container-fluid'>
                    <form autoComplete="off" className='form-group'
                        onSubmit={handleEditTodoSubmit}
                    >
                        <input type="text" className='form-control'
                            required placeholder="Update your todo"
                            value={editTodo}
                            onChange={(e)=>setEditTodo(e.target.value)}
                        />

                        <br />

                        <button type="submit" className='btn btn-success btn-lg'>
                            UPDATE
                        </button>
                        
                    </form>
                </div>

            </div>
        </div>
    )
}
