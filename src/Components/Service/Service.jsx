import React, { useState } from 'react';
import './Service.scss';
import img from '../../Assets/ServicecBannerBG.jpg';
import Banner from '../CommonComponents/Banner';
import Services from './Components/Services';
import Bookprint from '../BookPrint/Bookprint';

const Service = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
    return (
        <div>
            <Banner imgURL={img} Heading='Our Service' SubHeading='Transform your manuscript into a masterpiece with our professional Book publishing service' />
            <Services toggleModal={toggleModal}/>
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
