import React from 'react';
import design from '../../../Assets/whiteheadingdesign.png';
import { IoCallOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';

const Help = () => {
    const handleCallClick = () => {
        window.location.href = 'tel:+919000110009';
    };

    const handleEmailClick = () => {
        window.location.href = 'mailto:demo@gmail.com';
    };
    return (
        <div className='help'>
            <div className="inr">
                <h2>Galpa Can Help You
                    <img src={design} alt={design} />
                </h2>
                <p>We are passionate about books and committed to helping authors bring their stories to life.
                    As a leading provider of comprehensive book writing, editing, proofreading, and publishing services</p>
                <div className="btns">
                    <button onClick={handleCallClick}>
                        <IoCallOutline /> +91 90001 10009
                    </button>
                    <button onClick={handleEmailClick}>
                        <CiMail /> demo@gmail.com
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Help;
