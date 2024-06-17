import React from 'react'
import Design from '../../../Assets/Rectangle 167.png';
import { Carousel } from 'react-responsive-carousel';


const HomeCarousel = () => {
    return (
        <Carousel infiniteLoop showStatus={false} showArrows={false} showThumbs={false} autoPlay swipeable={false} emulateTouch>
            <div className='home-slider'>
                <div className="inr">
                    <h1 className='bnr-heading'>Writing, Editing, Proofreading
                        And Publishing Services
                        <img className='img' src={Design} alt="design" />
                    </h1>
                    <p className='bnr-subheading'>Writing, Editing, Proofreading and Publishing Service. Writing,
                        Editing, Proofreading Writing, Editing, Proofreading and Publishing Service</p>
                    <button className="bnr-btn">Let’s Get Started</button>
                </div>

            </div>
            <div className='home-slider'>
                <div className="inr">
                    <h1 className='bnr-heading'>Writing, Editing, Proofreading
                        And Publishing Services
                        <img className='img' src={Design} alt="design" />
                    </h1>
                    <p className='bnr-subheading'>Writing, Editing, Proofreading and Publishing Service. Writing,
                        Editing, Proofreading Writing, Editing, Proofreading and Publishing Service</p>
                    <button className="bnr-btn">Let’s Get Started</button>
                </div>
            </div>
            <div className='home-slider'>
                <div className="inr">
                    <h1 className='bnr-heading'>Writing, Editing, Proofreading
                        And Publishing Services
                        <img className='img' src={Design} alt="design" />
                    </h1>
                    <p className='bnr-subheading'>Writing, Editing, Proofreading and Publishing Service. Writing,
                        Editing, Proofreading Writing, Editing, Proofreading and Publishing Service</p>
                    <button className="bnr-btn">Let’s Get Started</button>
                </div>
            </div>
        </Carousel>
    );
};

export default HomeCarousel;
