import React from 'react'

import {FiEdit} from 'react-icons/fi'
import {FaTrashAlt} from 'react-icons/fa'

export const IndividualTodo = ({ individualTodo,deleteTodo,editModal }) => {

    const handleDelete=()=>{
        deleteTodo(individualTodo.id);
    }

    const handleEditModal=()=>{
        editModal(individualTodo);
    }

    return (
        <div className='todo'>
            <div>
                {individualTodo.Todo}
            </div>
            <div className='actions-div'>

                <div onClick={handleEditModal}>
                    <FiEdit size={18} />
                </div>

                <div className='delete-btn' onClick={handleDelete}>
                    <FaTrashAlt size={18} />
                </div>
                
            </div>
        </div>
    )
}
