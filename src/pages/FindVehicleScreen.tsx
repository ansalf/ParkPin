import React, { useState } from 'react'
import { Compass, MapPin, ExternalLink, CheckCircle2, ChevronRight, AlertTriangle, Eye } from 'lucide-react'
import { ParkingRecord } from '../services/db'
import { useLocation } from '../hooks/useLocation'

interface FindVehicleScreenProps {
  record: ParkingRecord
  onFoundVehicle: () => void
  onBack: () => void
}

export const FindVehicleScreen: React.FC<FindVehicleScreenProps> = ({
  record,
  onFoundVehicle,
  onBack
}) => {
  const { heading } = useLocation()
  const [photoExpanded, setPhotoExpanded] = useState(false)

  const openInExternalMaps = () => {
    if (record.gps?.latitude && record.gps?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${record.gps.latitude},${record.gps.longitude}`
      window.open(url, '_blank')
    } else {
      const query = encodeURIComponent(`${record.garage_name}`)
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
    }
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Compass HUD Card */}
      <div className="bg-parkpin-deepTeal text-parkpin-warmIvory rounded-3xl p-5 shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-parkpin-softSand tracking-widest uppercase block">
              Kompas Panduan Berjalan Kaki
            </span>
            <div className="text-2xl font-bold flex items-center gap-2 font-mono">
              <Compass
                className="w-6 h-6 text-parkpin-softSand transition-transform duration-300"
                style={{ transform: heading !== null ? `rotate(${heading}deg)` : undefined }}
              />
              <span>{heading !== null ? `${heading}° Arah` : '240° Barat Daya'}</span>
            </div>
            <p className="text-xs text-parkpin-warmIvory/80">
              {['Outdoor', 'Street', 'Ground', 'VIP Lot', 'Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(record.floor_level) ? (
                <>Jalur Permukaan Luar · <span className="font-bold text-white">{record.floor_level}</span></>
              ) : record.floor_level.startsWith('B') ? (
                <>Turun ke Lantai <span className="font-bold text-white">{record.floor_level}</span></>
              ) : (
                <>Naik ke Lantai <span className="font-bold text-white">{record.floor_level}</span></>
              )}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center p-1">
            <span className="text-[9px] uppercase font-bold text-parkpin-softSand">Tujuan</span>
            <span className="text-lg font-black text-white">{record.floor_level}</span>
          </div>
        </div>
      </div>

      {/* Where You Parked Card */}
      <div className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle space-y-2">
        <span className="text-[10px] font-bold text-parkpin-subtext uppercase tracking-widest block">
          Titik Lokasi Parkir Anda
        </span>
        <div className="text-xl font-bold text-parkpin-darkTeal">
          {record.vehicle_type === 'motor' ? '🛵 ' : '🚗 '}
          {['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(record.floor_level)
            ? record.floor_level
            : `Lantai ${record.floor_level}`}
          {record.slot_bay ? ` · ${record.slot_bay}` : ''}
        </div>
        {record.zone_section && (
          <p className="text-xs text-parkpin-deepTeal font-medium">
            Patokan: <span className="font-semibold">{record.zone_section}</span>
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext font-medium">
          <MapPin className="w-3.5 h-3.5 text-parkpin-mutedTeal shrink-0" />
          <span className="truncate">{record.garage_name}</span>
        </div>
        {record.notes && (
          <p className="text-xs text-parkpin-darkTeal/80 bg-parkpin-warmIvory/60 rounded-xl p-2.5 mt-2 border border-parkpin-border/60">
            "{record.notes}"
          </p>
        )}
      </div>

      {/* Landmark Photo Card (if photo exists) */}
      {record.landmark_photo && (
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-parkpin-subtext uppercase tracking-widest block">
              Foto Patokan Parkir
            </span>
            <button
              onClick={() => setPhotoExpanded(!photoExpanded)}
              className="text-[11px] font-semibold text-parkpin-mutedTeal flex items-center gap-1 hover:underline"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{photoExpanded ? 'Kecilkan Foto' : 'Perbesar Foto'}</span>
            </button>
          </div>

          <div
            onClick={() => setPhotoExpanded(!photoExpanded)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer border border-parkpin-border transition-all duration-300 ${
              photoExpanded ? 'h-72' : 'h-36'
            }`}
          >
            <img
              src={record.landmark_photo}
              alt="Parking Landmark"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 text-white text-[10px] font-semibold rounded-lg backdrop-blur-sm">
              ✓ Tersimpan di HP (Offline)
            </div>
          </div>
        </div>
      )}

      {/* External Map & GPS Notice */}
      <div className="space-y-2">
        <button
          onClick={openInExternalMaps}
          className="w-full btn-secondary text-sm"
        >
          <ExternalLink className="w-4 h-4 text-parkpin-mutedTeal mr-2" />
          <span>Buka Lokasi di Google Maps</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 text-[11px] text-parkpin-subtext">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Gunakan rute kompas & foto patokan untuk navigasi di dalam gedung.</span>
        </div>
      </div>

      {/* Primary Action: Found Car (Archive) */}
      <div className="pt-2">
        <button
          onClick={onFoundVehicle}
          className="w-full btn-primary"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[2.2] mr-2" />
          <span>✓ Saya Sudah Menemukan Kendaraan (Selesai)</span>
        </button>
      </div>
    </div>
  )
}
