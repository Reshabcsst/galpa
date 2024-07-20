import React, { useEffect, useState } from 'react';
import './Partners.scss';
import Banner from '../CommonComponents/Banner';
import Partner from './Partner';
import axios from 'axios';

const Partners = ({ ServerURL }) => {
  const [BannerData, setBannerData] = useState('');
  const [PartnerData, setPartnerData] = useState([]);
  // Fetching data
  useEffect(() => {
    axios.get(`${ServerURL}/api/PartnerBanner/get-partner-banner`)
      .then(response => {
        setBannerData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get(`${ServerURL}/api/Partners`)
      .then(response => {
        setPartnerData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [ServerURL]);
  return (
    <div>
      <Banner
        backgroundPosition='top'
        Heading={BannerData.heading}
        SubHeading={BannerData.subheading}
        imgURL={`${ServerURL}/${BannerData.backgroundImage}`}
      />
      <div className="partners-container">
        <div className="orange-big"></div>
        <div className="orange-small"></div>
        <div className="purple"></div>
        <div className="orange-big-bottom"></div>
        <div className="orange-small-bottom"></div>
        <div className="purple-bottom"></div>

        {PartnerData.map((data, index) => {
          return (
            <Partner ServerURL={ServerURL} key={index} Heading={data.name} Data={data} />
          )
        })}
        <div className="blank"></div>
      </div>
    </div>
  );
};

export default Partners;
