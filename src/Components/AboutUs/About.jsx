import React, { useEffect, useState } from 'react';
import './About.scss';
import midBg from '../../Assets/Aboutnormalbg.jpg';
import img from '../../Assets/Rectanglesmall.png';
import Banner from '../CommonComponents/Banner';
import { FaMinus, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const About = ({ ServerURL }) => {
    const [openSection, setOpenSection] = useState(null);
    const [BannerData, setBannerData] = useState('');
    const [loading, setLoading] = useState(true);
    const [DetailsData, setDetailsData] = useState('');
    const [CardData, setCardData] = useState([]);
    const [FAQData, setFAQData] = useState([]);
    // Fetching banner data
    useEffect(() => {
        axios.get(`${ServerURL}/api/AboutBanner/get-about-banner`)
            .then(response => {
                setBannerData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        // Fetching details data
        axios.get(`${ServerURL}/api/AboutDetails/get-about-details`)
            .then(response => {
                setDetailsData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        // Fetching card data
        axios.get(`${ServerURL}/api/WhatSetUsApart/get-all-items`)
            .then(response => {
                setCardData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        // Fetching faq data
        axios.get(`${ServerURL}/api/FAQ/get-all-faqs`)
            .then(response => {
                setFAQData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);
    
    const handleToggle = (sectionId) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    return (
        <div>
            <Banner
                Heading={BannerData.heading}
                SubHeading={BannerData.subheading}
                imgURL={`${ServerURL}/${BannerData.backgroundImage}`}
            />
            <div className="about">
                <div className="orange-big"></div>
                <div className="orange-small"></div>
                <div className="purple"></div>
                <div className="inr">
                    <p>{DetailsData.details1}</p>
                    <h2 className='heading'>{DetailsData.title2}
                        <img src={img} alt="img" /></h2>
                    <p>{DetailsData.details2}</p>
                </div>
                <div
                    className='about-normal-banner'
                    style={{
                        backgroundImage: `url(${midBg})`
                    }}>
                    <h2 className='bnr-heading1'>
                        {DetailsData.title3}
                        <img className='img1' src={img} alt={img} />
                    </h2>
                    <p>{DetailsData.details3}</p>
                </div>

                <h2 className='heading'> What Sets Us Apart
                    <img src={img} alt="img" />
                </h2>
                <div className="list">
                    {CardData.map((data, index) => {
                        return (
                            <div key={index} className="box">
                                <div className="upr" style={{ backgroundImage: `url(${ServerURL}/${data.cardPic})` }}></div>
                                <div className="lwr">
                                    <h2>{data.heading}</h2>
                                    <p>{data.details}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>


                <h2 className='heading1'>
                    Frequently Asked Questions
                    <img src={img} alt="img" />
                </h2>
                <div className="orange-big-bottom"></div>
                <div className="orange-small-bottom"></div>
                <div className="purple-bottom"></div>
                {/* Accordion */}
                <div className="accordion">
                    {FAQData.map((item, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={item.id}
                                className="accordion__input"
                                checked={openSection === item.id}
                                onChange={() => handleToggle(item.id)}
                            />
                            <label htmlFor={item.id} className="accordion__label">
                                {item.question}
                                <div className="btn">
                                    {openSection === item.id ? <FaMinus className='dt-minus' /> : <FaPlus className='dt-plus' />}
                                </div>
                            </label>
                            <div className={`accordion__content ${openSection === item.id ? 'open' : ''}`}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
