import React, { useState } from 'react';
import design from '../../../Assets/Rectanglesmall.png';

const EnquireForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://your-server-endpoint.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Form submitted successfully');
            } else {
                console.log('Form submission error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
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
                            name="name"
                            placeholder='Name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder='Phone'
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
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
                        <button type="submit">Enquire Now</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EnquireForm;
