import React from 'react';
import './Main.scss';
import CarouselForm from './AdminTabsComponent/HomeCarousel';

const AdminHome = () => {


    return (
        <div className='home_input'>
           {/* <h1>Welcome To Admin Panel</h1> */}
            <CarouselForm />
        </div>
    );
};

export default AdminHome;
