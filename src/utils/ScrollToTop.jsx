import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This tells the browser to let our code control the scroll position
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;