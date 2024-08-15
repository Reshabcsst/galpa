import React from 'react';
import './Main.scss';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from '../Assets/Logo footer.png';
import { RiTwitterXLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    return (
        <>
            {!location.pathname.startsWith('/admin') && (
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <Link to='/'><img src={Logo} alt="logo" /></Link>
                                <h3>Galpa</h3>
                                <p>Golpa is passionate about books and committed to helping authors bring their stories to life. As a leading provider of comprehensive publishing services, including writing, editing, proofreading, and marketing services, we strive to provide authors with the tools and resources they need to publish and distribute their unique voices with the world.</p>
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
                                <p>+91 9000110009</p>
                                <p>demo@gmail.com</p>
                                <p>BB 42, BB Block, Sector I, Salt Lake, Bidhannagar, Kolkata</p>
                            </div>
                            <div className="col">
                                <h3>Social Media</h3>
                                <div className="social-icons">
                                    <a aria-label='facebook' href="#"><FaFacebookF /></a>
                                    <a aria-label='instagram' href="#"><FaInstagram /></a>
                                    <a aria-label='twitter' href="#"><RiTwitterXLine /></a>
                                    <a aria-label='linkedin' href="#"><FaLinkedinIn /></a>
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
