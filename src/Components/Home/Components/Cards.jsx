import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { InfinitySpin } from 'react-loader-spinner';

const Cards = ({ ServerURL }) => {
    const [DetailsData, setDetailsData] = useState('');
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetching details data
        axios.get(`${ServerURL}/api/HomeCards/get-home-cards`)
            .then(response => {
                setDetailsData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])

    return (
        <div className="cards">
            {Loading ? (
                <p style={{ margin: "5rem auto" }} >
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
                <>
                    <div className="card">
                        <h2>{DetailsData.cardTitle1}</h2>
                        <p>{DetailsData.text1}</p>
                    </div>
                    <div className="card">
                        <h2>{DetailsData.cardTitle2}</h2>
                        <p>{DetailsData.text2}</p>
                    </div>
                    <div className="card">
                        <h2>{DetailsData.cardTitle3}</h2>
                        <p>{DetailsData.text3}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cards;
