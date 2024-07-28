import React, { useEffect, useState } from 'react';
import design from '../../../Assets/Rectanglesmall.png';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Authors = ({ ServerURL }) => {
    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await axios.get(`${ServerURL}/api/Authors`);
                setAuthors(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching authors', error);
            }
        };

        fetchAuthors();
    }, [ServerURL]);

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
                    {authors.map((author, index) => (
                        <AuthorCard ServerURL={ServerURL} key={index} author={author} />
                    ))}
                </div>
            )}
        </div>
    );
};

const AuthorCard = ({ author, ServerURL }) => {
    const navigate = useNavigate();
    const seeMorePage = (id) => {
        navigate(`/author/${id}`);
    };

    return (
        <div className="author" >
            <div onClick={() => { seeMorePage(author.id) }} className="img-container">
                <img src={`${ServerURL}/${author.profilePic}`} alt={author.name} />
                {/* <div className="social-icons">
                    <a href={author.facebookLink}> <FaFacebookF /></a>
                    <a href={author.twitterLink}><FaXTwitter /></a>
                    <a href={author.instagramLink}><FaInstagram /></a>
                </div> */}
            </div>
            <p className='name'>{author.name}</p>
            <p className='role'>Author</p>
        </div>
    );
};

export default Authors;
