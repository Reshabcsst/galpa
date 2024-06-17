import React, { useState } from 'react';
import bg from '../../Assets/ContactBg.jpg';
import './Contact.scss';
import design from '../../Assets/Rectanglesmall.png';
import Banner from '../CommonComponents/Banner';
import { FaLocationDot } from 'react-icons/fa6';
import { IoCallOutline } from 'react-icons/io5';
import { IoMdTime } from 'react-icons/io';

const Contact = () => {

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
        <div>
            <Banner
                Heading="Contact Us"
                SubHeading="Connect with Us to Turn Your Manuscript into a Published Masterpiece Today!"
                imgURL={bg}
            />
            <div className="main2">
                <div className="orange-big"></div>
                <div className="orange-small"></div>
                <div className="purple"></div>
                <div className="orange-big-bottom"></div>
                <div className="orange-small-bottom"></div>
                <div className="purple-bottom"></div>
                <h2 className='heading'>
                    Need Help? Say Hello
                    <img src={design} alt={design} />
                </h2>
                <p className='detail'>we're here to assist you every step of the way. Whether you have questions about our products, need assistance with an order, or simply want to say hello, we're just a message away. Our dedicated team is committed to providing you with prompt and friendly support to ensure your experience with us is nothing short of exceptional.</p>
                <p className='detail'>Feel free to reach out to us via email, phone, or social media, and we'll be happy to help. Your satisfaction is our priority, and we're here to make sure you have everything you need. So don't hesitate to get in touch – we're looking forward to hearing from you!</p>
                <div className="form">
                    <form className="in" onSubmit={handleSubmit}>
                        <h2>Enquire Now</h2>
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
                <div className="details">
                    <div className="box">
                        <FaLocationDot className='icon' />
                        <h2>Our Location</h2>
                        <p>BB 42, BB Block, Sector I,
                            Salt Lake, Bidhannagar, Kolkata</p>
                    </div>
                    <div className="box">
                        <IoCallOutline className='icon' />
                        <h2>Let's Talk</h2>
                        <p>+91 90001 10009</p>
                        <p>+91 90001 10009</p>
                    </div>
                    <div className="box">
                        <IoMdTime className='icon' />
                        <h2>Working Hours</h2>
                        <p>10:00AM</p>
                        <p>6:00PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
