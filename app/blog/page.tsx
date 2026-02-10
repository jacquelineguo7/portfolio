/**
 * Blog Index Page — /blog
 *
 * This is a SERVER component (no 'use client' directive).
 * It reads all .md files at build time and renders a list of post cards.
 *
 * KEY CONCEPT: In Next.js App Router, components are server components by
 * default. This means they can directly call filesystem functions (like our
 * blog utility) without needing an API route. The code here runs on the
 * server during build or request — it's never sent to the browser.
 */

import Link from "next/link";
import { getAllPostsMeta, getReadingTime } from "@/lib/blog";
import { getPostBySlug } from "@/lib/blog";

export const metadata = {
  title: "blog — jacqueline guo",
  description: "Thoughts on design, code, and the space in between.",
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();

  return (
    <div className="blog-page">
      {/* Back navigation */}
      <nav className="blog-nav">
        <Link href="/" className="blog-back-link">
          ← Back to Home
        </Link>
      </nav>

      <main className="blog-index-main">
        <header className="blog-index-header">
          <h1 className="blog-index-title font-monsieur">Blog</h1>
          <p className="blog-index-subtitle font-hershey">
            Thoughts on design, code, and the space in between.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="blog-empty font-hershey">No posts yet. Check back soon!</p>
        ) : (
          <ul className="blog-post-list">
            {posts.map((post) => {
              // Get reading time by loading the full post content
              const fullPost = getPostBySlug(post.slug);
              const readTime = fullPost ? getReadingTime(fullPost.content) : "1 min";

              return (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="blog-post-card">
                    <div className="blog-post-card-inner kraft-paper">
                      <span className="blog-post-meta font-hershey">
                        {readTime} — {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).toUpperCase()}
                      </span>
                      <h2 className="blog-post-card-title font-monsieur">
                        {post.title}
                      </h2>
                      <p className="blog-post-card-desc font-hershey">
                        {post.description}
                      </p>
                      {post.tags && (
                        <div className="blog-post-tags">
                          {post.tags.map((tag) => (
                            <span key={tag} className="blog-tag font-hershey">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
