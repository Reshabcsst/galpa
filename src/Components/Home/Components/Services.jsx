import React from 'react';
import shadow from '../../../Assets/ServicebackgroundPink.png';
import shadow1 from '../../../Assets/ServicebackgroundSkin.png';
import design from '../../../Assets/Rectanglesmall.png';
import ServicesData from '../../../DemoData/Services';
import { Link } from 'react-router-dom';

const Services = ({toggleModal}) => {
    const displayedServices = ServicesData.slice(0, 3);
    const getShadowImage = (index) => {
        return index % 2 === 0 ? shadow : shadow1;
    };

    return (
        <div className='services'>
            <h2>Our Services<img src={design} alt='design' /></h2>
            <div className="cards1">
                {displayedServices.map((service, index) => (
                    <div onClick={()=>{toggleModal()}} className="card1" key={index}>
                        <div className="head">
                            <div className="imgs">
                                <img className='main' src={service.img} alt={service.name} />
                                <img className='shadow' src={getShadowImage(index)} alt={service.img2} />
                            </div>
                            <h2>{service.name}</h2>
                        </div>
                        <p>{service.details}</p>
                    </div>
                ))}
            </div>

            <Link to='/service'><button>More Service</button></Link>

        </div>
    );
};

export default Services;
