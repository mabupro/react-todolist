import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase.config'

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            setLoginError('');
            navigate('/');
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div className='container'>
            <br />
            <br />
            <h2>LOGIN HERE</h2>
            <br />

            <form autoComplete="off" className='form-group'
                onSubmit={handleLogin}
            >

                <label>Enter Email</label>
                <input type="email" className='form-control'
                    required onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <br />

                <label>Enter Password</label>
                <input type="password" className='form-control'
                    required onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />

                <br />

                <button type="submit" className='btn btn-success mybtn2'>
                    LOGIN
                </button>

            </form>

            {loginError && <div className='error-msg'>
                {loginError}
            </div>}

            <span>Don't have an account? Create One
                <Link to="/signup"> here</Link>
            </span>

        </div>
    )
}