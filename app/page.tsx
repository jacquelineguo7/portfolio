// Mark this as a client component so we can use React hooks
'use client'

// Import React hooks for managing loading state
import { useState, useEffect } from "react";

// Import our components
import BinderClip from "./components/BinderClip";
import CardHeader from "./components/CardHeader";
import CardDescription from "./components/CardDescription";
import Loading from "./components/Loading";

/**
 * Home Page
 * Main landing page displaying business card with personal info and links
 * Shows a loading screen for 1.5 seconds when first loaded
 */
export default function Home() {
  // State to track if we're still in loading phase
  // Starts as 'true' so loading screen shows immediately
  const [isLoading, setIsLoading] = useState(true);

  // State to control fade-out animation before switching content
  // When true, triggers fade-out; when false, content is fully visible
  const [isFadingOut, setIsFadingOut] = useState(false);

  // useEffect runs once when component mounts (page first loads)
  useEffect(() => {
    // Step 1: Wait 1200ms (1.2 seconds) with loading screen visible
    const loadingTimer = setTimeout(() => {
      setIsFadingOut(true); // Start fade-out animation
    }, 1200);

    // Step 2: After fade-out starts, wait 500ms for animation to complete
    // Then hide loading screen and show main content
    const fadeTimer = setTimeout(() => {
      setIsLoading(false); // Switch to main content (which will fade in)
    }, 1700); // 1200ms loading + 500ms fade = 1700ms total

    // Cleanup function: cancel both timers if component unmounts
    // This prevents memory leaks
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(fadeTimer);
    };
  }, []); // Empty array means this only runs once on mount

  // If still loading, show the Loading component with fade-out animation
  // This displays your "Loading..." text in red cursive
  if (isLoading) {
    return (
      <div
        className={`transition-opacity duration-500 ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Loading />
      </div>
    );
  }

  // Once loading is done, show the actual page content with fade-in animation
  return (
    <main
      className="grid-div animate-fade-in"
      style={{
        animation: 'fadeIn 0.6s ease-in-out'
      }}
    >
      <div className="business-card">
        <BinderClip />
        <article className="card">
          <CardHeader />
          <CardDescription />
        </article>
      </div>
    </main>
  );
}
