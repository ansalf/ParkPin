import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSyncQueue, removeSyncQueueItem, updateParkingRecord, getParkingRecordById, ParkingRecord } from './db'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase.parkpin.app'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key'

export const isCloudConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export interface SyncResult {
  success: boolean
  syncedCount: number
  failedCount: number
  errors: string[]
}

/**
 * Upload landmark photo Base64 string to Supabase Storage bucket
 */
export async function uploadLandmarkPhoto(userId: string, recordId: string, base64Data: string): Promise<string | null> {
  if (!isCloudConfigured) return null

  try {
    // Extract base64 content
    const base64Content = base64Data.split(',')[1] || base64Data
    const mimeMatch = base64Data.match(/^data:(image\/[a-zA-Z]+);base64,/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'

    const byteCharacters = atob(base64Content)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    const filePath = `${userId}/${recordId}_landmark.jpg`
    const { data, error } = await supabase.storage
      .from('parking-landmarks')
      .upload(filePath, blob, {
        upsert: true,
        contentType: mimeType
      })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from('parking-landmarks')
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  } catch (err: any) {
    console.warn('Failed to upload landmark photo to cloud storage:', err)
    return null
  }
}

/**
 * Flush and process all queued operations to Supabase
 */
export async function processSyncQueue(): Promise<SyncResult> {
  const queue = await getSyncQueue()
  const result: SyncResult = {
    success: true,
    syncedCount: 0,
    failedCount: 0,
    errors: []
  }

  if (queue.length === 0) {
    return result
  }

  // If cloud not configured or offline, skip network calls
  if (!navigator.onLine || !isCloudConfigured) {
    return {
      success: false,
      syncedCount: 0,
      failedCount: queue.length,
      errors: [!navigator.onLine ? 'Device is offline' : 'Cloud integration not configured']
    }
  }

  for (const item of queue) {
    try {
      if (item.operation === 'create' || item.operation === 'update') {
        const fullRecord = await getParkingRecordById(item.record_id)
        if (fullRecord) {
          const { error } = await supabase
            .from('parking_records')
            .upsert({
              id: fullRecord.id,
              garage_name: fullRecord.garage_name,
              floor_level: fullRecord.floor_level,
              zone_section: fullRecord.zone_section,
              slot_bay: fullRecord.slot_bay,
              notes: fullRecord.notes,
              status: fullRecord.status,
              duration_seconds: fullRecord.duration_seconds,
              gps_lat: fullRecord.gps?.latitude,
              gps_lng: fullRecord.gps?.longitude,
              gps_accuracy: fullRecord.gps?.accuracy,
              gps_elevation: fullRecord.gps?.altitude,
              created_at: fullRecord.created_at,
              updated_at: fullRecord.updated_at,
              archived_at: fullRecord.archived_at
            })

          if (error) throw error

          await updateParkingRecord(item.record_id, {
            sync_status: 'synced',
            sync_error: undefined
          })
        }
      } else if (item.operation === 'delete') {
        const { error } = await supabase
          .from('parking_records')
          .delete()
          .eq('id', item.record_id)

        if (error) throw error
      }

      await removeSyncQueueItem(item.id)
      result.syncedCount++
    } catch (err: any) {
      result.success = false
      result.failedCount++
      const message = err.message || 'Unknown network sync error'
      result.errors.push(message)
      await updateParkingRecord(item.record_id, {
        sync_status: 'failed',
        sync_error: message
      })
    }
  }

  return result
}
