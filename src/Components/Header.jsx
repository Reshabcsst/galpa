import React, { useState, useEffect } from 'react';
import { FaFacebookSquare, FaYoutube, FaBars } from "react-icons/fa";
import { RiInstagramFill, RiCloseLine } from "react-icons/ri";
import Logo from '../Assets/Logo.png';
import './Main.scss';
import { CiLogin } from 'react-icons/ci';
import { Link, useLocation } from 'react-router-dom';
import SignIn from './SignInOptions/SignIn';
import AvtarMenu from './AvtarMenu';
import TabMenu from './TabMenu';
import MenuItems from '../DemoData/TabMenus';

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

  // Tab Menu
  const [menuAnchor, setMenuAnchor] = useState({});

  const handleMenuOpen = (event, tab) => {
    setMenuAnchor({ ...menuAnchor, [tab]: event.currentTarget });
  };

  const handleMenuClose = (tab) => {
    setMenuAnchor({ ...menuAnchor, [tab]: null });
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
          {!location.pathname.startsWith('/admin') && (
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
         {location.pathname.startsWith('/admin') && adminData && (
            <>
              <ul className={`nav-links ${isSidebarOpen ? 'open' : ''}`}>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'home')}>Home</Link>
                  <TabMenu anchorEl={menuAnchor.home} open={Boolean(menuAnchor.home)} onClose={() => handleMenuClose('home')} menuItems={MenuItems.home} />
                </li>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'service')}>Service</Link>
                  <TabMenu anchorEl={menuAnchor.service} open={Boolean(menuAnchor.service)} onClose={() => handleMenuClose('service')} menuItems={MenuItems.service} />
                </li>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'aboutUs')}>About Us</Link>
                  <TabMenu anchorEl={menuAnchor.aboutUs} open={Boolean(menuAnchor.aboutUs)} onClose={() => handleMenuClose('aboutUs')} menuItems={MenuItems.aboutUs} />
                </li>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'blog')}>Blog</Link>
                  <TabMenu anchorEl={menuAnchor.blog} open={Boolean(menuAnchor.blog)} onClose={() => handleMenuClose('blog')} menuItems={MenuItems.blog} />
                </li>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'partners')}>Partners</Link>
                  <TabMenu anchorEl={menuAnchor.partners} open={Boolean(menuAnchor.partners)} onClose={() => handleMenuClose('partners')} menuItems={MenuItems.partners} />
                </li>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'pricing')}>Pricing</Link>
                  <TabMenu anchorEl={menuAnchor.pricing} open={Boolean(menuAnchor.pricing)} onClose={() => handleMenuClose('pricing')} menuItems={MenuItems.pricing} />
                </li>
                <li>
                  <Link onClick={(e) => handleMenuOpen(e, 'contactUs')}>Contact Us</Link>
                  <TabMenu anchorEl={menuAnchor.contactUs} open={Boolean(menuAnchor.contactUs)} onClose={() => handleMenuClose('contactUs')} menuItems={MenuItems.contactUs} />
                </li>
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