import React, { useEffect, useState } from 'react';
import design from '../../../Assets/Rectanglesmall.png';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import axios from 'axios';
import { FaXTwitter } from 'react-icons/fa6';
import { InfinitySpin } from 'react-loader-spinner';

const Authors = () => {
    const [Authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetching carousel data
    useEffect(() => {
        axios.get('http://localhost:5241/api/MostPopularAuthors/get-authors')
            .then(response => {
                setAuthors(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    return (
        <div className='authors'>
            <h2>Most Popular Authors
                <img src={design} alt="design" />
            </h2>
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
                <div className="authors-list">
                    {Authors.map((author, index) => (
                        <AuthorCard key={index} author={author} />
                    ))}
                </div>
            )}
        </div>
    );
};

const AuthorCard = ({ author }) => {

    return (
        <div className="author" >
            <div className="img-container">
                <img src={`http://localhost:5241/${author.profilePicture}`} alt={author.name} />
                <div className="social-icons">
                    <a href={author.facebookLink}> <FaFacebookF /></a>
                    <a href={author.twitterLink}><FaXTwitter /></a>
                    <a href={author.instagramLink}><FaInstagram /></a>
                </div>
            </div>
            <p className='name'>{author.name}</p>
            <p className='role'>{author.role}</p>
        </div>
    );
};

export default Authors;
