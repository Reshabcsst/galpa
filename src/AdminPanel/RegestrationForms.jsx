import React, { useState } from 'react';
import Google from '../Assets/Google.svg';
import Facebook from '../Assets/facebook.svg';
import './Signin.scss';
import { useNavigate } from 'react-router-dom';

const RegestrationForms = ({ handleNotification, ServerURL }) => {
    const [signUpData, setsignUpData] = useState({ userName: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const token = JSON.parse(window.localStorage.getItem("AdminData"));
    const validate = () => {
        let tempErrors = {};
        if (!signUpData.userName) tempErrors.userName = 'Username is required';
        if (!signUpData.email) tempErrors.email = 'Email is required';
        if (!signUpData.password) tempErrors.password = 'Password is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const data = signUpData;

        try {
            const response = await fetch(`${ServerURL}/api/Auth/admin/registration`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                handleNotification('Regestration successful', 'success');
                setsignUpData({ userName: '', password: '', email: '' });
                navigate('/admin-panel');
            } else {
                const errorResult = await response.json();
                console.error('Error submitting form', errorResult);
                handleNotification('Submission failed', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            handleNotification('Submission failed', 'error');
        }
    };

    return (
        <div className='auth_signIn'>
            <h2>Sign Up</h2>
            <div className="auth_tabContent">
                <form className="auth_form" onSubmit={handleSubmit}>
                    <button type="button"><img src={Google} alt="Google" />Continue with Google</button>
                    <button type="button"><img src={Facebook} alt="Facebook" />Continue with Facebook</button>
                    <span>or</span>
                    <label htmlFor="userName">Username</label>
                    <input
                        id='userName'
                        type="text"
                        placeholder="Username"
                        value={signUpData.userName}
                        onChange={(e) => setsignUpData({ ...signUpData, userName: e.target.value })}
                    />
                    {errors.userName && <p className="auth_error">{errors.userName}</p>}
                    <label htmlFor="email">Email</label>
                    <input
                        id='email'
                        type="text"
                        placeholder="email"
                        value={signUpData.email}
                        onChange={(e) => setsignUpData({ ...signUpData, email: e.target.value })}
                    />
                    {errors.email && <p className="auth_error">{errors.email}</p>}
                    <label htmlFor="password">Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder="Password"
                        value={signUpData.password}
                        onChange={(e) => setsignUpData({ ...signUpData, password: e.target.value })}
                    />
                    {errors.password && <p className="auth_error">{errors.password}</p>}
                    <button type="submit" className="auth_submitButton">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default RegestrationForms;
