import React, { useState } from 'react';
import Google from '../Assets/Google.svg';
import Facebook from '../Assets/facebook.svg';
import './Signin.scss';

const Forms = ({ handleNotification, ServerURL }) => {
    const [signInData, setSignInData] = useState({ userName: '', password: '' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!signInData.userName) tempErrors.userName = 'userName is required';
        if (!signInData.password) tempErrors.password = 'Password is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const data = signInData;

        try {
            const response = await fetch(`${ServerURL}/api/Auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                const userData = JSON.stringify(result)
                window.localStorage.setItem("AdminData", userData);
                handleNotification('Login successful', 'success');
                setSignInData({ userName: '', password: '' });
                window.location.reload();
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
            <h2>Sign In</h2>
            <div className="auth_tabContent">
                <form className="auth_form" onSubmit={handleSubmit}>
                    <button type="button"><img src={Google} alt="Google" />Continue with Google</button>
                    <button type="button"><img src={Facebook} alt="Facebook" />Continue with Facebook</button>
                    <span>or</span>
                    <label htmlFor="userName">Username or email</label>
                    <input
                        id='userName'
                        type="text"
                        placeholder="Username or email"
                        value={signInData.userName}
                        onChange={(e) => setSignInData({ ...signInData, userName: e.target.value })}
                    />
                    {errors.userName && <p className="auth_error">{errors.userName}</p>}
                    <label htmlFor="password">Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder="Password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    />
                    {errors.password && <p className="auth_error">{errors.password}</p>}
                    <button type="submit" className="auth_submitButton">Sign In</button>
                    <a href="/">Forgot password</a>
                </form>
            </div>
        </div>
    );
};

export default Forms;
