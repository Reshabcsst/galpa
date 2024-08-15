import React, { useEffect, useState } from 'react';
import './Contact.scss';
import design from '../../Assets/Rectanglesmall.png';
import Banner from '../CommonComponents/Banner';
import { FaLocationDot } from 'react-icons/fa6';
import { IoCallOutline } from 'react-icons/io5';
import { IoMdTime } from 'react-icons/io';
import Notification from '../Home/Components/PopNotification/Notification';
import axios from 'axios';
import { InfinitySpin, Oval } from 'react-loader-spinner';

const Contact = ({ ServerURL }) => {
    const [notification, setNotification] = useState({ text: '', color: '' });
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [BannerData, setBannerData] = useState('');
    const [DetailsData, setDetailsData] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [CompanyDetailsData, setCompanyDetailsData] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for button loading

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    useEffect(() => {
        axios.get(`${ServerURL}/api/ContactBanner/get-contact-banner`)
            .then(response => {
                setBannerData(response.data);
                setLoading2(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Fetch Need Help Details
        axios.get(`${ServerURL}/api/NeedHelp/get-need-help`)
            .then(response => {
                setDetailsData(response.data);
                setLoading1(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Fetch company Details
        axios.get(`${ServerURL}/api/ContactGalpa/get-contact-details`)
            .then(response => {
                setCompanyDetailsData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [ServerURL]);


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
        setIsSubmitting(true); // Disable the button and show loading
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
                setNotificationOpen(true);
                setNotification({ text: 'Form submitted successfully!', color: 'success' });
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
        <div>
            {loading2 ? (
                <p className='banner-loading'>
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
                <Banner
                    Heading={BannerData.heading}
                    SubHeading={BannerData.subheading}
                    imgURL={`${ServerURL}/${BannerData.backgroundImage}`}
                />
            )}
            <div className="main2">
                <div className="orange-big"></div>
                <div className="orange-small"></div>
                <div className="purple"></div>
                <div className="orange-big-bottom"></div>
                <div className="orange-small-bottom"></div>
                <div className="purple-bottom"></div>
                {loading1 ? (
                    <p className='loading'>
                        <InfinitySpin
                            visible={true}
                            width="200"
                            color="#8a07f0"
                            ariaLabel="infinity-spin-loading"
                        />
                    </p>
                ) : (
                    <div>
                        <h2 className='heading'>
                            {DetailsData.title}
                            <img src={design} alt={design} />
                        </h2>
                        <p className='detail'>{DetailsData.details1}</p>
                        <p className='detail'>{DetailsData.details2}</p>
                    </div>
                )}
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
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Oval
                                    visible={true}
                                    height="30"
                                    width="30"
                                    color="#ffff"
                                    ariaLabel="oval-loading"
                                    wrapperClass="loader"
                                />
                            ) : (
                                'Enquire Now'
                            )}
                        </button>
                    </form>
                </div>
                {loading ? (
                    <p className='loading'>
                        <InfinitySpin
                            visible={true}
                            width="200"
                            color="#8a07f0"
                            ariaLabel="infinity-spin-loading"
                        />
                    </p>
                ) : (
                    <div className="details">
                        <div className="box">
                            <FaLocationDot className='icon' />
                            <h2>Our Location</h2>
                            <p>{CompanyDetailsData.ourLocation}</p>
                        </div>
                        <div className="box">
                            <IoCallOutline className='icon' />
                            <h2>Let's Talk</h2>
                            <p>{CompanyDetailsData.number1}</p>
                            <p>{CompanyDetailsData.number2}</p>
                        </div>
                        <div className="box">
                            <IoMdTime className='icon' />
                            <h2>Working Hours</h2>
                            <p>{CompanyDetailsData.opensAt}</p>
                            <p>{CompanyDetailsData.closeAt}</p>
                        </div>
                    </div>
                )}
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

export default Contact;
