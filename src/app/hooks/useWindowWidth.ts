import React, { useState, useEffect } from "react";

// Custom hook to get the window width
export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // Check if window object is defined (for server-side rendering)
    if (typeof window !== "undefined") {
      // Handler to update window width state
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      // Add event listener to update window width on resize
      window.addEventListener("resize", handleResize);

      // Call handler once to get initial window width
      handleResize();

      // Remove event listener on component unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty dependency array ensures effect runs only once on component mount

  return windowWidth;
};
