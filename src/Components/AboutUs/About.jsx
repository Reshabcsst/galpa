import React, { useState } from 'react';
import './About.scss';
import bg from '../../Assets/AboutBG.jpg';
import midBg from '../../Assets/Aboutnormalbg.jpg';
import img from '../../Assets/Rectanglesmall.png';
import Banner from '../CommonComponents/Banner';
import { FaMinus, FaPlus } from 'react-icons/fa';
import AccordionData from '../../DemoData/AccordionData';

const About = () => {
    const [openSection, setOpenSection] = useState(null);

    const handleToggle = (sectionId) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    return (
        <div>
            <Banner
                Heading='About Us'
                SubHeading='Empowering Writers Through Premier Book Publishing Solutions'
                imgURL={bg} />

            <div className="about">
                <div className="orange-big"></div>
                <div className="orange-small"></div>
                <div className="purple"></div>
                <div className="inr">
                    <p>We are passionate about books and committed to helping authors bring their stories to life. As a leading provider of comprehensive book writing, editing, proofreading, and publishing services, we strive to empower authors to achieve their publishing goals and share their unique voices with the world. We are passionate about books and committed to helping authors bring their stories to life. As a leading provider of comprehensive book writing, editing, proofreading, and publishing services</p>
                    <h2 className='heading'> Why We are
                        <img src={img} alt="img" /></h2>
                    <p>Founded 2020, Galpa was born out of a love for literature and a desire to support aspiring authors in their journey to publication. Our founder, [Founder's Name], recognized the need for professional and reliable book services that catered to the diverse needs of authors at every stage of their writing process. With this vision in mind, Galpa was established with a commitment to excellence, integrity, and personalized service.</p>
                </div>
                <div
                    className='about-normal-banner'
                    style={{
                        backgroundImage: `url(${midBg})`
                    }}>
                    <h2 className='bnr-heading1'>
                        Our Mission
                        <img className='img1' src={img} alt={img} />
                    </h2>
                    <p>At [Your Company Name], our mission is clear: to provide authors with the tools, guidance, and support they need to bring their stories to life and reach their audience. Whether you're a first-time author or an experienced writer, we are here to help you navigate the complexities of the publishing process and turn your manuscript into a polished and professionally published book. Our goal is to make the journey to publication as smooth, rewarding, and enjoyable as possible for every author we work with.</p>
                </div>

                <h2 className='heading'> What Sets Us Apart
                    <img src={img} alt="img" />
                </h2>
                <div className="list">
                    <div className="box">
                        <div className="upr"></div>
                        <div className="lwr">
                            <h2>Author-Centric Approach</h2>
                            <p>We prioritize the needs and goals of our authors above all else. From our initial consultation to the publication of your book and beyond, we are committed to providing you with the support and guidance you need to succeed.</p>
                        </div>
                    </div>
                    <div className="box">
                        <div className="upr"></div>
                        <div className="lwr">
                            <h2>Quality and Excellence</h2>
                            <p>We are passionate about producing high-quality books that reflect the unique voice and vision of each author. From our meticulous editing process to our attention to detail in design and production, we ensure that every book we publish meets the highest standards of excellence.</p>
                        </div>
                    </div>
                    <div className="box">
                        <div className="upr"></div>
                        <div className="lwr">
                            <h2>Innovation and Adaptability</h2>
                            <p>We embrace innovation and leverage the latest technology to streamline the publishing process and reach readers in new and exciting ways. From digital publishing to audiobooks and beyond, we are constantly exploring new opportunities to connect authors with their audience.</p>
                        </div>
                    </div>
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
                    {AccordionData.map((item, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={item.id}
                                className="accordion__input"
                                checked={openSection === item.id}
                                onChange={() => handleToggle(item.id)}
                            />
                            <label htmlFor={item.id} className="accordion__label">
                                {item.label}
                                <div className="btn">
                                    {openSection === item.id ? <FaMinus className='dt-minus' /> : <FaPlus className='dt-plus' />}
                                </div>
                            </label>
                            <div className={`accordion__content ${openSection === item.id ? 'open' : ''}`}>
                                <p>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
