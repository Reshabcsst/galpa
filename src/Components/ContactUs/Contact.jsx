import React, { useEffect, useState } from 'react';
import './Contact.scss';
import design from '../../Assets/Rectanglesmall.png';
import Banner from '../CommonComponents/Banner';
import { FaLocationDot } from 'react-icons/fa6';
import { IoCallOutline } from 'react-icons/io5';
import { IoMdTime } from 'react-icons/io';
import axios from 'axios';

const Contact = ({ ServerURL }) => {
    const [BannerData, setBannerData] = useState('');
    const [DetailsData, setDetailsData] = useState('');

    useEffect(() => {
        axios.get(`${ServerURL}/api/ContactBanner/get-contact-banner`)
            .then(response => {
                setBannerData(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Fetch Need Help Details
        axios.get(`${ServerURL}/api/NeedHelp/get-need-help`)
            .then(response => {
                setDetailsData(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [ServerURL])

    console.log(DetailsData.title)

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
            const response = await fetch(`${ServerURL}/api/ContactForm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    message: ''
                });
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
                Heading={BannerData.heading}
                SubHeading={BannerData.subheading}
                imgURL={`${ServerURL}/${BannerData.backgroundImage}`}
            />
            <div className="main2">
                <div className="orange-big"></div>
                <div className="orange-small"></div>
                <div className="purple"></div>
                <div className="orange-big-bottom"></div>
                <div className="orange-small-bottom"></div>
                <div className="purple-bottom"></div>
                <h2 className='heading'>
                    {DetailsData.title}
                    <img src={design} alt={design} />
                </h2>
                <p className='detail'>{DetailsData.details1}</p>
                <p className='detail'>{DetailsData.details2}</p>
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
