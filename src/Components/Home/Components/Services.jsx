import React, { useEffect, useState } from 'react';
import shadow from '../../../Assets/ServicebackgroundPink.png';
import shadow1 from '../../../Assets/ServicebackgroundSkin.png';
import design from '../../../Assets/Rectanglesmall.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const Services = ({ toggleModal, ServerURL }) => {
    const [ServicesData, setServicesData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetching  data
    useEffect(() => {
        axios.get(`${ServerURL}/api/Services/get-services`)
            .then(response => {
                setServicesData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    const displayedServices = ServicesData.slice(0, 3);
    const getShadowImage = (index) => {
        return index % 2 === 0 ? shadow : shadow1;
    };

    return (
        <div className='services'>
            <h2>Our Services<img src={design} alt='design' /></h2>
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
                <div className="cards1">
                    {displayedServices.map((service, index) => (
                        <div onClick={() => { toggleModal() }} className="card1" key={index}>
                            <div className="head">
                                <div className="imgs">
                                    <img className='main' src={`${ServerURL}/${service.image}`} alt={service.name} />
                                    <img className='shadow' src={getShadowImage(index)} alt={service.img2} />
                                </div>
                                <h2>{service.name}</h2>
                            </div>
                            <p>{service.details}</p>
                        </div>
                    ))}
                </div>
            )}

            <Link to='/service'><button>More Service</button></Link>

        </div>
    );
};

export default Services;
