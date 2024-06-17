import React from 'react';
import './Partners.scss';
import bg from '../../Assets/partnerBg.jpg';
import Banner from '../CommonComponents/Banner';
import Partner from './Partner';
import PartnersData from '../../DemoData/PartnersData';

const Partners = () => {
  return (
    <div>
      <Banner
        backgroundPosition='top'
        Heading='Our Partner'
        SubHeading='We are proud to work alongside our valued partners in the book publishing journey. From talented designers to expert editors, their dedication and expertise ensure our authors stories shine'
        imgURL={bg}
      />
      <div className="partners-container">
        <div className="orange-big"></div>
        <div className="orange-small"></div>
        <div className="purple"></div>
        <div className="orange-big-bottom"></div>
        <div className="orange-small-bottom"></div>
        <div className="purple-bottom"></div>
        <Partner Heading='Kindle Provider' Data={PartnersData} />
        <Partner Heading='Publication Partner' Data={PartnersData} />
        <Partner Heading='Audio Doubt Partner' Data={PartnersData} />
        <Partner Heading='Printing Partner' Data={PartnersData} />
        <Partner Heading='Digital Partner' Data={PartnersData} />
        <Partner Heading='Technological Partner' Data={PartnersData} />
        <Partner Heading='Service Partner' Data={PartnersData} />
        <Partner Heading='Authorised Partner' Data={PartnersData} />
        <Partner Heading='Marketing Partner' Data={PartnersData} />
        <div className="blank"></div>
      </div>
    </div>
  );
};

export default Partners;
