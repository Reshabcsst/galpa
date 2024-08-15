import React, { useState } from 'react';
import design from '../../../Assets/Rectanglesmall.png';
import Notification from './PopNotification/Notification';
import axios from 'axios';
import { InfinitySpin, Oval } from 'react-loader-spinner';

const EnquireForm = ({ ServerURL }) => {
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for button loading

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        message: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validation
        switch (name) {
            case 'name': // Fixed key name to match the formData key
                setErrors({
                    ...errors,
                    name: value.length < 3 ? 'Name must be at least 3 characters long' : ''
                });
                break;
            case 'email': // Fixed key name to match the formData key
                setErrors({
                    ...errors,
                    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email is not valid'
                });
                break;
            case 'phone': // Fixed key name to match the formData key
                setErrors({
                    ...errors,
                    phone: /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits'
                });
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for errors before submitting
        if (errors.name || errors.email || errors.phone) {
            console.log('Validation errors:', errors);
            return;
        }

        setIsSubmitting(true); // Disable the button and show loading

        try {
            const response = await axios.post(`${ServerURL}/api/ContactForm`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if (response.status === 200) {
                setNotificationOpen(true);
                setNotification({ text: 'Form submitted successfully!', color: 'success' });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    message: ''
                });
            } else {
                setNotificationOpen(true);
                setNotification({ text: 'Error Sending Form!', color: 'error' });
            }
        } catch (error) {
            setNotificationOpen(true);
            setNotification({ text: 'Error Sending Form!', color: 'error' });
        } finally {
            setIsSubmitting(false); // Enable the button and hide loading
        }
    };

    return (
        <div className='enquire'>
            <h2>
                Connect with Galpa Books
                <img src={design} alt="Design" />
            </h2>
            <p>Leave your contacts for our Senior editor to Connect with you</p>

            <div className="form">
                <div className="lft"></div>
                <div className="rht">
                    <form className='enquire-form' onSubmit={handleSubmit}>
                        <h2>Enquire Now </h2>
                        <input
                            type="text"
                            name="name"
                            placeholder='Name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                        <input
                            type="email"
                            name="email"
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                        <input
                            type="text"
                            name="phone"
                            placeholder='Phone'
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone && <p className="error">{errors.phone}</p>}
                        <input
                            type="date"
                            name="date"
                            placeholder='Select Day and Time'
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder='Enter Message'
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Oval
                                    visible={true}
                                    height="30"
                                    width="30"
                                    color="#ffff"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            ) : (
                                'Enquire Now'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <Notification
                text={notification.text}
                color={notification.color}
                open={notificationOpen}
                handleClose={handleNotificationClose}
            />
        </div>
    );
};

export default EnquireForm;
