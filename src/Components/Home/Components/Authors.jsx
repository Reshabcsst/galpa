import React from 'react';
import img1 from '../../../Assets/FirstA.png';
import img2 from '../../../Assets/SecondA.png';
import img3 from '../../../Assets/ThirdA.png';
import img4 from '../../../Assets/FourthA.png';
import design from '../../../Assets/Rectanglesmall.png';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { CiTwitter } from 'react-icons/ci';

const Authors = () => {
    const AuthorsData = [
        { name: 'Mack Steev', pic: img1, role: 'Author' },
        { name: 'Anthy Veab', pic: img2, role: 'Author' },
        { name: 'Garry Malan', pic: img3, role: 'Author' },
        { name: 'Abhik Sam', pic: img4, role: 'Author' },
    ];

    return (
        <div className='authors'>
            <h2>Most Popular Authors
                <img src={design} alt="design" />
            </h2>
            <div className="authors-list">
                {AuthorsData.map((author, index) => (
                    <AuthorCard key={index} author={author} />
                ))}
            </div>
        </div>
    );
};

const AuthorCard = ({ author }) => {

    return (
        <div className="author" >
            <div className="img-container">
                <img src={author.pic} alt={author.name} />
                <div className="social-icons">
                    <FaFacebookF />
                    <CiTwitter />
                    <FaInstagram />
                </div>
            </div>
            <p className='name'>{author.name}</p>
            <p className='role'>{author.role}</p>
        </div>
    );
};

export default Authors;
