/**
 * Blog Index Page — /blog
 *
 * Displays all posts as line items on a single piece of vintage lined paper,
 * inspired by to-do lists and restaurant receipt pads.
 *
 * SERVER component — reads .md files at build time.
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

        {/* The paper "pad" */}
        <div className="paper-pad yellow-paper">
          {/* Paper header */}
          <div className="paper-pad-header">
            <span className="paper-pad-no font-hershey">NO.</span>
            <div className="paper-pad-title-box">
              <span className="paper-pad-label font-hershey">POSTS</span>
            </div>
            <span className="paper-pad-count font-hershey">
              {posts.length}/{posts.length}
            </span>
          </div>

          <div className="paper-pad-divider-thick"></div>

          {/* Lined area with posts as line items */}
          <div className="paper-pad-lined">
            {posts.length === 0 ? (
              <div className="paper-pad-line">
                <span className="paper-pad-empty font-hershey">
                  Nothing here yet. Check back soon!
                </span>
              </div>
            ) : (
              posts.map((post, index) => {
                const fullPost = getPostBySlug(post.slug);
                const readTime = fullPost ? getReadingTime(fullPost.content) : "1 min";
                const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }).toLowerCase();

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="paper-pad-line"
                  >
                    <span className="paper-pad-bullet">○</span>
                    <span className="paper-pad-line-text font-hershey">
                      {post.title}
                    </span>
                    <span className="paper-pad-line-date font-hershey">
                      {formattedDate}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
