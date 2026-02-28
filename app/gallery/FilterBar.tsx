'use client'

interface FilterBarProps {
  allTags: string[]
  allYears: number[]
  activeTag: string | null
  activeYear: number | null
  view: 'grid' | 'timeline'
  onTagChange: (tag: string | null) => void
  onYearChange: (year: number | null) => void
  onViewChange: (view: 'grid' | 'timeline') => void
  photoCount: number
}

export default function FilterBar({
  allTags,
  allYears,
  activeTag,
  activeYear,
  view,
  onTagChange,
  onYearChange,
  onViewChange,
  photoCount,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      {/* Top row: tag pills + count + view toggle */}
      <div className="filter-bar-top">
        <div className="filter-bar-tags">
          <button
            className={`filter-pill font-hershey ${!activeTag ? 'filter-pill-active' : ''}`}
            onClick={() => onTagChange(null)}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-pill font-hershey ${activeTag === tag ? 'filter-pill-active' : ''}`}
              onClick={() => onTagChange(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="filter-bar-right">
          <span className="filter-count font-hershey">{photoCount} photos</span>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${view === 'grid' ? 'view-toggle-active' : ''}`}
              onClick={() => onViewChange('grid')}
              title="Grid view"
              aria-label="Grid view"
            >
              {/* Grid icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="6" height="6" rx="1"/>
                <rect x="10" y="0" width="6" height="6" rx="1"/>
                <rect x="0" y="10" width="6" height="6" rx="1"/>
                <rect x="10" y="10" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button
              className={`view-toggle-btn ${view === 'timeline' ? 'view-toggle-active' : ''}`}
              onClick={() => onViewChange('timeline')}
              title="Timeline view"
              aria-label="Timeline view"
            >
              {/* List icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="1" width="16" height="2" rx="1"/>
                <rect x="0" y="7" width="16" height="2" rx="1"/>
                <rect x="0" y="13" width="16" height="2" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Year filter row */}
      {allYears.length > 0 && (
        <div className="filter-bar-years">
          {allYears.map(year => (
            <button
              key={year}
              className={`filter-pill filter-pill-year font-hershey ${activeYear === year ? 'filter-pill-active' : ''}`}
              onClick={() => onYearChange(activeYear === year ? null : year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
