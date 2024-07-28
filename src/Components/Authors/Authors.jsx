import React, { useEffect, useState } from 'react';
import Banner from '../CommonComponents/Banner';
import axios from 'axios';
import './Author.scss';
import { InfinitySpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Authors = ({ ServerURL }) => {
    const [BannerData, setBannerData] = useState('');
    const [AuthorData, setAuthorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const navigate = useNavigate();
    // Fetching data
    useEffect(() => {
        // Banner
        axios.get(`${ServerURL}/api/AuthorBanner/get-author-banner`)
            .then(response => {
                setBannerData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        //  Authors
        axios.get(`${ServerURL}/api/Authors`)
            .then(response => {
                setAuthorData(response.data);
                setLoading1(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [ServerURL]);

    const seeMorePage = (id) => {
        navigate(`/author/${id}`);
    };
    return (
        <div >
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
                <Banner
                    Heading={BannerData.heading}
                    SubHeading={BannerData.subheading}
                    imgURL={`${ServerURL}/${BannerData.backgroundImage}`}
                />
            )}

            {loading1 ? (
                <p className='loading' style={{ width: "fit-content", margin: "auto" }}>
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
                <div className='auth_container'>
                    {AuthorData.map((author, index) => {
                        return (
                            <div className='auth_data' key={index}>
                                <img src={`${ServerURL}${author.profilePic}`} alt="" />
                                <p className='name'>{author.name}</p>
                                <p className='details'>{author.details.slice(0, 100)}</p>
                                <button className='see_more' onClick={() => { seeMorePage(author.id) }}>See More</button>
                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    );
};

export default Authors;
