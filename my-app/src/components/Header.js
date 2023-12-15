import React from 'react';
import '../App.css';
import image from '../assets/image1.jpg'

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-image">
          <img src={image} alt="Your Image" />
        </div>
        <div className="header-text">
          <h1>PRE-FLIGHT CHECKLIST</h1>
          <h3>BEST TIME MANAGER</h3>
        </div>
      </div>
    </header>
  );
}

export default Header;
