import { useState, useCallback, useEffect } from "react";

// Custom hook for hash-based routing
export const useHashLocation = () => {
  const [loc, setLoc] = useState(() => window.location.hash.replace("#", "") || "/");

  useEffect(() => {
    // Handle hash change for back/forward navigation
    const handler = () => {
      const newPath = window.location.hash.replace("#", "") || "/";
      setLoc(newPath);
    };

    window.addEventListener("hashchange", handler);
    
    // Initial setup - ensure we have a hash
    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Update the URL when navigation occurs
  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [loc, navigate] as const;
};