import React from 'react';
import './Pricing.scss';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h1 className='header'>Pick the best choice for you</h1>

      <div className="cards">
        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Basic</h3>
            <div className="price">
              <span className="dollar">$</span>
              <span className="amount">9</span>
              <span className="period">/mo</span>
            </div>
          </div>
          <div className="pricing-body">
            <ul className="features">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li className="disabled">Feature 3</li>
              <li className="disabled">Feature 4</li>
              <li>Feature 5</li>
            </ul>
            <button className="cta-button">Get Started</button>
          </div>
        </div>

        <div className="pricing-card featured">
          <div className="pricing-header">
            <h3>Pro</h3>
            <div className="price">
              <span className="dollar">$</span>
              <span className="amount">19</span>
              <span className="period">/mo</span>
            </div>
          </div>
          <div className="pricing-body">
            <ul className="features">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
              <li>Feature 5</li>
            </ul>
            <button className="cta-button">Get Started</button>
          </div>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Enterprise</h3>
            <div className="price">
              <span className="dollar">$</span>
              <span className="amount">49</span>
              <span className="period">/mo</span>
            </div>
          </div>
          <div className="pricing-body">
            <ul className="features">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
              <li>Feature 5</li>
            </ul>
            <button className="cta-button">Get Started</button>
          </div>
        </div>
      </div>

      <div className="pack_details">
        <div className="details">
          <h2>Basic</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil at labore, dolore reprehenderit dolor atque possimus sapiente saepe necessitatibus tempora beatae sed nisi aut modi mollitia consequuntur dolorum. Excepturi adipisci sapiente iste expedita dolore quod! Quam optio minus aut soluta! Quam expedita quos consectetur, rerum harum dicta natus corrupti aut!</p>
        </div>
        <div className="details">
          <h2>Pro</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil at labore, dolore reprehenderit dolor atque possimus sapiente saepe necessitatibus tempora beatae sed nisi aut modi mollitia consequuntur dolorum. Excepturi adipisci sapiente iste expedita dolore quod! Quam optio minus aut soluta! Quam expedita quos consectetur, rerum harum dicta natus corrupti aut!</p>
        </div>
        <div className="details">
          <h2>Enterprise</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil at labore, dolore reprehenderit dolor atque possimus sapiente saepe necessitatibus tempora beatae sed nisi aut modi mollitia consequuntur dolorum. Excepturi adipisci sapiente iste expedita dolore quod! Quam optio minus aut soluta! Quam expedita quos consectetur, rerum harum dicta natus corrupti aut!</p>
        </div>
      </div>

    </div>
  );
};

export default Pricing;
