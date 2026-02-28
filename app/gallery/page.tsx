/**
 * Gallery Page — /gallery
 *
 * Server component: fetches all photos from Supabase at request time,
 * then hands the data off to the client component for filtering + lightbox.
 */

import Link from 'next/link'
import { getAllPhotos } from '@/lib/photos'
import GalleryClient from './GalleryClient'

export const metadata = {
  title: 'gallery — jacqueline guo',
  description: 'Photos from life, travel, and in between.',
}

export default async function GalleryPage() {
  const photos = await getAllPhotos()

  return (
    <div className="gallery-page">
      <nav className="blog-nav">
        <Link href="/" className="blog-back-link">
          ← Back to Home
        </Link>
      </nav>

      <main className="gallery-main">
        <header className="blog-index-header">
          <h1 className="blog-index-title font-monsieur">Gallery</h1>
          <p className="blog-index-subtitle font-hershey">
            Photos from life, travel, and in between.
          </p>
        </header>

        <GalleryClient photos={photos} />
      </main>
    </div>
  )
}
