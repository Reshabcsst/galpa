import React, { useState } from 'react';
import design from '../../../Assets/Rectanglesmall.png';
import Notification from './PopNotification/Notification';
import axios from 'axios';

const EnquireForm = ({ServerURL}) => {
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);

    const token = JSON.parse(window.localStorage.getItem("AdminData"));

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Date: '',
        Message: ''
    });

    const [errors, setErrors] = useState({
        Name: '',
        Email: '',
        Phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validation
        switch (name) {
            case 'Name':
                setErrors({
                    ...errors,
                    Name: value.length < 3 ? 'Name must be at least 3 characters long' : ''
                });
                break;
            case 'Email':
                setErrors({
                    ...errors,
                    Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email is not valid'
                });
                break;
            case 'Phone':
                setErrors({
                    ...errors,
                    Phone: /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits'
                });
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for errors before submitting
        if (errors.Name || errors.Email || errors.Phone) {
            console.log('Validation errors:', errors);
            return;
        }

        try {
            const response = await axios.post(`${ServerURL}/api/EnquireForm`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if (response.status === 200) {
                setNotificationOpen(true);
                setNotification({ text: 'Form submitted successfully!', color: 'success' });
                setFormData({
                    Name: '',
                    Email: '',
                    Phone: '',
                    Date: '',
                    Message: ''
                });
            } else {
                console.error('Form submission error');
                setNotificationOpen(true);
                setNotification({ text: 'Error Sending Form!', color: 'error' });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setNotificationOpen(true);
            setNotification({ text: 'Error Sending Form!', color: 'error' });
        }
    };

    return (
        <div className='enquire'>
            <h2>
                Connect with Galpa Books
                <img src={design} alt={design} />
            </h2>
            <p>Leave your contacts for our Senior editor to Connect with you</p>

            <div className="form">
                <div className="lft">

                </div>
                <div className="rht">
                    <form className='enquire-form' onSubmit={handleSubmit}>
                        <h2>Enquire Now </h2>
                        <input
                            type="text"
                            name="Name"
                            placeholder='Name'
                            value={formData.Name}
                            onChange={handleChange}
                            required
                        />
                        {errors.Name && <p className="error">{errors.Name}</p>}
                        <input
                            type="email"
                            name="Email"
                            placeholder='Email'
                            value={formData.Email}
                            onChange={handleChange}
                            required
                        />
                        {errors.Email && <p className="error">{errors.Email}</p>}
                        <input
                            type="text"
                            name="Phone"
                            placeholder='Phone'
                            value={formData.Phone}
                            onChange={handleChange}
                            required
                        />
                        {errors.Phone && <p className="error">{errors.Phone}</p>}
                        <input
                            type="date"
                            name="Date"
                            placeholder='Select Day and Time'
                            value={formData.Date}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="Message"
                            placeholder='Enter Message'
                            value={formData.Message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit">Enquire Now</button>
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
