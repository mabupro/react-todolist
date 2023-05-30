import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import todoIcon from '../images/TodoAppicon.png'
import 'bootstrap/dist/css/bootstrap.css'
import '../index.css'

import {auth} from '../services/firebase.config'

export const Header = ({ currentUser }) => {

    const [year, setYear] = useState(null);
    const [date, setDate] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentDateOfMonth = currentDate.getDate();
        const currentMonth = currentDate.toLocaleString('ja-JP', { month: 'long' });
        const currentDay = currentDate.toLocaleDateString('js-JP', { weekday: 'long' });

        setYear(currentYear);
        setDate(currentDateOfMonth);
        setMonth(currentMonth);
        setDay(currentDay);
    }, [])

    const handleLogout = () => {
        auth.signOut().then(() => {
            window.location.reload();
        });
    }


    return (
        <div className='header-box'>

            <div className='leftside'>

                <div className='img'>
                    <img src={todoIcon} alt='todoIcon' />
                </div>

                <div className='content'>
                    <div className='heading-big'>
                        work to do?
                    </div>
                    <div className='heading-small'>
                        Let's make a list!
                    </div>

                </div>

            </div>
            <div className='rightside'>

                {!currentUser && <>
                    <Link className='btn btn-primary btn-md' to="signup">
                        SIGN UP
                    </Link>
                    <Link className='btn btn-secondary btn-md' to="login">
                        LOGIN
                    </Link>
                    <br/>
                    <div className='date-section'>
                        <span>{year}年</span>
                        <span>{month}</span>
                        <span>{date}日</span>
                        <span>{day}</span>
                    </div>

                </>}

                {currentUser && <div className='welcome-div'>

                    <h2>WELCOME</h2>
                    <h5>{currentUser}</h5>
                    <br/>
                    <div className='date-section'>
                        <span>{year}年</span>
                        <span>{month}</span>
                        <span>{date}日</span>
                        <span>{day}</span>
                    </div>
                    <br/>
                    <button className='btn btn-danger'
                        onClick={handleLogout}>LOGOUT</button>
                </div>}
                
            </div>
        </div>
    )
}
