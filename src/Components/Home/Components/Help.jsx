import React, { useEffect, useState } from 'react';
import design from '../../../Assets/whiteheadingdesign.png';
import { IoCallOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const Help = ({ServerURL}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetching carousel data
    useEffect(() => {
        axios.get(`${ServerURL}/api/GalpaCanHelp/get-company-info`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleCallClick = () => {
        window.location.href = `tel:+91${data.phoneNumber}`;
    };

    const handleEmailClick = () => {
        window.location.href = `mailto:${data.email}`;
    };
    return (
        <div className='help'>
            {loading ? (
                <p style={{ color: "white", zIndex: "5", filter: "drop-shadow(2px 2px 5px #fff)" }} className='loading'>
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
                <div className="inr">
                    <h2>Galpa Can Help You
                        <img src={design} alt={design} />
                    </h2>
                    <p>{data.subheading}</p>
                    <div className="btns">
                        <button onClick={handleCallClick}>
                            <IoCallOutline /> +91 {data.phoneNumber}
                        </button>
                        <button onClick={handleEmailClick}>
                            <CiMail /> {data.email}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Help;
