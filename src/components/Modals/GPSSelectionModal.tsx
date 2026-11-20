import React, { useState } from 'react'
import { MapPin, X, Navigation, Check, AlertCircle, Sparkles } from 'lucide-react'
import { GPSLocation } from '../../services/db'

interface GPSSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectGPS: (loc: GPSLocation) => void
  currentGPS?: GPSLocation
}

const PRESET_LOCATIONS = [
  {
    name: 'Grand Indonesia / Bundaran HI',
    desc: 'Jakarta Pusat',
    lat: -6.1950,
    lng: 106.8230
  },
  {
    name: 'Pondok Indah Mall (PIM)',
    desc: 'Jakarta Selatan',
    lat: -6.2655,
    lng: 106.7842
  },
  {
    name: 'GBK Senayan (Parkir Timur)',
    desc: 'Jakarta Pusat / Selatan',
    lat: -6.2185,
    lng: 106.8026
  },
  {
    name: 'Kota Kasablanka (Kokas)',
    desc: 'Jakarta Selatan',
    lat: -6.2241,
    lng: 106.8431
  }
]

export const GPSSelectionModal: React.FC<GPSSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectGPS,
  currentGPS
}) => {
  const [customLat, setCustomLat] = useState(currentGPS ? currentGPS.latitude.toString() : '-6.2000')
  const [customLng, setCustomLng] = useState(currentGPS ? currentGPS.longitude.toString() : '106.8166')

  if (!isOpen) return null

  const handleApplyPreset = (lat: number, lng: number) => {
    onSelectGPS({
      latitude: lat,
      longitude: lng,
      accuracy: 10
    })
    onClose()
  }

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault()
    const lat = parseFloat(customLat)
    const lng = parseFloat(customLng)
    if (isNaN(lat) || isNaN(lng)) {
      alert('Koordinat tidak valid. Masukkan angka latitude dan longitude.')
      return
    }
    onSelectGPS({
      latitude: lat,
      longitude: lng,
      accuracy: 15
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-parkpin-border animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-parkpin-deepTeal text-parkpin-warmIvory flex items-center justify-center">
            <MapPin className="w-5 h-5 text-parkpin-softSand" />
          </div>
          <div>
            <h3 className="font-bold text-base text-parkpin-darkTeal">
              Atur Titik Lokasi GPS
            </h3>
            <p className="text-[11px] text-parkpin-subtext">
              Pilih lokasi atau masukkan titik koordinat
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Info Sensor GPS Laptop/Browser:</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Laptop Mac tidak memiliki chip satelit GPS fisik. Di HP asli, GPS akan mengunci otomatis dengan akurasi satelit. Untuk pengujian di laptop, Anda bisa memilih lokasi di bawah.
          </p>
        </div>

        {/* Preset Locations */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-parkpin-subtext uppercase tracking-wider block">
            Pilih Lokasi Cepat (Pengujian)
          </span>
          <div className="space-y-1.5">
            {PRESET_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.lat, preset.lng)}
                className="w-full p-2.5 bg-parkpin-warmIvory/60 hover:bg-parkpin-warmIvory border border-parkpin-border rounded-xl text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <p className="text-xs font-bold text-parkpin-darkTeal group-hover:text-parkpin-deepTeal">
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-parkpin-subtext font-mono">
                    {preset.desc} · {preset.lat.toFixed(4)}, {preset.lng.toFixed(4)}
                  </p>
                </div>
                <Navigation className="w-3.5 h-3.5 text-parkpin-mutedTeal shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Coordinates Form */}
        <form onSubmit={handleApplyCustom} className="space-y-2 pt-1 border-t border-parkpin-border/60">
          <span className="text-[10px] font-bold text-parkpin-subtext uppercase tracking-wider block">
            Atau Ketik Titik Koordinat Manual
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-parkpin-subtext block mb-0.5">
                Latitude
              </label>
              <input
                type="text"
                required
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="-6.2000"
                className="w-full h-9 px-2.5 bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl font-mono text-[11px] text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-parkpin-subtext block mb-0.5">
                Longitude
              </label>
              <input
                type="text"
                required
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                placeholder="106.8166"
                className="w-full h-9 px-2.5 bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl font-mono text-[11px] text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-parkpin-deepTeal text-parkpin-warmIvory font-semibold rounded-xl text-xs shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Titik Koordinat</span>
          </button>
        </form>
      </div>
    </div>
  )
}
