import React, { useEffect, useState } from 'react';
import quotetion from '../../../Assets/Quotetion.png';
import design from '../../../Assets/Rectanglesmall.png';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';

const AuthorSays = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [Feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetching carousel data
    useEffect(() => {
        axios.get('http://localhost:5241/api/AuthorsFeedback/get-authors-feedback')
            .then(response => {
                setFeedbacks(response.data);
                setLoading(false);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleCarouselChange = (index) => {
        setCurrentIndex(index);
    };

    const getVisibleImages = () => {
        const length = Feedbacks.length;

        // Handle when currentIndex is at the boundaries
        let visibleIndexes = [];
        if (currentIndex === 0) {
            visibleIndexes = [length - 1, 0, 1];
        } else if (currentIndex === length - 1) {
            visibleIndexes = [length - 2, length - 1, 0];
        } else {
            visibleIndexes = [currentIndex - 1, currentIndex, currentIndex + 1];
        }

        // Map the visible indexes to authorData
        return visibleIndexes.map(index => Feedbacks[index]);
    };

    return (
        <div className='author-says'>
            <div className="in">
                {loading ? (
                    <p style={{ color: "white", zIndex: "5" }} className='loading'>Loading...</p>
                ) : (
                    <Carousel
                        infiniteLoop
                        showStatus={false}
                        showArrows
                        autoPlay={false}
                        showThumbs={false}
                        swipeable={false}
                        emulateTouch
                        selectedItem={currentIndex}
                        onChange={handleCarouselChange}
                    >
                        {Feedbacks.map((author) => (
                            <div className="inr" key={author.id}>
                                <h2>
                                    What Our Author Says
                                    <img src={design} alt="design" />
                                </h2>
                                <img className='quote' src={quotetion} alt="quote" />
                                <p>{author.quote}</p>
                                <p className='author-name'>{author.name}</p>
                                <div className="stack">
                                    {getVisibleImages().map((visibleAuthor, index) => (
                                        <img
                                            key={visibleAuthor.id}
                                            src={`http://localhost:5241/${visibleAuthor.image}`}
                                            alt={visibleAuthor.name}
                                            className={index === 1 ? 'active' : ''}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
};

export default AuthorSays;
