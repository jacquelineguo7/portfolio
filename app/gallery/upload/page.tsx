'use client'

/**
 * Gallery Upload Page — /gallery/upload
 *
 * Password-protected page for uploading photos + metadata.
 * Files are sent to /api/upload which handles storage + DB insert server-side.
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadPage() {
  const [password, setPassword] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [takenAt, setTakenAt] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatus('idle')
    setErrorMsg('')
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setTitle('')
    setDescription('')
    setTakenAt('')
    setLocation('')
    setTags('')
    setStatus('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setStatus('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)
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
        setStatus('error')
        setErrorMsg(json.error || 'Upload failed')
      } else {
        setStatus('success')
        // Keep password filled in so you can upload another quickly
        const savedPassword = password
        reset()
        setPassword(savedPassword)
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error — check your connection')
    }
  }

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
            Add a photo to the gallery.
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

          {/* Drop zone — drag events only, no onClick so Finder doesn't pop up unexpectedly */}
          <div
            className={`upload-dropzone ${isDragging ? 'upload-dropzone-active' : ''} ${file ? 'upload-dropzone-filled' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="upload-file-input"
              onChange={handleFileInput}
            />
            {preview ? (
              <div className="upload-preview-wrap">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="upload-preview-img"
                />
                <button
                  type="button"
                  className="upload-change-btn font-hershey"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </button>
              </div>
            ) : (
              <div className="upload-dropzone-prompt">
                <span className="upload-dropzone-icon">+</span>
                <span className="upload-dropzone-text font-hershey">
                  Drop a photo here
                </span>
                <button
                  type="button"
                  className="upload-browse-btn font-hershey"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse files
                </button>
                <span className="upload-dropzone-hint font-hershey">
                  JPEG, PNG, WebP, HEIC
                </span>
              </div>
            )}
          </div>

          {/* Metadata fields — only show once a file is selected */}
          {file && (
            <div className="upload-meta-fields">
              <div className="upload-field">
                <label className="upload-label font-hershey" htmlFor="title">
                  Title <span className="upload-optional">(optional)</span>
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
                  placeholder="Any notes about this photo..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Status messages */}
          {status === 'success' && (
            <div className="upload-status upload-success font-hershey">
              ✓ Uploaded successfully! Drop another photo to continue.
            </div>
          )}
          {status === 'error' && (
            <div className="upload-status upload-error font-hershey">
              ✕ {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="upload-actions">
            {file && (
              <button
                type="button"
                className="upload-btn-secondary font-hershey"
                onClick={reset}
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="upload-btn-primary font-hershey"
              disabled={!file || status === 'uploading'}
            >
              {status === 'uploading' ? 'Uploading…' : 'Upload photo'}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
