import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, searchTerm, setSearchTerm, isSearchVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          <img src="/edu.png" alt="" srcset="" />
        </Link>
        
        {isSearchVisible && (
          <div className="search-container">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        
        {/* This new container will hold all right-side controls */}
        <div className="navbar-controls">
          {/* Main links that will collapse into the menu */}
          <div className={`navbar-links ${isMenuOpen ? 'is-open' : ''}`}>
            <Link to="/" onClick={handleLinkClick}>Home</Link>
            <Link to="/upload" onClick={handleLinkClick}>Upload</Link>
            {user && <Link to="/saved" onClick={handleLinkClick}>Saved</Link>}
          </div>

          {/* User action that will stay visible */}
          <div className="navbar-user-action">
            {user && user.isProfileComplete ? (
              <Link to="/profile" onClick={handleLinkClick}>
                <img src={user.profilePic} alt="Profile" className="navbar-profile-pic" />
              </Link>
            ) : (
              <Link to="/login" className="login-button" style={{textDecoration: 'none'}} onClick={handleLinkClick}>
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;