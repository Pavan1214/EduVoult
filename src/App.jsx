import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import all page and utility components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FullImageViewPage from './pages/FullImageViewPage';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfilePage from './pages/ProfilePage';
import SavedPage from './pages/SavedPage';
import ScrollToTop from './utils/ScrollToTop';
import AnimatedPage from './utils/AnimatedPage';

// A helper component to wrap pages with the standard layout
const DefaultLayout = ({ children, user, setUser, searchTerm, setSearchTerm, isSearchVisible }) => {
  return (
    <>
      <Navbar
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearchVisible={isSearchVisible}
      />
      <main style={{ flex: 1 }}>
        {/* This correctly passes props down to the page component (the child) */}
        {React.cloneElement(children, { user, setUser })}
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const isImageDetailPage = location.pathname.startsWith('/image/');
  const isLoginPage = location.pathname === '/login';
  const isUploadPage = location.pathname === '/upload';
  const isProfilePage = location.pathname.startsWith('/profile');
  const isSavedPage = location.pathname === '/saved';
  const showSearch = isSearchVisible && !isImageDetailPage && !isLoginPage && !isUploadPage && !isProfilePage && !isSavedPage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Routes with the default Navbar/Footer layout */}
          <Route path="/" element={<DefaultLayout user={user} setUser={setUser} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearchVisible={showSearch}><HomePage searchTerm={searchTerm} setIsSearchVisible={setIsSearchVisible} /></DefaultLayout>} />
          <Route path="/image/:imageId" element={<DefaultLayout user={user} setUser={setUser} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearchVisible={showSearch}><FullImageViewPage /></DefaultLayout>} />
          <Route path="/upload" element={<DefaultLayout user={user} setUser={setUser} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearchVisible={showSearch}><UploadPage /></DefaultLayout>} />
          <Route path="/profile" element={<DefaultLayout user={user} setUser={setUser} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearchVisible={showSearch}><ProfilePage /></DefaultLayout>} />
          <Route path="/saved" element={<DefaultLayout user={user} setUser={setUser} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearchVisible={showSearch}><SavedPage /></DefaultLayout>} />
          
          {/* Standalone routes without the default layout */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/profile-setup" element={<ProfileSetupPage setUser={setUser} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <ScrollToTop />
    <App />
  </Router>
);

export default AppWrapper;