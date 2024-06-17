import React from 'react';
import shadow from '../../../Assets/ServicebackgroundPink.png';
import shadow1 from '../../../Assets/ServicebackgroundSkin.png';
import ServicesData from '../../../DemoData/Services';

const Services = ({ toggleModal }) => {
    const getShadowImage = (index) => {
        return index % 2 === 0 ? shadow : shadow1;
    };

    return (
        <div className='in'>
            <div className='services1'>
                <div className="cards2">
                    {ServicesData.map((service, index) => (
                        <div onClick={() => { toggleModal() }} className="card2" key={index}>
                            <div className="head1">
                                <div className="imgs1">
                                    <img className='main1' src={service.img} alt={service.name} />
                                    <img className='shadow1' src={getShadowImage(index)} alt='shadow' />
                                </div>
                                <h2>{service.name}</h2>
                            </div>
                            <p>{service.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;

