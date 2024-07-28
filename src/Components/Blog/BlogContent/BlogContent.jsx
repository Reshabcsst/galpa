import React, { useEffect, useState } from 'react';
import '../Blog.scss';
import profile from '../../../Assets/Profile.svg';
import calender from '../../../Assets/Calender.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';

const BlogContent = ({ ServerURL }) => {
    const [BlogData, setBlogData] = useState('');
    const [BlogsData, setBlogsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedBlogloading, setRelatedBlogLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleReadMore = (id) => {
        navigate(`/blog-content/${id}`);
    };

    // Fetching data
    useEffect(() => {
        axios.get(`${ServerURL}/api/BlogPost/${id}`)
            .then(response => {
                setBlogData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });


        axios.get(`${ServerURL}/api/BlogPost`)
            .then(response => {
                setBlogsData(response.data);
                setRelatedBlogLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [pathname]);

    if (!BlogData) {
        return (
            <div className='blog-not-found'>
                <p>Blog not found</p>
            </div>
        );
    }
    return (
        <div className='blog-content'>
            {loading ? (
                <p className='loading' style={{ margin: "10rem auto auto auto", width: "fit-content" }}>
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#8a07f0"
                        ariaLabel="infinity-spin-loading"
                    />
                </p>
            ) : (
                <div className="lft_panel">
                    <img src={`${ServerURL}/${BlogData.image}`} alt="blog-image" />
                    <h1>{BlogData.heading}</h1>
                    <div className="author-date">
                        <p><img className='icon' src={profile} alt='profile' />{BlogData.author}</p>
                        <p><img className='icon' src={calender} alt='calender' />{BlogData.date}</p>
                    </div>
                    <p>{BlogData.details}</p>
                    <img className='book' src={`${ServerURL}/${BlogData.bookImg}`} alt="book-image" />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p>Sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                    <p>tempor in the incididunt ut labore et dolore Lorem ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt tempor in the incididunt ut labore et dolore Lorem ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt</p>
                </div>
            )}
            <div className="rht_panel">
                {relatedBlogloading ? (
                    <p className='loading' style={{ margin: "10rem auto auto auto", width: "fit-content" }}>
                        <InfinitySpin
                            visible={true}
                            width="200"
                            color="#8a07f0"
                            ariaLabel="infinity-spin-loading"
                        />
                    </p>
                ) : (
                    <div className="top">
                        <h2>Related Blogs</h2>
                        <div className="related_blog">
                            {BlogsData.map((relatedBlog, index) => {
                                return (
                                    <div key={index} className="blog">
                                        <div className="blog_image" style={{ backgroundImage: `url(${ServerURL}/${relatedBlog.image})` }}></div>
                                        <div className="rht_details">
                                            <h3 onClick={() => { handleReadMore(relatedBlog.id) }}>{relatedBlog.heading}</h3>
                                            <p>By {relatedBlog.author}</p>
                                            <p>{relatedBlog.date}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="bottom">
                    <h3>Categories</h3>
                    <a>CD or DVD Package</a>
                    <a>Free E-Book Tutorial</a>
                    <a>Multimedia E-Book</a>
                </div>
            </div>
            <div className="blank"></div>
            <div className="orange-big-bottom"></div>
            <div className="orange-small-bottom"></div>
            <div className="purple-bottom"></div>
        </div>
    );
};

export default BlogContent;
