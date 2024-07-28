import React, { useEffect, useState } from 'react';
import img from '../../../Assets/Rectanglesmall.png';
import pic1 from '../../../Assets/FirstImage.png';
import pic2 from '../../../Assets/SecondImage1.png';
import frame from '../../../Assets/FirstFrametop.png';
import frame2 from '../../../Assets/FirstFrameBottom.png';
import Bframe from '../../../Assets/SecondFrame2.png';
import Bframe2 from '../../../Assets/Secondframe.png';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const AboutCompany = ({ ServerURL }) => {
    const [DetailsData, setDetailsData] = useState('');
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetching details data
        axios.get(`${ServerURL}/api/AboutDetails/get-about-details`)
            .then(response => {
                setDetailsData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])
    return (
        <div className='home-about'>
            {Loading ? (
                <p className='loading' >
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
                <>
                    <div className='about-company'>
                        <div className="lft">
                            <h2>{DetailsData.title1}
                                <img src={img} alt="design" />
                            </h2>
                            <p>{DetailsData.details1}</p>
                            <button>Know More</button>
                        </div>
                        <div className="rht">
                            <img className='top' src={frame} alt="Frame" />
                            <img className='bottom' src={frame2} alt="Frame" />
                            <img src={pic1} alt="FirstImage" />
                        </div>
                    </div>


                    <div className='about-company'>
                        <div className="rht">
                            <img className='top' src={Bframe2} alt="Frame" />
                            <img className='bottom' src={Bframe} alt="Frame" />
                            <img src={pic2} alt="SecondImage" />
                        </div>
                        <div className="lft">
                            <h2>
                                {DetailsData.title2}
                                <img src={img} alt="design" />
                            </h2>
                            <p>{DetailsData.details2}</p>
                            <button>Let’s Start Writing Book With Us</button>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
};

export default AboutCompany;
