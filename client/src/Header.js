import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo"><i>BLOG APP</i></div>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to='/home'>Home</Link>
          <Link to='/myposts'>My Posts</Link>
          <Link to='/createposts'>Create Posts</Link>
          <Link to='/profile'>Profile</Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </div>
  );
};

export default Header;
