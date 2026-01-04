import { useEffect } from "react";
import { useLocation } from "react-router-dom";


//ScrollToTop Component
function ScrollToTop() {

  // Get the current location from React Router  
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page immediately
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;