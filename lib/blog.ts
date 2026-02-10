/**
 * Blog utility functions
 *
 * This file handles reading .md files from /content/blog/ and parsing them.
 * It uses `gray-matter` to extract frontmatter (title, date, etc.) from the
 * markdown content, and `fs` to read files from the filesystem.
 *
 * KEY CONCEPT: This only runs on the server (during build or request time),
 * never in the browser — that's why we can use Node's `fs` module here.
 * Next.js App Router components are server components by default.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Path to the folder where blog posts live
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// TypeScript type for a blog post's metadata (the stuff between --- in .md files)
export interface BlogPostMeta {
  slug: string; // URL-friendly name derived from filename (e.g. "my-first-post")
  title: string;
  date: string;
  description: string;
  coverImage?: string; // Optional hero/cover image path
  tags?: string[]; // Optional tags for categorization
}

// Full blog post = metadata + the actual markdown content
export interface BlogPost extends BlogPostMeta {
  content: string;
}

/**
 * Get metadata for ALL blog posts, sorted by date (newest first).
 * Used on the blog index page to show a list of posts.
 *
 * How it works:
 * 1. Reads all .md filenames from /content/blog/
 * 2. For each file, reads it and extracts the frontmatter with gray-matter
 * 3. Returns an array of metadata objects, sorted newest-first
 */
export function getAllPostsMeta(): BlogPostMeta[] {
  // Check if the blog directory exists yet
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, ""); // "my-post.md" → "my-post"
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // gray-matter parses the frontmatter (between ---) and the content separately
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      description: data.description ?? "",
      coverImage: data.coverImage,
      tags: data.tags,
    };
  });

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single blog post by its slug (filename without .md).
 * Used on the individual post page [slug]/page.tsx.
 *
 * Returns both the metadata AND the raw markdown content string.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date ?? "",
    description: data.description ?? "",
    coverImage: data.coverImage,
    tags: data.tags,
    content, // The raw markdown text (everything after the --- frontmatter)
  };
}

/**
 * Get all slugs — used by Next.js to know which blog post URLs exist.
 * This enables static generation: Next.js pre-builds a page for each slug.
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Estimate reading time based on word count.
 * ~200 words per minute is a common average.
 */
export function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}
