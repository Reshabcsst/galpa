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

        <Route path='/*' element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
