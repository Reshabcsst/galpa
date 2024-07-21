import React, { useEffect, useState } from 'react';
import './Pricing.scss';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const Pricing = ({ ServerURL }) => {
  const [PricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching data
  useEffect(() => {
    axios.get(`${ServerURL}/api/PricingDetails/get-service-details`)
      .then(response => {
        setPricingData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [ServerURL]);

  return (
    <div className="pricing-container">
      <h1 className='header'>Pick the best choice for you</h1>

      {loading ? (
        <p className='loading'>
          <InfinitySpin
            visible={true}
            width="200"
            color="#8a07f0"
            ariaLabel="infinity-spin-loading"
          />
        </p>
      ) : (
        <div className="cards">
          {PricingData.length > 0 ? PricingData.map((pricing, index) => (
            <div key={index} className={`pricing-card ${pricing.service.toLowerCase() === 'pro' ? 'featured' : ''}`}>
              <div className="pricing-header">
                <h3>{pricing.service}</h3>
                <div className="price">
                  <span className="dollar">$</span>
                  <span className="amount">{pricing.price}</span>
                  <span className="period">/mo</span>
                </div>
              </div>
              <div className="pricing-body">
                <ul className="features">
                  <li className={!pricing.feature1 ? 'disabled' : ''}>{pricing.feature1 || 'N/A'}</li>
                  <li className={!pricing.feature2 ? 'disabled' : ''}>{pricing.feature2 || 'N/A'}</li>
                  <li className={!pricing.feature3 ? 'disabled' : ''}>{pricing.feature3 || 'N/A'}</li>
                  <li className={!pricing.feature4 ? 'disabled' : ''}>{pricing.feature4 || 'N/A'}</li>
                  <li className={!pricing.feature5 ? 'disabled' : ''}>{pricing.feature5 || 'N/A'}</li>
                </ul>
                <button className="cta-button">Get Started</button>
              </div>
            </div>
          )) : <p>No pricing data available</p>}
        </div>
      )}

      {loading ? (
        <p className='loading'>
          <InfinitySpin
            visible={true}
            width="200"
            color="#8a07f0"
            ariaLabel="infinity-spin-loading"
          />
        </p>
      ) : (
        <div className="pack_details">
          {PricingData.map((pricing, index) => (
            <div key={index} className="details">
              <h2>{pricing.service}</h2>
              <p>{pricing.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pricing;
