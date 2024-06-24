import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Home from './Components/Home/Home';
import Service from './Components/Service/Service';
import About from './Components/AboutUs/About';
import Contact from './Components/ContactUs/Contact';
import Partners from './Components/Partners/Partners';
import Blog from './Components/Blog/Blog';
import BlogContent from './Components/Blog/BlogContent/BlogContent';
import ScrollToTop from './ScrollToTop';
import AdminLogin from './AdminPanel/AdminLogin';
import Pricing from './Components/Pricing/Pricing';
import AdminHome from './AdminPanel/AdminHome';
import CarouselTable from './AdminPanel/AdminTabsComponent/HomeTabs/BannerCarousel/HomeCarousel';
import LoginToVisitThePage from './AdminPanel/LoginToVisitThePage';
import OurWorkCarouselTable from './AdminPanel/AdminTabsComponent/HomeTabs/OurWorkCarousel/OurWorkCarousel';
import GalpaCanHelp from './AdminPanel/AdminTabsComponent/HomeTabs/GalpaCanHelp/GalpaCanHelp';
import MostPopularAuthors from './AdminPanel/AdminTabsComponent/HomeTabs/MostPopularAuthors/MostPopularAuthors';
import EnquireFormGrid from './AdminPanel/AdminTabsComponent/HomeTabs/EnqurieForm/EnquireForm';
import WhatAuthorSays from './AdminPanel/AdminTabsComponent/HomeTabs/WhatAuthorSays/WhatAuthorSays';

function App() {

  const isAdminLogin = JSON.parse(window.localStorage.getItem("AdminData"));
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/service' element={<Service />} />
        <Route path='/Pricing' element={<Pricing />} />
        <Route path='/about-us' element={<About />} />
        <Route path='/contact-us' element={<Contact />} />
        <Route path='/partners' element={<Partners />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/blog-content/:id' element={<BlogContent />} />

        {/* Admin */}
        <Route path='/admin-panel' element={isAdminLogin ? <AdminHome /> : <AdminLogin />} />
        <Route path='/admin-home-banner-carousel' element={isAdminLogin ? <CarouselTable /> : <LoginToVisitThePage />} />
        <Route path='/admin-home-our-work-carousel' element={isAdminLogin ? <OurWorkCarouselTable /> : <LoginToVisitThePage />} />
        <Route path='/admin-home-galpa-can-help' element={isAdminLogin ? <GalpaCanHelp /> : <LoginToVisitThePage />} />
        <Route path='/admin-home-most-popular-authors' element={isAdminLogin ? <MostPopularAuthors /> : <LoginToVisitThePage />} />
        <Route path='/admin-home-what-authors-say' element={isAdminLogin ? <WhatAuthorSays /> : <LoginToVisitThePage />} />
        <Route path='/admin-home-enquire-form' element={isAdminLogin ? <EnquireFormGrid /> : <LoginToVisitThePage />} />
        <Route path='/*' element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
