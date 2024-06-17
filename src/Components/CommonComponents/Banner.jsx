import React from 'react';
import design from '../../Assets/Rectanglesmall.png';

const Banner = ({ imgURL, Heading, SubHeading, backgroundPosition }) => {
    return (
        <div
            className='service-banner'
            style={{
                backgroundImage: `url(${imgURL})`,
                backgroundPosition: backgroundPosition || 'center'
            }}>
            <div className="inr">
                <h1 className='bnr-heading'>
                    {Heading}
                    <img className='img' src={design} alt={design} />
                </h1>
                <p>{SubHeading}</p>
            </div>
        </div>
    );
};

export default Banner;
