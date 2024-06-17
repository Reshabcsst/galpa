import React, { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Home.scss';
import HomeCarousel from './Components/Carousel';
import Cards from './Components/Cards';
import AboutCompany from './Components/AboutCompany';
import Services from './Components/Services';
import Help from './Components/Help';
import OurWork from './Components/OurWork';
import Authors from './Components/Authors';
import AuthorSays from './Components/AuthorSays';
import EnquireForm from './Components/EnquireForm';
import Popularity from './Components/Popularity';
import Bookprint from '../BookPrint/Bookprint';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
    return (
        <div>
            <HomeCarousel />
            <div className='home'>
                <Cards />
                <AboutCompany />
                <Services toggleModal={toggleModal}/>
            </div>
            <Help />
            <div className="pink-bg">
                <OurWork />
                <Authors />
                <AuthorSays />
                <EnquireForm />
            </div>
            <Popularity />
            <Bookprint open={isModalOpen} handleClose={toggleModal}/>
        </div>
    );
};

export default Home;
