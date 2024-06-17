import React from 'react';
import img from '../../../Assets/Rectanglesmall.png';
import pic1 from '../../../Assets/FirstImage.png';
import pic2 from '../../../Assets/SecondImage1.png';
import frame from '../../../Assets/FirstFrametop.png';
import frame2 from '../../../Assets/FirstFrameBottom.png';
import Bframe from '../../../Assets/SecondFrame2.png';
import Bframe2 from '../../../Assets/Secondframe.png';

const AboutCompany = () => {
    return (
        <div className='home-about'>
            <div className='about-company'>
                <div className="lft">
                    <h2>About Our Company
                        <img src={img} alt="design" />
                    </h2>
                    <p>We are passionate about books and committed to helping authors
                        bring their stories to life. As a leading provider of comprehensive book
                        writing, editing, proofreading, and publishing services, we strive to
                        empower authors to achieve their publishing goals and share their
                        unique voices with the world.

                        We are passionate about books and committed to helping authors
                        bring their stories to life. As a leading provider of comprehensive book
                        writing, editing, proofreading, and publishing services</p>
                    <button>Know More</button>
                </div>
                <div className="rht">
                    <img className='top' src={frame} alt="Frame" />
                    <img className='bottom' src={frame2} alt="Frame" />
                    <img src={pic1} alt="FirstImage" />
                </div>
            </div>


            <div className='about-company'>
                <div className="rht">
                <img className='top' src={Bframe2} alt="Frame" />
                    <img className='bottom' src={Bframe} alt="Frame" />
                    <img src={pic2} alt="SecondImage" />
                </div>
                <div className="lft">
                    <h2>
                        Why We are
                        <img src={img} alt="design" />
                    </h2>
                    <p>We are passionate about books and committed to helping authors
                        bring their stories to life. As a leading provider of comprehensive book
                        writing, editing, proofreading, and publishing services, we strive to
                        empower authors to achieve their publishing goals and share their
                        unique voices with the world.

                        We are passionate about books and committed to helping authors
                        bring their stories to life. As a leading provider of comprehensive book
                        writing, editing, proofreading, and publishing services</p>
                    <button>Let’s Start Writing Book With Us</button>
                </div>
            </div>
        </div>

    );
};

export default AboutCompany;
