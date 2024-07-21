import React, { useEffect, useState } from 'react';
import './Partners.scss';
import Banner from '../CommonComponents/Banner';
import Partner from './Partner';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const Partners = ({ ServerURL }) => {
  const [BannerData, setBannerData] = useState('');
  const [PartnerData, setPartnerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  // Fetching data
  useEffect(() => {
    axios.get(`${ServerURL}/api/PartnerBanner/get-partner-banner`)
      .then(response => {
        setBannerData(response.data);
        setLoading1(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.get(`${ServerURL}/api/Partners`)
      .then(response => {
        setPartnerData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [ServerURL]);
  return (
    <div>
      {loading1 ? (
        <p className='banner-loading'>
          <InfinitySpin
            visible={true}
            width="200"
            color="#8a07f0"
            ariaLabel="infinity-spin-loading"
          />
        </p>
      ) : (
        <Banner
          backgroundPosition='top'
          Heading={BannerData.heading}
          SubHeading={BannerData.subheading}
          imgURL={`${ServerURL}/${BannerData.backgroundImage}`}
        />
      )}
      <div className="partners-container">
        <div className="orange-big"></div>
        <div className="orange-small"></div>
        <div className="purple"></div>
        <div className="orange-big-bottom"></div>
        <div className="orange-small-bottom"></div>
        <div className="purple-bottom"></div>
        {loading ? (
          <p className='loading' style={{ margin: "9rem auto 0 auto" }}>
            <InfinitySpin
              visible={true}
              width="200"
              color="#8a07f0"
              ariaLabel="infinity-spin-loading"
            />
          </p>
        ) : (
          <div>
            {PartnerData.map((data, index) => {
              return (
                <Partner ServerURL={ServerURL} key={index} Heading={data.name} Data={data} />
              )
            })}
          </div>
        )}
        <div className="blank"></div>
      </div>
    </div>
  );
};

export default Partners;
