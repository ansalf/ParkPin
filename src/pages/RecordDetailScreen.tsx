import React, { useState } from 'react'
import { MapPin, Calendar, Clock, Trash2, ExternalLink, AlertTriangle, Navigation, Check, RefreshCw, Edit2, Share2 } from 'lucide-react'
import { ParkingRecord, updateParkingRecord, GPSLocation } from '../services/db'
import { useLocation } from '../hooks/useLocation'
import { GPSSelectionModal } from '../components/Modals/GPSSelectionModal'
import { ShareSpotModal } from '../components/Modals/ShareSpotModal'

interface RecordDetailScreenProps {
  record: ParkingRecord
  onBack: () => void
  onDelete: (id: string) => Promise<void>
}

export const RecordDetailScreen: React.FC<RecordDetailScreenProps> = ({
  record: initialRecord,
  onBack,
  onDelete
}) => {
  const [record, setRecord] = useState<ParkingRecord>(initialRecord)
  const [isUpdatingGPS, setIsUpdatingGPS] = useState(false)
  const [isGPSModalOpen, setIsGPSModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { getCurrentLocation } = useLocation()

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hrs > 0) return `${hrs}h ${mins}m`
    return `${mins}m`
  }

  const handleToggleVehicleType = async (type: 'mobil' | 'motor') => {
    try {
      const updated = await updateParkingRecord(record.id, {
        vehicle_type: type,
        updated_at: new Date().toISOString()
      })
      setRecord(updated)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (confirm('Hapus rekaman parkir ini dari memori lokal?')) {
      await onDelete(record.id)
      onBack()
    }
  }

  const handleAcquireGPS = async () => {
    setIsUpdatingGPS(true)
    try {
      const loc = await getCurrentLocation()
      if (loc) {
        const updated = await updateParkingRecord(record.id, {
          gps: loc,
          updated_at: new Date().toISOString()
        })
        setRecord(updated)
      } else {
        // Fallback gracefully to modal selection
        setIsGPSModalOpen(true)
      }
    } catch {
      setIsGPSModalOpen(true)
    } finally {
      setIsUpdatingGPS(false)
    }
  }

  const handleCustomGPSSelected = async (loc: GPSLocation) => {
    try {
      const updated = await updateParkingRecord(record.id, {
        gps: loc,
        updated_at: new Date().toISOString()
      })
      setRecord(updated)
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan koordinat.')
    }
  }

  const openInExternalMaps = () => {
    if (record.gps?.latitude && record.gps?.longitude) {
      // Direct turn-by-turn navigation to exact coordinates
      const url = `https://www.google.com/maps/dir/?api=1&destination=${record.gps.latitude},${record.gps.longitude}`
      window.open(url, '_blank')
    } else {
      // Search by place name
      const query = encodeURIComponent(`${record.garage_name}`)
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
    }
  }

  const hasGPS = Boolean(record.gps?.latitude && record.gps?.longitude)

  return (
    <div className="space-y-4 pb-6">
      {/* GPS Selection & Fallback Modal */}
      <GPSSelectionModal
        isOpen={isGPSModalOpen}
        onClose={() => setIsGPSModalOpen(false)}
        onSelectGPS={handleCustomGPSSelected}
        currentGPS={record.gps}
      />

      {/* Landmark Photo Banner */}
      {record.landmark_photo && (
        <div className="rounded-3xl overflow-hidden border border-parkpin-border shadow-subtle relative bg-black/5">
          <img
            src={record.landmark_photo}
            alt="Landmark"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 text-white text-[10px] font-semibold rounded-lg backdrop-blur-sm">
            ✓ Foto Tersimpan di HP (Offline)
          </div>
        </div>
      )}

      {/* Structure Card */}
      <div className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-parkpin-subtext font-medium">{record.garage_name}</span>
          <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-parkpin-softSage/60 text-parkpin-deepTeal rounded-full border border-parkpin-mutedTeal/30">
            {record.status === 'active' ? 'Parkir Aktif' : 'Arsip Riwayat'}
          </span>
        </div>

        <div className="text-2xl font-bold text-parkpin-darkTeal flex items-center gap-2">
          <span>{record.vehicle_type === 'motor' ? '🛵' : '🚗'}</span>
          <span>
            {['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(record.floor_level)
              ? record.floor_level
              : `Lantai ${record.floor_level}`}
            {record.slot_bay ? ` · ${record.slot_bay}` : ''}
          </span>
        </div>

        {record.zone_section && (
          <p className="text-xs text-parkpin-subtext font-medium">
            Patokan: <span className="text-parkpin-darkTeal font-semibold">{record.zone_section}</span>
          </p>
        )}

        {/* Toggle Ganti Jenis Kendaraan (Mobil vs Motor) */}
        <div className="flex items-center justify-between pt-2.5 border-t border-parkpin-border/60">
          <span className="text-xs text-parkpin-subtext font-medium">Jenis Kendaraan:</span>
          <div className="inline-flex bg-parkpin-warmIvory rounded-xl p-1 border border-parkpin-border gap-1">
            <button
              type="button"
              onClick={() => handleToggleVehicleType('mobil')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                record.vehicle_type !== 'motor'
                  ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-xs'
                  : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
              }`}
            >
              <span>🚗</span>
              <span>Mobil</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleVehicleType('motor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                record.vehicle_type === 'motor'
                  ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-xs'
                  : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
              }`}
            >
              <span>🛵</span>
              <span>Motor</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPS Status & Coordinate HUD Card */}
      <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-parkpin-subtext uppercase tracking-widest block">
            Titik Lokasi GPS
          </span>
          {hasGPS ? (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Koordinat Tersimpan</span>
              </span>
              <button
                type="button"
                onClick={() => setIsGPSModalOpen(true)}
                className="text-[10px] text-parkpin-mutedTeal hover:text-parkpin-deepTeal font-medium flex items-center gap-0.5 underline"
              >
                <Edit2 className="w-3 h-3" />
                <span>Ubah</span>
              </button>
            </div>
          ) : (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-semibold text-[10px] rounded-full border border-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>GPS Belum Tercatat</span>
            </span>
          )}
        </div>

        {hasGPS ? (
          <div className="bg-parkpin-warmIvory/60 rounded-2xl p-3 border border-parkpin-border/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-parkpin-darkTeal font-mono text-[11px]">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {record.gps!.latitude.toFixed(6)}°, {record.gps!.longitude.toFixed(6)}°
              </span>
            </div>
            {record.gps!.accuracy && (
              <span className="text-[10px] text-parkpin-subtext">
                ±{Math.round(record.gps!.accuracy)}m
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-parkpin-subtext leading-relaxed">
              Titik koordinat belum terkunci. Klik tombol di bawah untuk mendeteksi GPS atau memilih lokasi.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAcquireGPS}
                disabled={isUpdatingGPS}
                className="flex-1 py-2.5 px-3 bg-parkpin-deepTeal text-parkpin-warmIvory text-xs font-bold rounded-xl shadow-sm hover:bg-parkpin-darkTeal flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingGPS ? 'animate-spin' : ''}`} />
                <span>{isUpdatingGPS ? 'Mencari...' : 'Kunci Titik GPS'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGPSModalOpen(true)}
                className="py-2.5 px-3 bg-parkpin-warmIvory text-parkpin-darkTeal text-xs font-bold rounded-xl border border-parkpin-border hover:bg-parkpin-border/40 transition-colors"
              >
                Pilih Lokasi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date & Duration Side-by-Side Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext">
            <Calendar className="w-3.5 h-3.5 text-parkpin-mutedTeal" />
            <span>Waktu Simpan</span>
          </div>
          <div className="text-sm font-bold text-parkpin-darkTeal">
            {new Date(record.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
          <p className="text-[11px] text-parkpin-subtext">
            {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext">
            <Clock className="w-3.5 h-3.5 text-parkpin-mutedTeal" />
            <span>Durasi</span>
          </div>
          <div className="text-sm font-bold text-parkpin-darkTeal">
            {formatDuration(record.duration_seconds || 1800)}
          </div>
          <p className="text-[11px] text-parkpin-subtext">
            Total waktu parkir
          </p>
        </div>
      </div>

      {/* Parking Notes */}
      {record.notes && (
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1">
          <span className="text-[10px] font-bold text-parkpin-subtext uppercase tracking-widest block">
            Catatan Parkir
          </span>
          <p className="text-xs text-parkpin-darkTeal leading-relaxed">
            "{record.notes}"
          </p>
        </div>
      )}

      {/* Map Action Button */}
      <button
        onClick={openInExternalMaps}
        className="w-full btn-primary"
      >
        <Navigation className="w-5 h-5 text-parkpin-softSand shrink-0 mr-2" />
        <span>
          {hasGPS
            ? `Petunjuk Arah Menuju ${record.vehicle_type === 'motor' ? 'Motor' : 'Mobil'} (Google Maps)`
            : `Cari Lokasi "${record.garage_name}" di Maps`}
        </span>
      </button>

      {/* Share Spot Button */}
      <button
        onClick={() => setIsShareModalOpen(true)}
        className="w-full btn-secondary"
      >
        <Share2 className="w-4 h-4 mr-2 text-parkpin-mutedTeal" />
        <span>Bagikan Titik Parkir Ini</span>
      </button>

      {/* Delete Record Button */}
      <button
        onClick={handleDelete}
        className="w-full btn-secondary text-red-600 border-red-200 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        <span>Hapus Catatan Parkir Ini</span>
      </button>

      {/* Modal Berbagi Lokasi */}
      <ShareSpotModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        record={record}
      />
    </div>
  )
}
