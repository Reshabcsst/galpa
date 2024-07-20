import React from 'react';
import design from '../../Assets/Rectanglesmall.png';

const Partner = ({ Heading, Data, ServerURL }) => {
  // Split the imageLink string into an array of image paths
  const getImagePaths = (imageLink) => {
    if (!imageLink) return [];
    return imageLink.split(';');
  };

  return (
    <div>
      <h2 className='heading'>
        {Heading}
        <img src={design} alt="design" />
      </h2>
      <div className="providers">
        {Data && Data.imageLink && getImagePaths(Data.imageLink).map((link, index) => (
          <div key={index} className="provider">
            <img src={`${ServerURL}/${link}`} alt={`Partner ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partner;
