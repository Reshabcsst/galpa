import React from 'react';
import Auth1 from '../../../Assets/author1.png';
import Auth2 from '../../../Assets/Author2.png';
import Auth3 from '../../../Assets/Author3.png';
import quotetion from '../../../Assets/Quotetion.png';
import design from '../../../Assets/Rectanglesmall.png';
import { Carousel } from 'react-responsive-carousel';

const AuthorSays = () => {
    return (
        <div className='author-says'>
            <div className="in">
                <Carousel infiniteLoop showStatus={false} showArrows autoPlay={false} showThumbs={false} swipeable={false} emulateTouch>
                    <div className="inr">
                        <h2>
                            What Our Author Says
                            <img src={design} alt={design} />
                        </h2>
                        <img className='quote' src={quotetion} alt={quotetion} />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
                            Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                        <p className='author-name'>Soam Deb</p>
                        <div className="stack">
                            <img src={Auth2} alt={Auth2} />
                            <img src={Auth1} alt={Auth1} />
                            <img src={Auth3} alt={Auth3} />
                        </div>
                    </div>


                    <div className="inr">
                        <h2>
                            What Our Author Says
                            <img src={design} alt={design} />
                        </h2>
                        <img className='quote' src={quotetion} alt={quotetion} />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
                            Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                        <p className='author-name'>Soam Deb</p>
                        <div className="stack">
                            <img src={Auth2} alt={Auth2} />
                            <img src={Auth1} alt={Auth1} />
                            <img src={Auth3} alt={Auth3} />
                        </div>
                    </div>


                    <div className="inr">
                        <h2>
                            What Our Author Says
                            <img src={design} alt={design} />
                        </h2>
                        <img className='quote' src={quotetion} alt={quotetion} />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
                            Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                        <p className='author-name'>Soam Deb</p>
                        <div className="stack">
                            <img src={Auth2} alt={Auth2} />
                            <img src={Auth1} alt={Auth1} />
                            <img src={Auth3} alt={Auth3} />
                        </div>
                    </div>
                </Carousel>
            </div>
        </div>
    );
};

export default AuthorSays;
