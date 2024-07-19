import React, { useEffect, useState } from 'react';
import shadow from '../../../Assets/ServicebackgroundPink.png';
import shadow1 from '../../../Assets/ServicebackgroundSkin.png';
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


    const getShadowImage = (index) => {
        return index % 2 === 0 ? shadow : shadow1;
    };

    return (
        <div className='in'>
            <div className='services1'>
                {loading ? (
                    <p className='loading' style={{ marginBottom: "20rem" }}>
                        <InfinitySpin
                            visible={true}
                            width="200"
                            color="#8a07f0"
                            ariaLabel="infinity-spin-loading"
                        />
                    </p>
                ) : (
                    <div className="cards2">
                        {ServicesData.map((service, index) => (
                            <div onClick={() => { toggleModal() }} className="card2" key={index}>
                                <div className="head1">
                                    <div className="imgs1">
                                        <img className='main1' src={`${ServerURL}/${service.image}`} alt={service.name} />
                                        <img className='shadow1' src={getShadowImage(index)} alt='shadow' />
                                    </div>
                                    <h2>{service.name}</h2>
                                </div>
                                <p>{service.details}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;

