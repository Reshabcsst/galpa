import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import design from '../../../Assets/Rectanglesmall.png';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const OurWork = () => {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetching carousel data
    useEffect(() => {
        axios.get('http://localhost:5241/api/OurWorkCarousel/get-our-work-carousel')
            .then(response => { 
                setCarousels(response.data); 
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                // setLoading(false);
            });
    }, []); 

    return (
        <div className='our-work'>
            <h2>
                Some of Our Work
                <img src={design} alt="design" />
            </h2>
            <p>Leave your contacts for our Senior editor to Connect with you</p>

            <div className="list">
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
                    <OwlCarousel
                        className='owl-carousel owl-centered'
                        items={4}
                        loop
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
                        {carousels.map((carousel, index) => (
                            <div key={index} className='book'>
                                <img src={`http://localhost:5241/${carousel.imagePath}`} alt={carousel.imagePath} />
                            </div>
                        ))}
                    </OwlCarousel>
                )}
            </div>
        </div>
    );
};

export default OurWork;
