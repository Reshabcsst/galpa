import React, { useEffect, useState } from 'react';
import './Service.scss';
import Banner from '../CommonComponents/Banner';
import Services from './Components/Services';
import Bookprint from '../BookPrint/Bookprint';
import axios from 'axios';

const Service = ({ServerURL}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [BannerData, setBannerData] = useState('');
    // Fetching data
    useEffect(() => {
        axios.get(`${ServerURL}/api/ServiceBanner/get-service-banner`)
            .then(response => {
                setBannerData(response.data);
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
            <Banner imgURL={`${ServerURL}/${BannerData.backgroundImage}`} Heading={BannerData.heading} SubHeading={BannerData.subheading} />
            <Services toggleModal={toggleModal} ServerURL={ServerURL}/>
            <div className="get-in-touch">
                <div className="inr">
                    <h2 className='heading'>GET IN TOUCH</h2>
                    <p className='subheading'>Let's discuss ideas and work on innovative solutions</p>
                    <button>Explore with Us</button>
                </div>
            </div>
            <Bookprint open={isModalOpen} handleClose={toggleModal}/>
        </div>
    );
};

export default Service;
