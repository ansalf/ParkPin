import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number | null
  heading?: number | null
  address?: string
}

export interface ParkingRecord {
  id: string
  garage_name: string
  floor_level: string // 'B3' | 'B2' | 'B1' | 'GF' | 'P1' | 'P2' | 'Roof' | custom
  zone_section: string // Patokan Dekat Lobi / Pintu
  slot_bay: string // Kode Pilar / Tiang / Blok
  vehicle_type?: 'mobil' | 'motor'
  notes?: string
  landmark_photo?: string // Base64 data URL stored in IndexedDB
  created_at: string
  updated_at: string
  archived_at?: string
  status: 'active' | 'archived'
  duration_seconds: number
  gps?: GPSLocation
  sync_status: 'synced' | 'pending' | 'failed'
  sync_error?: string
}

export interface SyncQueueItem {
  id: string
  operation: 'create' | 'update' | 'delete'
  record_id: string
  payload: Partial<ParkingRecord>
  created_at: string
  retries: number
  last_error?: string
}

interface ParkPinDB extends DBSchema {
  parking_records: {
    key: string
    value: ParkingRecord
    indexes: {
      'by-status': string
      'by-created_at': string
      'by-sync_status': string
    }
  }
  sync_queue: {
    key: string
    value: SyncQueueItem
    indexes: {
      'by-created_at': string
    }
  }
  user_settings: {
    key: string
    value: { key: string; value: any }
  }
}

const DB_NAME = 'parkpin_offline_db'
const DB_VERSION = 2

let dbPromise: Promise<IDBPDatabase<ParkPinDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ParkPinDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        // Parking records store
        if (!db.objectStoreNames.contains('parking_records')) {
          const recordStore = db.createObjectStore('parking_records', { keyPath: 'id' })
          recordStore.createIndex('by-status', 'status')
          recordStore.createIndex('by-created_at', 'created_at')
          recordStore.createIndex('by-sync_status', 'sync_status')
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
          queueStore.createIndex('by-created_at', 'created_at')
        }

        // Settings store (Version 2 upgrade support)
        if (!db.objectStoreNames.contains('user_settings')) {
          db.createObjectStore('user_settings', { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

// ================= RECORD OPERATIONS =================

export async function getActiveParkingRecord(): Promise<ParkingRecord | undefined> {
  const db = await getDB()
  const records = await db.getAllFromIndex('parking_records', 'by-status', 'active')
  return records[0]
}

export async function getParkingHistory(): Promise<ParkingRecord[]> {
  const db = await getDB()
  const records = await db.getAllFromIndex('parking_records', 'by-status', 'archived')
  // Sort descending by created_at
  return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getAllParkingRecords(): Promise<ParkingRecord[]> {
  const db = await getDB()
  const records = await db.getAll('parking_records')
  return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getParkingRecordById(id: string): Promise<ParkingRecord | undefined> {
  const db = await getDB()
  return db.get('parking_records', id)
}

export async function saveParkingRecord(record: ParkingRecord): Promise<void> {
  const db = await getDB()
  await db.put('parking_records', record)

  // Enqueue for cloud sync
  await enqueueSync({
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    operation: 'create',
    record_id: record.id,
    payload: record,
    created_at: new Date().toISOString(),
    retries: 0
  })
}

export async function updateParkingRecord(id: string, updates: Partial<ParkingRecord>): Promise<ParkingRecord> {
  const db = await getDB()
  const existing = await db.get('parking_records', id)
  if (!existing) {
    throw new Error(`Record with ID ${id} not found`)
  }

  const updated: ParkingRecord = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString()
  }

  await db.put('parking_records', updated)

  // Enqueue for cloud sync
  await enqueueSync({
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    operation: 'update',
    record_id: id,
    payload: updates,
    created_at: new Date().toISOString(),
    retries: 0
  })

  return updated
}

export async function archiveParkingRecord(id: string): Promise<ParkingRecord> {
  const now = new Date()
  const record = await getParkingRecordById(id)
  let duration = 0
  if (record) {
    duration = Math.max(1, Math.floor((now.getTime() - new Date(record.created_at).getTime()) / 1000))
  }

  return updateParkingRecord(id, {
    status: 'archived',
    archived_at: now.toISOString(),
    duration_seconds: duration
  })
}

export async function deleteParkingRecord(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('parking_records', id)

  // Enqueue for cloud sync
  await enqueueSync({
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    operation: 'delete',
    record_id: id,
    payload: {},
    created_at: new Date().toISOString(),
    retries: 0
  })
}

// ================= SYNC QUEUE OPERATIONS =================

export async function enqueueSync(item: SyncQueueItem): Promise<void> {
  const db = await getDB()
  await db.put('sync_queue', item)
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDB()
  return db.getAll('sync_queue')
}

export async function removeSyncQueueItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('sync_queue', id)
}

export async function clearSyncQueue(): Promise<void> {
  const db = await getDB()
  await db.clear('sync_queue')
}

// ================= SETTINGS OPERATIONS =================

export interface UserProfile {
  name: string
  email: string
  isLoggedIn: boolean
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Anissa Alifia',
  email: 'anissa@example.com',
  isLoggedIn: false
}

export async function getUserProfile(): Promise<UserProfile> {
  // 1. Fast, reliable sync read from localStorage
  try {
    const raw = localStorage.getItem('parkpin_user_profile')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.name === 'string') {
        return parsed
      }
    }
  } catch (e) {
    // localStorage might be unavailable in rare private contexts
  }

  // 2. Fallback to IndexedDB
  try {
    return await getSetting<UserProfile>('user_profile', DEFAULT_PROFILE)
  } catch (e) {
    return DEFAULT_PROFILE
  }
}

export async function setUserProfile(profile: UserProfile): Promise<void> {
  // 1. Immediate sync write to localStorage
  try {
    localStorage.setItem('parkpin_user_profile', JSON.stringify(profile))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }

  // 2. Persistent async write to IndexedDB
  try {
    await setSetting<UserProfile>('user_profile', profile)
  } catch (e) {
    console.warn('IndexedDB setSetting failed:', e)
  }
}

export async function getDefaultVehicle(): Promise<'mobil' | 'motor'> {
  return getSetting<'mobil' | 'motor'>('default_vehicle', 'mobil')
}

export async function setDefaultVehicle(type: 'mobil' | 'motor'): Promise<void> {
  return setSetting<'mobil' | 'motor'>('default_vehicle', type)
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const local = localStorage.getItem(`parkpin_setting_${key}`)
    if (local) {
      return JSON.parse(local)
    }
  } catch (e) {}

  try {
    const db = await getDB()
    if (!db.objectStoreNames.contains('user_settings')) {
      return defaultValue
    }
    const item = await db.get('user_settings', key)
    return item ? (item.value as T) : defaultValue
  } catch (e) {
    return defaultValue
  }
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  try {
    localStorage.setItem(`parkpin_setting_${key}`, JSON.stringify(value))
  } catch (e) {}

  try {
    const db = await getDB()
    if (db.objectStoreNames.contains('user_settings')) {
      await db.put('user_settings', { key, value })
    }
  } catch (e) {
    console.warn(`IndexedDB write error for ${key}:`, e)
  }
}
