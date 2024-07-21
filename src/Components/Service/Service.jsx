import React, { useEffect, useState } from 'react';
import './Service.scss';
import Banner from '../CommonComponents/Banner';
import Services from './Components/Services';
import Bookprint from '../BookPrint/Bookprint';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const Service = ({ ServerURL }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [BannerData, setBannerData] = useState('');
    // Fetching data
    useEffect(() => {
        axios.get(`${ServerURL}/api/ServiceBanner/get-service-banner`)
            .then(response => {
                setBannerData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
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
                <Banner imgURL={`${ServerURL}/${BannerData.backgroundImage}`} Heading={BannerData.heading} SubHeading={BannerData.subheading} />
            )}
            
            <Services toggleModal={toggleModal} ServerURL={ServerURL} />
            <div className="get-in-touch">
                <div className="inr">
                    <h2 className='heading'>GET IN TOUCH</h2>
                    <p className='subheading'>Let's discuss ideas and work on innovative solutions</p>
                    <button>Explore with Us</button>
                </div>
            </div>
            <Bookprint open={isModalOpen} handleClose={toggleModal} />
        </div>
    );
};

export default Service;
