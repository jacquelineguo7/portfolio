'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Photo } from '@/lib/photos'

interface PhotoLightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const photo = photos[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1)
  }, [hasNext, currentIndex, onNavigate])

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1)
  }, [hasPrev, currentIndex, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goNext, goPrev])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const formattedDate = photo.taken_at
    ? new Date(photo.taken_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    // Backdrop — click to close
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      {/* Container — stop clicks from bubbling to backdrop */}
      <div className="lightbox-container" onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Prev arrow */}
        {hasPrev && (
          <button
            className="lightbox-arrow lightbox-arrow-left"
            onClick={goPrev}
            aria-label="Previous photo"
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {hasNext && (
          <button
            className="lightbox-arrow lightbox-arrow-right"
            onClick={goNext}
            aria-label="Next photo"
          >
            ›
          </button>
        )}

        {/* Photo */}
        <div className="lightbox-img-wrap">
          <Image
            src={photo.url}
            alt={photo.title || 'Photo'}
            fill
            className="lightbox-img"
            sizes="100vw"
            priority
          />
        </div>

        {/* Caption */}
        <div className="lightbox-caption">
          {photo.title && (
            <span className="lightbox-title font-hershey">{photo.title}</span>
          )}
          <div className="lightbox-meta">
            {photo.location && (
              <span className="lightbox-location font-hershey">{photo.location}</span>
            )}
            {formattedDate && (
              <span className="lightbox-date font-hershey">{formattedDate}</span>
            )}
          </div>
          {photo.tags.length > 0 && (
            <div className="lightbox-tags">
              {photo.tags.map(tag => (
                <span key={tag} className="lightbox-tag font-hershey">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="lightbox-dots">
            {photos.map((_, idx) => (
              <button
                key={idx}
                className={`lightbox-dot ${idx === currentIndex ? 'lightbox-dot-active' : ''}`}
                onClick={() => onNavigate(idx)}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
