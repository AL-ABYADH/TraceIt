"use client";

import { useState, useEffect } from "react";

export default function ScreenSizeWarning() {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsScreenTooSmall(event.matches);
    };

    // Initial check
    setIsScreenTooSmall(mediaQuery.matches);

    // Add listener for changes
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  if (!isScreenTooSmall) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121417",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h1>Screen Size Not Supported</h1>
        <p>
          This application is not optimized for small screens. Please use a larger screen for the
          best experience.
        </p>
      </div>
    </div>
  );
}
