import React, { useState } from 'react';
import Google from '../../Assets/Google.svg';
import Facebook from '../../Assets/facebook.svg';
import './Signin.scss';
import { Oval } from 'react-loader-spinner';

const Forms = ({ activeTab, setActiveTab, handleNotification, handleClose, ServerURL }) => {
    const [signInData, setSignInData] = useState({ userName: '', password: '' });
    const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for button loading

    const validate = () => {
        let tempErrors = {};
        if (activeTab === 'signIn') {
            if (!signInData.userName) tempErrors.userName = 'Username is required';
            if (!signInData.password) tempErrors.password = 'Password is required';
        } else {
            if (!signUpData.username) tempErrors.username = 'Username is required';
            if (!signUpData.email) tempErrors.email = 'Email is required';
            if (!signUpData.password) tempErrors.password = 'Password is required';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true); // Start loading

        const url = activeTab === 'signIn' ? `${ServerURL}/api/Auth/login` : `${ServerURL}/api/Auth/registration`;
        const data = activeTab === 'signIn' ? signInData : signUpData;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                const userData = JSON.stringify(result);
                window.localStorage.setItem("UserData", userData);
                handleNotification(activeTab === 'signIn' ? 'Login successful' : 'Signup successful', 'success');
                setSignInData({ userName: '', password: '' });
                setSignUpData({ username: '', email: '', password: '' });
                handleClose();
            } else if (response.status === 409 && activeTab === 'signUp') {
                handleNotification('User already exists with this email', 'error');
            } else {
                const errorResult = await response.json();
                console.error('Error submitting form', errorResult);
                handleNotification('Submission failed', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            handleNotification('Submission failed', 'error');
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    return (
        <div className='sign_in'>
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'signIn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signIn')}
                >
                    Sign In
                </button>
                <button
                    className={`tab ${activeTab === 'signUp' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signUp')}
                >
                    Sign Up
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'signIn' && (
                    <form className="form" onSubmit={handleSubmit}>
                        <button type="button"><img src={Google} alt="Google" />Continue with Google</button>
                        <button type="button"><img src={Facebook} alt="Facebook" />Continue with Facebook</button>
                        <span>or</span>
                        <label htmlFor="userName">Username</label>
                        <input
                            id='userName'
                            type="text"
                            placeholder="Username"
                            value={signInData.userName}
                            onChange={(e) => setSignInData({ ...signInData, userName: e.target.value })}
                        />
                        {errors.userName && <p className="error">{errors.userName}</p>}
                        <label htmlFor="password">Password</label>
                        <input
                            id='password'
                            type="password"
                            placeholder="Password"
                            value={signInData.password}
                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Oval
                                    visible={true}
                                    height="25"
                                    width="25"
                                    color="#ffff"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        <a href="/">Forgot password</a>
                    </form>
                )}
                {activeTab === 'signUp' && (
                    <form className="form" onSubmit={handleSubmit}>
                        <button type="button"><img src={Google} alt="Google" />Continue with Google</button>
                        <button type="button"><img src={Facebook} alt="Facebook" />Continue with Facebook</button>
                        <span>or</span>
                        <label htmlFor="username">Username</label>
                        <input
                            id='username'
                            type="text"
                            placeholder="Username"
                            value={signUpData.username}
                            onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                        />
                        {errors.username && <p className="error">{errors.username}</p>}
                        <label htmlFor="email">Email</label>
                        <input
                            id='email'
                            type="email"
                            placeholder="Email"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                        <label htmlFor="password">Password</label>
                        <input
                            id='password'
                            type="password"
                            placeholder="Password"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Oval
                                    visible={true}
                                    height="25"
                                    width="25"
                                    color="#ffff"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Forms;
