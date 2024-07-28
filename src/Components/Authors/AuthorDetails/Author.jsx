import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import design from '../../../Assets/Rectanglesmall.png';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { InfinitySpin } from 'react-loader-spinner';

const Author = ({ ServerURL }) => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const [AuthorData, setAuthorData] = useState('');
    const [loading, setLoading] = useState(true);
    // Fetching data
    useEffect(() => {
        axios.get(`${ServerURL}/api/Authors/${id}`)
            .then(response => {
                setAuthorData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [pathname]);

    if (!AuthorData) {
        return (
            <div className='blog-not-found'>
                <p>Author not found</p>
            </div>
        );
    }
    return (
        <div className='author_details_container'>
            <div className="details_section">
                <div className="lft">
                    <img src={`${ServerURL}${AuthorData.profilePic}`} alt={AuthorData.name} />
                    <p className='name'>{AuthorData.name}</p>
                </div>

                <div className="details_part">
                    <p className='details'>{AuthorData.details}</p>
                </div>
            </div>
            <div className='our-work'>
                <h2>
                    Some Of My Work
                    <img src={design} alt="design" />
                </h2>
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
                            {AuthorData.books.map((carousel, index) => (
                                <div key={index} className='book'>
                                    <img src={`${ServerURL}/${carousel.bookImagePath}`} alt={carousel.imagePath} />
                                </div>
                            ))}
                        </OwlCarousel>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Author;
