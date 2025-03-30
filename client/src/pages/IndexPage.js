import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './IndexPage.css';

const IndexPage = () => {
  const [currentContext, setCurrentContext] = useState(0);

  const contexts = [
    'Write your Stories into ideas',
    'Every thing begins with small start',
    'Just Start your way'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContext(prev => (prev + 1) % contexts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className='homepage'>
        <section className="blog-section">
          {/* Animated "Blog It!" Text */}
          <h1 className="jumping-text">Blog It!</h1>

          {/* Dynamic Context Text */}
          <p className="context-text">{contexts[currentContext]}</p>

          {/* Blog Description */}
          <div className="blog-description">
            <p>
              Welcome to our Blog! This is the place where creativity meets expression. Our blog is dedicated to sharing inspiring stories, valuable tips, and insights from various fields. Whether you're a writer, a tech enthusiast, or someone simply looking for inspiration, you're in the right place!
            </p>
            <p>
              Explore engaging articles on topics ranging from technology, lifestyle, health, to personal development. We believe everyone has a story to tell, and we're here to help you share yours. Our mission is to foster creativity, connect with like-minded individuals, and provide a platform where ideas come to life.
            </p>
            <nav>
            <Link to='/login'>
              <button className="btn">Login</button>
            </Link>
          </nav>
          </div>

          
        </section>
      </div>
    </div>
  );
};

export default IndexPage;
