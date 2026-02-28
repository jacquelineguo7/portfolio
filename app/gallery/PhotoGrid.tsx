'use client'

import Image from 'next/image'
import { Photo } from '@/lib/photos'

interface PhotoGridProps {
  photos: Photo[]
  onPhotoClick: (index: number) => void
}

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="gallery-empty">
        <p className="font-hershey">No photos found.</p>
      </div>
    )
  }

  return (
    <div className="photo-grid">
      {photos.map((photo, idx) => (
        <button
          key={photo.id}
          className="photo-card"
          onClick={() => onPhotoClick(idx)}
          aria-label={photo.title || `Photo ${idx + 1}`}
        >
          <div className="photo-card-img-wrap">
            <Image
              src={photo.url}
              alt={photo.title || 'Photo'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="photo-card-img"
            />
          </div>
          <div className="photo-card-overlay">
            {photo.title && (
              <span className="photo-card-title font-hershey">{photo.title}</span>
            )}
            {photo.location && (
              <span className="photo-card-location font-hershey">{photo.location}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
