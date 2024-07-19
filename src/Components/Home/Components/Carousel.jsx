import React, { useEffect, useState } from 'react'
import Design from '../../../Assets/Rectangle 167.png';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';


const HomeCarousel = ({ServerURL}) => {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetching carousel data
    useEffect(() => {
        axios.get(`${ServerURL}/api/HomeBannerCarousel/get-home-banner-carousel`)
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
        <div>
            {loading ? (
                <p className='banner-loading'>
                   <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                    </p>
            ) : (
                <Carousel
                    showStatus={false}
                    showArrows={false}
                    showThumbs={false}
                    autoPlay
                    swipeable={false}
                    emulateTouch
                    infiniteLoop={true}
                >
                    {carousels.map((carousel, index) =>
                    (
                        <div key={index} style={{ backgroundImage: `url(${ServerURL}/${carousel.backgroundImage})` }} className='home-slider'>
                            <div className="inr">
                                <h1 className='bnr-heading'>{carousel.heading}
                                    <img className='img' src={Design} alt="design" />
                                </h1>
                                <p className='bnr-subheading'>{carousel.subheading}</p>
                                <button className="bnr-btn">Let’s Get Started</button>
                            </div>

                        </div>
                    ))}
                </Carousel>
            )}
        </div>
    );
};

export default HomeCarousel;
