import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

const Popularity = ({ServerURL}) => {
    const [Popularity, setPopularity] = useState('');
    const [loading, setLoading] = useState(true);
    // Fetching carousel data
    useEffect(() => {
        axios.get(`${ServerURL}/api/Popularity/get-popularity-info`)
            .then(response => {
                setPopularity(response.data);
                setLoading(false);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);
    return (
        <div className='popularity'>
             {loading ? (
                <p className='loading' style={{marginTop:"18rem"}}>
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
            <div className="inr">
                <div className="stack">
                    <h2>{Popularity.count1}+</h2>
                    <p>{Popularity.title1}</p>
                </div>
                <div className="stack">
                    <h2>{Popularity.count2}+</h2>
                    <p>{Popularity.title2}</p>
                </div>
                <div className="stack">
                    <h2>{Popularity.count3}+</h2>
                    <p>{Popularity.title3}</p>
                </div>
                <div className="stack">
                    <h2>{Popularity.count4}+</h2>
                    <p>{Popularity.title4}</p>
                </div>
            </div>
            )}
        </div>
    );
};

export default Popularity;
