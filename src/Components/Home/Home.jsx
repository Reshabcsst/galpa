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

const Home = ({ ServerURL }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <div>
            <HomeCarousel ServerURL={ServerURL} />
            <div className='home'>
                <Cards ServerURL={ServerURL} />
                <AboutCompany ServerURL={ServerURL} />
                <Services toggleModal={toggleModal} ServerURL={ServerURL} />
            </div>
            <Help ServerURL={ServerURL} />
            <div className="pink-bg">
                <OurWork ServerURL={ServerURL} />
                <Authors ServerURL={ServerURL} />
                <AuthorSays ServerURL={ServerURL} />
                <EnquireForm ServerURL={ServerURL} />
            </div>
            <Popularity ServerURL={ServerURL} />
            <Bookprint open={isModalOpen} handleClose={toggleModal} />
        </div>
    );
};

export default Home;
