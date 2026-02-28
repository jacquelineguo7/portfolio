'use client'

/**
 * GalleryClient — all interactivity lives here.
 *
 * This is a "client boundary": the server component (page.tsx) fetches photos
 * once and passes them as props. From here, filtering + lightbox are
 * purely client-side state — no network requests on each filter change.
 *
 * Pattern: useMemo derives filtered/grouped data from raw state so
 * we don't mutate the original photos array.
 */

import { useState, useMemo } from 'react'
import { Photo } from '@/lib/photos'
import FilterBar from './FilterBar'
import PhotoGrid from './PhotoGrid'
import PhotoLightbox from './PhotoLightbox'

export default function GalleryClient({ photos }: { photos: Photo[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [view, setView] = useState<'grid' | 'timeline'>('grid')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Collect all unique tags across every photo
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    photos.forEach(p => p.tags.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [photos])

  // Collect all unique years from taken_at dates
  const allYears = useMemo(() => {
    const years = new Set<number>()
    photos.forEach(p => {
      if (p.taken_at) years.add(new Date(p.taken_at).getFullYear())
    })
    return Array.from(years).sort((a, b) => b - a) // newest first
  }, [photos])

  // Apply active filters to the full photo list
  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      if (activeTag && !p.tags.includes(activeTag)) return false
      if (activeYear && (!p.taken_at || new Date(p.taken_at).getFullYear() !== activeYear)) return false
      return true
    })
  }, [photos, activeTag, activeYear])

  // Group filtered photos by "Month Year" for timeline view
  const groupedByTime = useMemo(() => {
    if (view !== 'timeline') return null

    // Preserve insertion order (already sorted newest-first from DB)
    const groups = new Map<string, Photo[]>()
    filteredPhotos.forEach(p => {
      const key = p.taken_at
        ? new Date(p.taken_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'Undated'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(p)
    })
    return groups
  }, [filteredPhotos, view])

  return (
    <>
      <FilterBar
        allTags={allTags}
        allYears={allYears}
        activeTag={activeTag}
        activeYear={activeYear}
        view={view}
        onTagChange={setActiveTag}
        onYearChange={setActiveYear}
        onViewChange={setView}
        photoCount={filteredPhotos.length}
      />

      {view === 'grid' ? (
        <PhotoGrid
          photos={filteredPhotos}
          onPhotoClick={idx => setLightboxIndex(idx)}
        />
      ) : (
        <div className="gallery-timeline">
          {groupedByTime && Array.from(groupedByTime.entries()).map(([label, groupPhotos]) => (
            <div key={label} className="gallery-timeline-group">
              <h2 className="gallery-timeline-label font-hershey">{label}</h2>
              <PhotoGrid
                photos={groupPhotos}
                onPhotoClick={idx => {
                  // Map local group index → global filteredPhotos index for lightbox
                  const globalIdx = filteredPhotos.indexOf(groupPhotos[idx])
                  setLightboxIndex(globalIdx)
                }}
              />
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  )
}
