import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import pic from '../../../Assets/OurWorkPic.png';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import design from '../../../Assets/Rectanglesmall.png';

const OurWork = () => {
    return (
        <div className='our-work'>
            <h2>
                Some of Our Work
                <img src={design} alt={design} />
            </h2>
            <p>Leave your contacts for our Senior editor to Connect with you</p>

            <div className="list">
                <OwlCarousel
                    className='owl-carousel owl-centered'
                    items={4}
                    loop
                    // autoplay
                    dots={false}
                    nav={true}
                    navText={['<', '>']}
                    responsive={{
                        0: { items: 2 },
                        600: { items: 2 },
                        768: { items: 3 },
                        992: { items: 4 },
                        1200: { items: 4 },
                    }}
                >
                    <div className='book'>
                        <img src={pic} alt={pic} />
                    </div>
                    <div className='book'>
                        <img src={pic} alt={pic} />
                    </div>
                    <div className='book'>
                        <img src={pic} alt={pic} />
                    </div>
                    <div className='book'>
                        <img src={pic} alt={pic} />
                    </div>
                    <div className='book'>
                        <img src={pic} alt={pic} />
                    </div>
                    <div className='book'>
                        <img src={pic} alt={pic} />
                    </div>
                </OwlCarousel>
            </div>
        </div>
    );
};

export default OurWork;
