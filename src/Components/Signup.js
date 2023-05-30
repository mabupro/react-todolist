import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase.config';


export const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;
            console.log(userName, email, password, uid);
            await setDoc(doc(db, 'users', uid), {
                userName: userName,
                Email: email,
                Password: password,
            });
            setUserName('');
            setEmail('');
            setPassword('');
            setRegisterError('');
            navigate('/login');
        } catch (error) {
            setRegisterError(error.message);
        }
    };

    return (
        <div className="container">
            <br />
            <br />
            <h2>SIGN UP NOW!</h2>
            <br />

            <form autoComplete="off" className="form-group" onSubmit={handleRegister}>
                
                <label>User Name</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                />

                <br />

                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <br />

                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                
                <br />

                <button type="submit" className="btn btn-success register">
                    REGISTER
                </button>

            </form>

            {registerError && (
                <div className="error-msg">
                    {registerError}
                </div>
            )}

            <span>
                Already have an account? Login
                <Link to="/login">here</Link>
            </span>
        </div>
    );
};
