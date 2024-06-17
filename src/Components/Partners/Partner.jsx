import React from 'react';
import design from '../../Assets/Rectanglesmall.png';

const Partner = ({ Heading, Data }) => {
  return (
    <div>
      <h2 className='heading'>
        {Heading}
        <img src={design} alt={design} />
      </h2>
      <div className="providers">
        {
          Data.map((partner, index) => {
            return (
              <div key={index} className="provider">
                <img src={partner.img} alt={partner.img} />
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default Partner;
