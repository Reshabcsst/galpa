import React from 'react';
import bg from '../../Assets/BlogBg.jpg';
import Banner from '../CommonComponents/Banner';
import './Blog.scss';
import Blogs from '../../DemoData/Blogs';
import profile from '../../Assets/Profile.svg';
import calender from '../../Assets/Calender.svg';
import comments from '../../Assets/Comments.svg';
import rightTick from '../../Assets/RightTickPurple.svg';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const navigate = useNavigate();

    const handleReadMore = (id) => {
        navigate(`/blog-content/${id}`);
    };
    return (
        <div>
            <Banner
                Heading='Blog'
                SubHeading='Dive Deeper into the World of Publishing with Our Insightful Blog'
                imgURL={bg}
            />
            <div className="blog-container">
                <div className="pink">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#FFE0E0" fill-opacity="1" d="M0,160L48,144C96,128,192,96,288,122.7C384,149,480,235,576,234.7C672,235,768,149,864,112C960,75,1056,85,1152,117.3C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                    <div className="pink-bg">
                    </div>
                </div>

                <div className="orange-big-bottom"></div>
                <div className="orange-small-bottom"></div>
                <div className="purple-bottom"></div>

                <div className="blogs">
                    {Blogs.map((blog, index) => {
                        return (
                            <div key={index} className="blog">
                                <div style={{ backgroundImage: `url(${blog.image})` }} className="upr">
                                    <div className="author-details">
                                        <div className="in">
                                            <img src={blog.authorPic} alt="profile img" />
                                            <p>Posted by : <span>{blog.postedBy}</span></p>
                                        </div>

                                    </div>
                                </div>
                                <div className="lwr">
                                    <div className="author-date">
                                        <p><img src={profile} alt='profile' />{blog.author}</p>
                                        <p><img src={calender} alt='calender' />{blog.date}</p>
                                    </div>
                                    <h2>{blog.heading}</h2>
                                    <p className='details'>{blog.details.slice(0, 128)}</p>
                                    <div className="comments">
                                        <p><img src={comments} alt='comments' />{blog.comments} Comments</p>
                                    </div>
                                    <button onClick={() => { handleReadMore(blog.id) }}>Read more<img src={rightTick} alt='Right Tick' /></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="blank"></div>
            </div>
        </div>
    );
};

export default Blog;
