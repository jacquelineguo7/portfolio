import { supabase } from './supabase'

export interface Photo {
  id: string
  title: string | null
  description: string | null
  storage_path: string
  url: string           // derived: supabase public URL
  taken_at: string | null
  tags: string[]
  location: string | null
}

export async function getAllPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('taken_at', { ascending: false, nullsFirst: false })

  if (error || !data) {
    console.error('Error fetching photos:', error)
    return []
  }

  return data.map(photo => ({
    ...photo,
    url: supabase.storage.from('photos').getPublicUrl(photo.storage_path).data.publicUrl,
    tags: photo.tags || [],
  }))
}
