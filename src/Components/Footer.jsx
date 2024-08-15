import React, { useEffect, useState } from 'react';
import './Main.scss';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from '../Assets/Logo footer.png';
import { RiTwitterXLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Footer = ({ ServerURL }) => {
    const location = useLocation();

    const [data, setData] = useState('');
    // Fetching Company data
    useEffect(() => {
        axios.get(`${ServerURL}/api/CompanyDetails/get-company-details`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <>
            {!location.pathname.startsWith('/admin') && (
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <Link to='/'><img src={Logo} alt="logo" /></Link>
                                <h3>Galpa</h3>
                                <p>{data.companyBio}</p>
                            </div>
                            <div className="col">
                                <h3>Company</h3>
                                <ul>
                                    <li><Link to='/'>Home</Link></li>
                                    <li><Link to='/service'>Service</Link></li>
                                    <li><Link to='/about-us'>About Us</Link></li>
                                    <li><Link to='/contact-us'>Contact Us</Link></li>
                                </ul>
                            </div>
                            <div className="col">
                                <h3>Contact Us</h3>
                                <p>{data.phoneNumber && <>+91 {data.phoneNumber}</>}</p>
                                <p>{data.email}</p>
                                <p>{data.address}</p>
                            </div>
                            <div className="col">
                                <h3>Social Media</h3>
                                <div className="social-icons">
                                    <a aria-label='facebook' href={data.facebookLink}><FaFacebookF /></a>
                                    <a aria-label='instagram' href={data.instagramLink}><FaInstagram /></a>
                                    <a aria-label='twitter' href={data.twitterLink}><RiTwitterXLine /></a>
                                    <a aria-label='linkedin' href={data.linkedInLink}><FaLinkedinIn /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </>
    );
};

export default Footer;
