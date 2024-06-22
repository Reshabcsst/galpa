import React from 'react';
import '../AdminPanel/Main.scss';
import CarouselTable from './AdminTabsComponent/HomeTabs/BannerCarousel/HomeCarousel';
import OurWorkCarouselTable from './AdminTabsComponent/HomeTabs/OurWorkCarousel/OurWorkCarousel';

const AdminHome = () => {


    return (
        <div className='home_input'>
           <h1>Welcome To Admin Panel</h1>
            {/* <CarouselTable/> */}
            {/* <OurWorkCarouselTable/> */}
        </div>
    );
};

export default AdminHome;
