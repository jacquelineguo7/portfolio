/**
 * POST /api/upload
 *
 * Accepts multipart/form-data with:
 *   - file       : the image file
 *   - password   : must match UPLOAD_PASSWORD env var
 *   - title      : optional
 *   - description: optional
 *   - taken_at   : optional ISO date string (e.g. "2025-06-15T14:30")
 *   - location   : optional
 *   - tags       : optional comma-separated string (e.g. "travel,nyc")
 *
 * Validates password server-side, then uploads to Supabase Storage
 * and inserts a row into the photos table — all using the service role key.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  // 1. Parse multipart form data
  const formData = await req.formData()
  const password = formData.get('password') as string
  const file = formData.get('file') as File | null
  const title = (formData.get('title') as string) || null
  const description = (formData.get('description') as string) || null
  const takenAt = (formData.get('taken_at') as string) || null
  const location = (formData.get('location') as string) || null
  const tagsRaw = (formData.get('tags') as string) || ''

  // 2. Check password
  const expectedPassword = process.env.UPLOAD_PASSWORD
  if (!expectedPassword || password !== expectedPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 3. Validate file
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File must be an image (JPEG, PNG, WebP, HEIC, GIF)' }, { status: 400 })
  }

  // 4. Build a storage path: YYYY/timestamp-sanitized-filename
  const year = takenAt ? new Date(takenAt).getFullYear() : new Date().getFullYear()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${year}/${Date.now()}-${safeName}`

  // 5. Parse tags
  const tags = tagsRaw
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  console.log('Supabase URL:', supabaseUrl)
  console.log('Service key set:', !!serviceKey)
  console.log('File type:', file.type, '| size:', file.size)

  // Supabase storage needs a content type — fall back to jpeg if browser didn't detect it
  const contentType = file.type || 'image/jpeg'

  try {
    // 6. Upload via Supabase Storage REST API
    // Supabase requires BOTH headers: apikey + Authorization Bearer
    const uploadUrl = `${supabaseUrl}/storage/v1/object/photos/${storagePath}`
    const buffer = Buffer.from(await file.arrayBuffer())

    console.log('Posting to:', uploadUrl)

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': contentType,
        'x-upsert': 'false',
        'cache-control': '3600',
      },
      body: buffer,
    })

    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      console.error('Storage failed:', uploadRes.status, errText)
      return NextResponse.json({ error: `Storage ${uploadRes.status}: ${errText}` }, { status: 500 })
    }

    // 7. Insert row into photos table via SDK (DB auth works fine)
    const supabase = createAdminClient()
    const { data, error: dbError } = await supabase
      .from('photos')
      .insert({
        storage_path: storagePath,
        title: title || null,
        description: description || null,
        taken_at: takenAt ? new Date(takenAt).toISOString() : null,
        location: location || null,
        tags,
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, photo: data }, { status: 200 })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Upload error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
