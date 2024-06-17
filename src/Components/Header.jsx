import React, { useState, useEffect } from 'react';
import { FaFacebookSquare, FaYoutube, FaBars } from "react-icons/fa";
import { RiInstagramFill, RiCloseLine } from "react-icons/ri";
import Logo from '../Assets/Logo.png';
import './Main.scss';
import { CiLogin } from 'react-icons/ci';
import { Link, useLocation } from 'react-router-dom';
import SignIn from './SignInOptions/SignIn';
import AvtarMenu from './AvtarMenu';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClickOutside = (event) => {
    if (isSidebarOpen && !event.target.closest('.bottom-nav')) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const userData = JSON.parse(window.localStorage.getItem("UserData"));
  const adminData = JSON.parse(window.localStorage.getItem("AdminData"));

  const LogoutFunction = () => {
    window.localStorage.removeItem("UserData");
    window.location.reload();
};

const LogoutFunctionForAdmin = () => {
    window.localStorage.removeItem("AdminData");
    window.location.reload();
};

  return (
    <header>
      <nav>
        <div className="contact">
          <a href="tel:+919000110009">
            <span>+91 9000110009</span>
          </a>
          <div className="social-icons">
            <a href="#"><FaFacebookSquare /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><RiInstagramFill /></a>
          </div>
          <a href="mailto:demo@example.com">
            <span>demo@example.com</span>
          </a>
        </div>
      </nav>
      <div className="bottom-nav">
        <div className="in">
          <div className="logo">
            <Link to='/'><img src={Logo} alt="Logo" /></Link>
          </div>
          {location.pathname !== '/admin-panel' && (
            <>
              <ul className={`nav-links ${isSidebarOpen ? 'open' : ''}`}>
                <li><Link onClick={toggleSidebar} to='/'>Home</Link></li>
                <li><Link onClick={toggleSidebar} to='/service'>Service</Link></li>
                <li><Link onClick={toggleSidebar} to='/about-us'>About Us</Link></li>
                <li><Link onClick={toggleSidebar} to='/blog'>Blog</Link></li>
                <li><Link onClick={toggleSidebar} to='/partners'>Partners</Link></li>
                <li><Link onClick={toggleSidebar} to='/Pricing'>Pricing</Link></li>
                <li><Link onClick={toggleSidebar} to='/contact-us'>Contact Us</Link></li>

                {userData ?
                  <AvtarMenu
                   userName={userData.userName}
                   LogoutFunction={LogoutFunction}
                   />
                  :
                  <li>
                    <Link onClick={() => { toggleSidebar(); toggleModal(); }} className="sign-in">Sign In<CiLogin /></Link>
                  </li>
                }
                <li><Link onClick={toggleSidebar} className="btn">Get Started</Link></li>
                <div className="close-sidebar"><button onClick={toggleSidebar}><RiCloseLine /></button></div>
              </ul>
              <button className="hamburger" onClick={toggleSidebar}>
                <FaBars />
              </button>
            </>
          )}
          {location.pathname == '/admin-panel' && adminData && (
            <>
              <ul className={`nav-links ${isSidebarOpen ? 'open' : ''}`}>
                <li><Link onClick={toggleSidebar} to='/admin-panel'>Home</Link></li>
                <li><Link onClick={toggleSidebar} to='/admin-service'>Service</Link></li>
                <li><Link onClick={toggleSidebar} to='/admin-about-us'>About Us</Link></li>
                <li><Link onClick={toggleSidebar} to='/admin-blog'>Blog</Link></li>
                <li><Link onClick={toggleSidebar} to='/admin-partners'>Partners</Link></li>
                <li><Link onClick={toggleSidebar} to='/admin-Pricing'>Pricing</Link></li>
                <li><Link onClick={toggleSidebar} to='/admin-contact-us'>Contact Us</Link></li>
                <AvtarMenu 
                userName={adminData.userName}
                LogoutFunction={LogoutFunctionForAdmin} 
                />
                <div className="close-sidebar"><button onClick={toggleSidebar}><RiCloseLine /></button></div>
              </ul>
              <button className="hamburger" onClick={toggleSidebar}>
                <FaBars />
              </button>
            </>
          )}
        </div>
      </div>
      <SignIn open={isModalOpen} handleClose={toggleModal} />
    </header>
  );
};

export default Header;
