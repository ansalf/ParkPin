import React, { useState, useEffect } from 'react'
import { Cloud, Database, Wifi, WifiOff, RefreshCw, CheckCircle2, ShieldCheck, MapPin, Camera } from 'lucide-react'
import { getAllParkingRecords, getSyncQueue, SyncQueueItem } from '../services/db'
import { processSyncQueue } from '../services/supabase'

interface SyncStatusScreenProps {
  onBack: () => void
  isOnline: boolean
}

export const SyncStatusScreen: React.FC<SyncStatusScreenProps> = ({
  onBack,
  isOnline
}) => {
  const [recordCount, setRecordCount] = useState(0)
  const [photoCount, setPhotoCount] = useState(0)
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null)

  const loadStats = async () => {
    const records = await getAllParkingRecords()
    setRecordCount(records.length)
    setPhotoCount(records.filter((r) => Boolean(r.landmark_photo)).length)
    const queue = await getSyncQueue()
    setQueueItems(queue)
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleForceSync = async () => {
    setIsSyncing(true)
    setLastSyncResult(null)

    try {
      const result = await processSyncQueue()
      if (result.success && result.syncedCount > 0) {
        setLastSyncResult(`Berhasil mencadangkan ${result.syncedCount} catatan ke akun Anda.`)
      } else if (result.syncedCount === 0 && queueItems.length === 0) {
        setLastSyncResult('Semua data parkir Anda sudah dicadangkan secara lengkap.')
      } else {
        setLastSyncResult('Sinkronisasi selesai.')
      }
      await loadStats()
    } catch {
      setLastSyncResult('Data Anda tetap aman tersimpan di HP.')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Status Banner */}
      <div className="bg-parkpin-deepTeal text-parkpin-warmIvory rounded-3xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-bold text-xs uppercase tracking-wider">
              {isOnline ? 'Terhubung Online' : 'Mode Offline (Tanpa Internet)'}
            </span>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-white/10 rounded-full border border-white/20">
            {isOnline ? 'Aktif' : 'Offline'}
          </span>
        </div>

        <p className="text-xs text-parkpin-warmIvory/80 leading-relaxed">
          {isOnline
            ? 'Aplikasi terhubung ke internet. Lokasi parkir Anda otomatis dicadangkan agar riwayat tidak hilang saat berganti perangkat.'
            : 'Aplikasi berjalan 100% offline. Seluruh titik lokasi, kompas, dan foto patokan tetap dapat digunakan di basement tanpa internet.'}
        </p>
      </div>

      {/* 4 Metrik Ramah Pengguna */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext font-medium">
            <MapPin className="w-3.5 h-3.5 text-parkpin-mutedTeal" />
            <span>Lokasi Tersimpan</span>
          </div>
          <div className="text-xl font-bold text-parkpin-darkTeal">
            {recordCount} Tempat
          </div>
          <p className="text-[11px] text-parkpin-subtext">
            Tersimpan di memori HP
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext font-medium">
            <Camera className="w-3.5 h-3.5 text-parkpin-mutedTeal" />
            <span>Foto Patokan</span>
          </div>
          <div className="text-xl font-bold text-parkpin-darkTeal">
            {photoCount} Foto
          </div>
          <p className="text-[11px] text-parkpin-subtext">
            Foto pilar / tiang gedung
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-parkpin-mutedTeal" />
            <span>Status Cadangan</span>
          </div>
          <div className={`text-base font-bold ${queueItems.length > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {queueItems.length > 0 ? `${queueItems.length} Menunggu` : 'Aman & Sinkron'}
          </div>
          <p className="text-[11px] text-parkpin-subtext">
            {queueItems.length > 0 ? 'Menunggu koneksi internet' : 'Data Anda lengkap'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext font-medium">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
            <span>Koneksi HP</span>
          </div>
          <div className="text-base font-bold text-parkpin-darkTeal">
            {isOnline ? 'Terhubung' : 'Offline'}
          </div>
          <p className="text-[11px] text-parkpin-subtext">
            {isOnline ? 'Internet aktif' : 'Basement / tanpa sinyal'}
          </p>
        </div>
      </div>

      {lastSyncResult && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lastSyncResult}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={handleForceSync}
          disabled={isSyncing || !isOnline}
          className="w-full btn-primary disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sedang Mencadangkan...' : 'Cadangkan Data Sekarang'}</span>
        </button>
      </div>
    </div>
  )
}
