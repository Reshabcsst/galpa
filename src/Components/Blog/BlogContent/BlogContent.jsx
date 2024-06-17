import React from 'react';
import '../Blog.scss';
import profile from '../../../Assets/Profile.svg';
import calender from '../../../Assets/Calender.svg';
import { useNavigate, useParams } from 'react-router-dom';
import Blogs from '../../../DemoData/Blogs';

const BlogContent = () => {
    const { id } = useParams();
    const blog = Blogs.find(blog => blog.id === parseInt(id));
    const navigate = useNavigate();

    const handleReadMore = (id) => {
        navigate(`/blog-content/${id}`);
    };

    if (!blog) {
        return (
            <div className='blog-not-found'>
                <p>Blog not found</p>
            </div>
        );
    }
    return (
        <div className='blog-content'>
            <div className="lft_panel">
                <img src={blog.image} alt="blog-image" />
                <h1>{blog.heading}</h1>
                <div className="author-date">
                    <p><img className='icon' src={profile} alt='profile' />{blog.author}</p>
                    <p><img className='icon' src={calender} alt='calender' />{blog.date}</p>
                </div>
                <p>{blog.details}</p>
                <img className='book' src={blog.bookImg} alt="book-image" />
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>Sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                <p>tempor in the incididunt ut labore et dolore Lorem ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt tempor in the incididunt ut labore et dolore Lorem ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt ut labore et dolore Lorem ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor in the incididunt</p>
            </div>
            <div className="rht_panel">
                <div className="top">
                    <h2>Related Blogs</h2>
                    <div className="related_blog">
                        {Blogs.map((relatedBlog, index) => {
                            return (
                                <div key={index} className="blog">
                                    <div className="blog_image" style={{ backgroundImage: `url(${relatedBlog.image})` }}></div>
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
