'use client'

/**
 * Gallery Upload Page — /gallery/upload
 *
 * Password-protected page for uploading photos + metadata.
 * Supports multi-select: pick many photos, fill in shared metadata, upload sequentially.
 * Files are sent one at a time to /api/upload which handles storage + DB insert server-side.
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type FileStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadPage() {
  const [password, setPassword] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [takenAt, setTakenAt] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addFiles(incoming: File[]) {
    const imgs = incoming.filter(f => f.type.startsWith('image/'))
    if (imgs.length === 0) return
    setFiles(prev => [...prev, ...imgs])
    setPreviews(prev => [...prev, ...imgs.map(f => URL.createObjectURL(f))])
    setFileStatuses(prev => [...prev, ...imgs.map((): FileStatus => 'idle')])
    setErrors(prev => [...prev, ...imgs.map(() => '')])
  }

  function removeFile(i: number) {
    URL.revokeObjectURL(previews[i])
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
    setFileStatuses(prev => prev.filter((_, idx) => idx !== i))
    setErrors(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length) addFiles(selected)
    e.target.value = '' // Reset so re-selecting the same file works
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function reset() {
    previews.forEach(url => URL.revokeObjectURL(url))
    setFiles([])
    setPreviews([])
    setTitle('')
    setDescription('')
    setTakenAt('')
    setLocation('')
    setTags('')
    setFileStatuses([])
    setErrors([])
    setIsUploading(false)
    setUploadedCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (files.length === 0 || isUploading) return

    setIsUploading(true)
    setUploadedCount(0)
    setFileStatuses(files.map((): FileStatus => 'idle'))
    setErrors(files.map(() => ''))

    let count = 0

    for (let i = 0; i < files.length; i++) {
      setFileStatuses(prev => { const next = [...prev]; next[i] = 'uploading'; return next })

      const formData = new FormData()
      formData.append('file', files[i])
      formData.append('password', password)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('taken_at', takenAt)
      formData.append('location', location)
      formData.append('tags', tags)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (!res.ok) {
          setFileStatuses(prev => { const next = [...prev]; next[i] = 'error'; return next })
          setErrors(prev => { const next = [...prev]; next[i] = json.error || 'Upload failed'; return next })
        } else {
          setFileStatuses(prev => { const next = [...prev]; next[i] = 'success'; return next })
          count++
          setUploadedCount(count)
        }
      } catch {
        setFileStatuses(prev => { const next = [...prev]; next[i] = 'error'; return next })
        setErrors(prev => { const next = [...prev]; next[i] = 'Network error'; return next })
      }
    }

    setIsUploading(false)
  }

  function submitLabel() {
    if (isUploading) return `Uploading ${uploadedCount} / ${files.length}…`
    if (files.length === 0) return 'Upload photos'
    if (files.length === 1) return 'Upload photo'
    return `Upload ${files.length} photos`
  }

  const hasFiles = files.length > 0
  const allDone = hasFiles && fileStatuses.length > 0 && fileStatuses.every(s => s === 'success')
  const someErrors = !isUploading && fileStatuses.some(s => s === 'error')

  return (
    <div className="gallery-page">
      <nav className="blog-nav">
        <Link href="/gallery" className="blog-back-link">
          ← Back to Gallery
        </Link>
      </nav>

      <main className="upload-main">
        <header className="blog-index-header">
          <h1 className="blog-index-title font-monsieur">Upload</h1>
          <p className="blog-index-subtitle font-hershey">
            Add photos to the gallery.
          </p>
        </header>

        <form className="upload-form" onSubmit={handleSubmit}>

          {/* Password */}
          <div className="upload-field">
            <label className="upload-label font-hershey" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="upload-input font-hershey"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Upload password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Drop zone */}
          <div
            className={`upload-dropzone ${isDragging ? 'upload-dropzone-active' : ''} ${hasFiles ? 'upload-dropzone-has-files' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="upload-file-input"
              onChange={handleFileInput}
            />

            {hasFiles ? (
              <div className="upload-thumbs-wrap">
                <div className="upload-thumbs">
                  {files.map((f, i) => (
                    <div key={previews[i]} className="upload-thumb">
                      <Image
                        src={previews[i]}
                        alt={f.name}
                        fill
                        className="upload-thumb-img"
                      />
                      {fileStatuses[i] === 'uploading' && (
                        <span className="upload-thumb-badge upload-thumb-uploading">·</span>
                      )}
                      {fileStatuses[i] === 'success' && (
                        <span className="upload-thumb-badge upload-thumb-success">✓</span>
                      )}
                      {fileStatuses[i] === 'error' && (
                        <span
                          className="upload-thumb-badge upload-thumb-error"
                          title={errors[i]}
                        >
                          ✕
                        </span>
                      )}
                      {!isUploading && fileStatuses[i] !== 'success' && (
                        <button
                          type="button"
                          className="upload-thumb-remove"
                          onClick={() => removeFile(i)}
                          aria-label={`Remove ${f.name}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {!isUploading && (
                    <button
                      type="button"
                      className="upload-thumb-add"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Add more photos"
                    >
                      +
                    </button>
                  )}
                </div>

                <span className="upload-thumb-count font-hershey">
                  {files.length} photo{files.length !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="upload-dropzone-prompt">
                <span className="upload-dropzone-icon">+</span>
                <span className="upload-dropzone-text font-hershey">
                  Drop photos here
                </span>
                <button
                  type="button"
                  className="upload-browse-btn font-hershey"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse files
                </button>
                <span className="upload-dropzone-hint font-hershey">
                  JPEG, PNG, WebP, HEIC — select multiple
                </span>
              </div>
            )}
          </div>

          {/* Metadata — shared across all selected photos */}
          {hasFiles && (
            <div className="upload-meta-fields">
              <div className="upload-field">
                <label className="upload-label font-hershey" htmlFor="title">
                  Title <span className="upload-optional">(optional, applies to all)</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="upload-input font-hershey"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Sunset over the bay"
                />
              </div>

              <div className="upload-row">
                <div className="upload-field">
                  <label className="upload-label font-hershey" htmlFor="taken_at">
                    Date taken <span className="upload-optional">(optional)</span>
                  </label>
                  <input
                    id="taken_at"
                    type="datetime-local"
                    className="upload-input font-hershey"
                    value={takenAt}
                    onChange={e => setTakenAt(e.target.value)}
                  />
                </div>

                <div className="upload-field">
                  <label className="upload-label font-hershey" htmlFor="location">
                    Location <span className="upload-optional">(optional)</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    className="upload-input font-hershey"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>

              <div className="upload-field">
                <label className="upload-label font-hershey" htmlFor="tags">
                  Tags <span className="upload-optional">(optional, comma-separated)</span>
                </label>
                <input
                  id="tags"
                  type="text"
                  className="upload-input font-hershey"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. travel, nature, film"
                />
              </div>

              <div className="upload-field">
                <label className="upload-label font-hershey" htmlFor="description">
                  Description <span className="upload-optional">(optional)</span>
                </label>
                <textarea
                  id="description"
                  className="upload-input upload-textarea font-hershey"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Any notes about these photos..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Status messages */}
          {isUploading && (
            <div className="upload-status upload-progress font-hershey">
              Uploading {uploadedCount} / {files.length}…
            </div>
          )}
          {allDone && (
            <div className="upload-status upload-success font-hershey">
              ✓ All {files.length} photo{files.length !== 1 ? 's' : ''} uploaded!
            </div>
          )}
          {someErrors && (
            <div className="upload-status upload-error font-hershey">
              ✕ Some photos failed — see ✕ badges above.
            </div>
          )}

          {/* Actions */}
          <div className="upload-actions">
            {hasFiles && !isUploading && (
              <button
                type="button"
                className="upload-btn-secondary font-hershey"
                onClick={reset}
              >
                Clear all
              </button>
            )}
            <button
              type="submit"
              className="upload-btn-primary font-hershey"
              disabled={!hasFiles || isUploading}
            >
              {submitLabel()}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
