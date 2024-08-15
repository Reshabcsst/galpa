import React, { useState } from 'react';
import Google from '../Assets/Google.svg';
import Facebook from '../Assets/facebook.svg';
import './Signin.scss';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const RegistrationForms = ({ handleNotification, ServerURL }) => {
    const [signUpData, setSignUpData] = useState({ userName: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading
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

        setIsSubmitting(true); // Start loading

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
                handleNotification('Registration successful', 'success');
                setSignUpData({ userName: '', password: '', email: '' });
                setTimeout(() => {
                    navigate('/admin-panel');
                }, 2000);
            } else if (response.status === 409) {
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
                        onChange={(e) => setSignUpData({ ...signUpData, userName: e.target.value })}
                    />
                    {errors.userName && <p className="auth_error">{errors.userName}</p>}
                    <label htmlFor="email">Email</label>
                    <input
                        id='email'
                        type="text"
                        placeholder="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    />
                    {errors.email && <p className="auth_error">{errors.email}</p>}
                    <label htmlFor="password">Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder="Password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    />
                    {errors.password && <p className="auth_error">{errors.password}</p>}
                    <button type="submit" className="auth_submitButton" disabled={isSubmitting}>
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
            </div>
        </div>
    );
};

export default RegistrationForms;
