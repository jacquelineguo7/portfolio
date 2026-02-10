/**
 * Individual Blog Post Page — /blog/[slug]
 *
 * DYNAMIC ROUTE: The [slug] folder name tells Next.js this is a dynamic route.
 * When someone visits /blog/design-advice-younger-self, Next.js passes
 * { slug: "design-advice-younger-self" } as the params.
 *
 * This is a SERVER component that:
 * 1. Reads the matching .md file from /content/blog/
 * 2. Parses the frontmatter (title, date, etc.) with gray-matter
 * 3. Renders the markdown content with next-mdx-remote
 *
 * KEY CONCEPT: `generateStaticParams` tells Next.js at build time which
 * slugs exist, so it can pre-render all blog post pages (Static Site Generation).
 * This means your blog posts load instantly — no server needed at runtime.
 */

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs, getReadingTime } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import BlogTableOfContents from "./BlogTableOfContents";

// Tell Next.js which slugs exist so it can pre-build each page
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

// Dynamically set the page <title> and meta description per post
// NOTE: In Next.js 15+, `params` is a Promise and must be awaited.
// This is a breaking change from Next.js 14 — if you see old tutorials
// using params.slug directly, they're using the old synchronous API.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — jacqueline guo`,
    description: post.description,
  };
}

/**
 * Custom components passed to MDXRemote.
 * These override how standard markdown elements are rendered.
 * For example, ## headings become <h2> with an id for anchor linking.
 */
const mdxComponents = {
  // Add id attributes to headings so the Table of Contents can link to them
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof props.children === "string" ? props.children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <h2 id={id} {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof props.children === "string" ? props.children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <h3 id={id} {...props} />;
  },
  // Render images with Next.js Image component for optimization
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="blog-content-image-wrapper">
      <img src={props.src} alt={props.alt || ""} className="blog-content-image" />
    </span>
  ),
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // If no .md file matches this slug, show the 404 page
  if (!post) {
    notFound();
  }

  const readTime = getReadingTime(post.content);
  const formattedDate = new Date(post.date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  // Extract headings from the markdown for the Table of Contents
  // This regex finds lines starting with ## or ### (h2 and h3 headings)
  const headings = post.content
    .split("\n")
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const level = line.startsWith("###") ? 3 : 2;
      const text = line.replace(/^#{2,3}\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return { level, text, id };
    });

  return (
    <div className="blog-page">
      {/* Back navigation — fixed top-left */}
      <nav className="blog-nav">
        <Link href="/blog" className="blog-back-link">
          ← Back to Posts
        </Link>
      </nav>

      <div className="blog-post-layout">
        {/* Sidebar Table of Contents — sticky on desktop, hidden on mobile */}
        {headings.length > 0 && (
          <BlogTableOfContents headings={headings} />
        )}

        {/* Main content area */}
        <article className="blog-article">
          {/* Paper-style header to match the index page */}
          <div className="blog-article-pad-header">
            <span className="paper-pad-no font-hershey">NO.</span>
            <span className="paper-pad-count font-hershey">
              {readTime} — {formattedDate}
            </span>
          </div>

          <div className="paper-pad-divider-thick"></div>

          {/* Post title */}
          <header className="blog-post-header">
            <h1 className="blog-post-title font-hershey">{post.title}</h1>
          </header>

          <div className="paper-pad-divider-thick"></div>

          {/* Cover image */}
          {post.coverImage && (
            <div className="blog-cover-image-wrapper">
              <Image
                src={post.coverImage}
                alt={`Cover image for ${post.title}`}
                width={600}
                height={400}
                className="blog-cover-image"
                priority // Load this image immediately (it's above the fold)
              />
            </div>
          )}

          {/* Markdown content rendered as React components */}
          <div className="blog-content">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </div>
    </div>
  );
}
