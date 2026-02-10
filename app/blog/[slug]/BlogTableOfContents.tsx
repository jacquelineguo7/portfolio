/**
 * Blog Table of Contents — Client Component
 *
 * This is a CLIENT component ('use client') because it needs browser APIs:
 * - IntersectionObserver to detect which heading is currently visible
 * - window.scrollTo for smooth scrolling when clicking a TOC link
 *
 * KEY CONCEPT: In Next.js App Router, most components are server components.
 * But when you need interactivity (event handlers, browser APIs, React state),
 * you add 'use client' at the top. This component is imported by the server
 * component page.tsx — Next.js handles the boundary automatically.
 */

"use client";

import { useEffect, useState } from "react";

interface Heading {
  level: number; // 2 for h2, 3 for h3
  text: string;
  id: string; // The id attribute on the heading element (used for anchor links)
}

interface BlogTableOfContentsProps {
  headings: Heading[];
}

export default function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  // Track which heading is currently in view
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    /**
     * IntersectionObserver watches heading elements and fires a callback
     * when they enter/exit the viewport. We use this to highlight the
     * corresponding TOC item as the user scrolls.
     *
     * rootMargin: "-80px 0px -70% 0px" means:
     * - Shrink the "viewport" by 80px from top (accounts for nav bar)
     * - Shrink by 70% from bottom (so headings activate when near the top)
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    // Observe all heading elements that match our TOC items
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Cleanup: stop observing when component unmounts
    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="blog-toc">
      <nav>
        <p className="blog-toc-title font-hershey">Index</p>
        <ul className="blog-toc-list">
          {headings.map(({ level, text, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`blog-toc-link font-hershey ${
                  level === 3 ? "blog-toc-link-nested" : ""
                } ${activeId === id ? "blog-toc-link-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
