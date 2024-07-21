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
import Popularity from './AdminPanel/AdminTabsComponent/HomeTabs/Popularity/Popularity';
import Banner from './AdminPanel/AdminTabsComponent/Services/Banner/Banner';
import Services from './AdminPanel/AdminTabsComponent/Services/Services/Services';
import AboutBanner from './AdminPanel/AdminTabsComponent/About/Banner/AboutBanner';
import AboutDetails from './AdminPanel/AdminTabsComponent/About/AboutDetails/AboutDetails';
import Cards from './AdminPanel/AdminTabsComponent/About/Cards/Cards';
import FAQ from './AdminPanel/AdminTabsComponent/About/FAQ/FAQ';
import BlogPosts from './AdminPanel/AdminTabsComponent/Blogs/BlogList/BlogPosts';
import BlogBanner from './AdminPanel/AdminTabsComponent/Blogs/Banner/Banner';
import AddPartners from './AdminPanel/AdminTabsComponent/Partners/Partners/AddPartners';
import PartnerBanner from './AdminPanel/AdminTabsComponent/Partners/Banner/Banner';
import ContactBanner from './AdminPanel/AdminTabsComponent/Contact/Banner/ContactBanner';
import ContactForm from './AdminPanel/AdminTabsComponent/Contact/ContactForm/ContactForm';
import NeedHelp from './AdminPanel/AdminTabsComponent/Contact/NeedHelpSayHello/NeedHelp';
import ContactGalpa from './AdminPanel/AdminTabsComponent/Contact/ContactGalpa/ContactGalpa';
import AdminPricing from './AdminPanel/AdminTabsComponent/Pricing/AdminPricing';
import AddAdmin from './AdminPanel/AddAdmin';

function App() {
  const ServerURL='http://localhost:5241';

  const isAdminLogin = JSON.parse(window.localStorage.getItem("AdminData"));
  return (
    <BrowserRouter>
      <Header ServerURL={ServerURL}/>
      <ScrollToTop />
      <Routes>
        {/* User */}
        <Route path='/' element={<Home ServerURL={ServerURL}/>} />
        <Route path='/service' element={<Service ServerURL={ServerURL}/>} />
        <Route path='/Pricing' element={<Pricing ServerURL={ServerURL}/>} />
        <Route path='/about-us' element={<About ServerURL={ServerURL}/>} />
        <Route path='/contact-us' element={<Contact ServerURL={ServerURL}/>} />
        <Route path='/partners' element={<Partners ServerURL={ServerURL}/>} />
        <Route path='/blog' element={<Blog ServerURL={ServerURL}/>} />
        <Route path='/blog-content/:id' element={<BlogContent ServerURL={ServerURL}/>} />

        {/* Admin */}
        <Route path='/admin-panel' element={isAdminLogin ? <AdminHome /> : <AdminLogin ServerURL={ServerURL}/>} />
        <Route path='/admin-home-banner-carousel' element={isAdminLogin ? <CarouselTable ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-home-our-work-carousel' element={isAdminLogin ? <OurWorkCarouselTable ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-home-galpa-can-help' element={isAdminLogin ? <GalpaCanHelp ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-home-most-popular-authors' element={isAdminLogin ? <MostPopularAuthors ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-home-what-authors-say' element={isAdminLogin ? <WhatAuthorSays ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-home-enquire-form' element={isAdminLogin ? <EnquireFormGrid ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-home-popularity' element={isAdminLogin ? <Popularity ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-service-banner' element={isAdminLogin ? <Banner ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-service' element={isAdminLogin ? <Services ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-about-banner' element={isAdminLogin ? <AboutBanner ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-about-details' element={isAdminLogin ? <AboutDetails ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-about-cards' element={isAdminLogin ? <Cards ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-about-faq' element={isAdminLogin ? <FAQ ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-blog-banner' element={isAdminLogin ? <BlogBanner ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-blog-post' element={isAdminLogin ? <BlogPosts ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-partners' element={isAdminLogin ? <AddPartners ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-partner-banner' element={isAdminLogin ? <PartnerBanner ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-contact-banner' element={isAdminLogin ? <ContactBanner ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-contact-form' element={isAdminLogin ? <ContactForm ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-contact-need-help' element={isAdminLogin ? <NeedHelp ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-contact-galpa-details' element={isAdminLogin ? <ContactGalpa ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-Pricing-details' element={isAdminLogin ? <AdminPricing ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/admin-add' element={isAdminLogin ? <AddAdmin ServerURL={ServerURL}/> : <LoginToVisitThePage />} />
        <Route path='/*' element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
