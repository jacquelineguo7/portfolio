/**
 * Custom 404 Not Found Page
 * Displays a crumpled paper note with a friendly message when users land on a page that doesn't exist
 *
 * REUSED CLASSES:
 * - grid-div: The main grid background (from homepage)
 * - font-monsieur: Cursive font for the "404" heading (same as your name)
 * - font-hershey: Serif font for body text (same as card description)
 * - <a> tags: Automatically get the wavy underline animation from global styles
 */

// Making this a Client Component so we can use React hooks (useState, useEffect)
// for tracking cursor position and showing/hiding the preview images
"use client";

import { useState } from 'react';

export default function NotFound() {
  // State to track which link is being hovered (null, 'portfolio', or 'home')
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // State to track the cursor position (x and y coordinates)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Function that updates cursor position when mouse moves over a link
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };
  return (
    // Main container - REUSES grid-div class for the grid background
    // Added "not-found-page" class to enable the exclusion blend mode
    <main className="grid-div not-found-page">
      {/* Container for the crumpled paper note */}
      <div className="not-found-container">
        {/* The crumpled paper background image */}
        <div className="crumpled-paper">
          {/* Content overlaid on the paper */}
          <div className="not-found-content">
            {/* Large "404" heading - REUSES font-hershey class with italic */}
            <h1 className="font-hershey not-found-title">404</h1>

            {/* First line of message - REUSES font-hershey class */}
            <p className="font-hershey not-found-message">
              Uh oh... I think you've landed in a dark
            </p>
            <p className="font-hershey not-found-message">
              mysterious place that no longer has any content.
            </p>

            {/* Link back home */}
            <p className="font-hershey not-found-message" style={{ marginTop: '1rem' }}>
              {/* Link automatically gets wavy underline from global <a> styles */}
              {/* Added event handlers: onMouseEnter shows preview, onMouseMove tracks cursor, onMouseLeave hides preview */}
              Otherwise, here's a way back <a
                href="/"
                onMouseEnter={() => setHoveredLink('home')}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredLink(null)}
              >home</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Floating preview image that follows the cursor */}
      {/* Only shows when hoveredLink is not null */}
      {hoveredLink && (
        <div
          className="link-preview"
          style={{
            left: `${cursorPosition.x}px`, // Position horizontally at cursor
            top: `${cursorPosition.y}px`,  // Position vertically at cursor
          }}
        >
          {hoveredLink === 'home' && (
            <img
              src="/assets/home-thumbnail.png"
              alt="Home page preview"
              className="preview-image"
            />
          )}
        </div>
      )}
    </main>
  );
}
