import React, { useState, useEffect, useRef } from 'react'
import { Camera, MapPin, AlertTriangle, Check, X, Building2, Trees, RefreshCw, Car, Bike } from 'lucide-react'
import { ParkingRecord, GPSLocation, getDefaultVehicle, setDefaultVehicle } from '../services/db'
import { useLocation } from '../hooks/useLocation'
import { GPSSelectionModal } from '../components/Modals/GPSSelectionModal'
import { CameraCaptureModal } from '../components/Modals/CameraCaptureModal'

interface SaveSpotScreenProps {
  onSave: (record: ParkingRecord) => Promise<void>
  onCancel: () => void
  isOnline: boolean
}

type ParkingType = 'indoor' | 'outdoor'
type VehicleType = 'mobil' | 'motor'

// Preset lantai khas mall & gedung bertingkat di Indonesia (Basement, Ground Floor, Gedung Parkir P1-P3, Rooftop)
const INDOOR_FLOORS = ['B3', 'B2', 'B1', 'GF', 'P1', 'P2', 'P3', 'Roof']
const OUTDOOR_PRESETS = ['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet']

export const SaveSpotScreen: React.FC<SaveSpotScreenProps> = ({
  onSave,
  onCancel,
  isOnline: _isOnline
}) => {
  const { error: _gpsError, isLocating, getCurrentLocation } = useLocation()

  // Vehicle type toggle: Mobil vs Motor
  const [vehicleType, setVehicleType] = useState<VehicleType>('mobil')

  // Parking type toggle: indoor (gedung/mall/basement) vs outdoor (lapangan/ruko/jalan)
  const [parkingType, setParkingType] = useState<ParkingType>('indoor')

  // Form states disesuaikan dengan kebiasaan parkir di Indonesia
  const [garageName, setGarageName] = useState('')
  const [floorLevel, setFloorLevel] = useState('B2')
  const [customFloor, setCustomFloor] = useState('')
  const [pillarCode, setPillarCode] = useState('') // Kode Pilar / Tiang / Blok (menggantikan slot/bay)
  const [lobbyGate, setLobbyGate] = useState('') // Dekat Lobi / Pintu Masuk (menggantikan zona/area)
  const [notes, setNotes] = useState('')
  const [landmarkPhoto, setLandmarkPhoto] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gpsData, setGpsData] = useState<GPSLocation | null>(null)
  const [isGPSModalOpen, setIsGPSModalOpen] = useState(false)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved default vehicle on mount
  useEffect(() => {
    getDefaultVehicle().then((v) => {
      setVehicleType(v)
      if (v === 'motor') {
        setFloorLevel('B1')
      }
    })
  }, [])

  // Handle vehicle type switch
  const handleVehicleSwitch = (type: VehicleType) => {
    setVehicleType(type)
    setDefaultVehicle(type)
    if (type === 'motor') {
      if (parkingType === 'indoor' && (floorLevel === 'B3' || floorLevel === 'B2')) {
        setFloorLevel('B1') // Di Indonesia parkir motor mall biasanya di B1 atau GF
      }
    }
  }

  // Handle parking type switch
  const handleTypeSwitch = (type: ParkingType) => {
    setParkingType(type)
    if (type === 'outdoor') {
      setFloorLevel('Luar Ruangan')
      setCustomFloor('')
    } else {
      setFloorLevel(vehicleType === 'motor' ? 'B1' : 'B2')
    }
  }

  // Try auto-fetching GPS coordinates on mount
  useEffect(() => {
    getCurrentLocation().then((loc) => {
      if (loc) setGpsData(loc)
    })
  }, [getCurrentLocation])

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setLandmarkPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleManualGPSFetch = async () => {
    const loc = await getCurrentLocation()
    if (loc) {
      setGpsData(loc)
    } else {
      setIsGPSModalOpen(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const finalFloor = customFloor.trim()
      ? customFloor.trim().toUpperCase()
      : floorLevel

    const defaultPlaceName = vehicleType === 'motor' ? 'Parkir Motor' : 'Parkir Mobil'
    const finalName = garageName.trim() || (parkingType === 'outdoor' ? `${defaultPlaceName} Luar Ruangan` : `${defaultPlaceName} Gedung`)

    const newRecord: ParkingRecord = {
      id: `record_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      garage_name: finalName,
      floor_level: finalFloor,
      zone_section: lobbyGate.trim(), // Disimpan sebagai Patokan Lobi/Pintu
      slot_bay: pillarCode.trim(), // Disimpan sebagai Kode Pilar/Tiang/Blok
      vehicle_type: vehicleType,
      notes: notes.trim(),
      landmark_photo: landmarkPhoto || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      duration_seconds: 0,
      gps: gpsData || undefined,
      sync_status: 'pending'
    }

    try {
      await onSave(newRecord)
    } catch (err) {
      console.error('Failed to save parking record:', err)
      alert('Gagal menyimpan lokasi parkir ke memori lokal.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-6 space-y-4">
      {/* GPS Selection & Fallback Modal */}
      <GPSSelectionModal
        isOpen={isGPSModalOpen}
        onClose={() => setIsGPSModalOpen(false)}
        onSelectGPS={(loc) => setGpsData(loc)}
        currentGPS={gpsData || undefined}
      />

      {/* Live In-App Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(photo) => setLandmarkPhoto(photo)}
      />

      {/* Hidden file input fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        className="hidden"
      />

      {/* Top Selectors: Vehicle Type (Mobil/Motor) & Environment (Gedung/Outdoor) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Vehicle Selector */}
        <div className="bg-white rounded-2xl p-1 border border-parkpin-border shadow-subtle flex gap-1">
          <button
            type="button"
            onClick={() => handleVehicleSwitch('mobil')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
              vehicleType === 'mobil'
                ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-sm'
                : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Mobil</span>
          </button>
          <button
            type="button"
            onClick={() => handleVehicleSwitch('motor')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
              vehicleType === 'motor'
                ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-sm'
                : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Motor</span>
          </button>
        </div>

        {/* Environment Selector */}
        <div className="bg-white rounded-2xl p-1 border border-parkpin-border shadow-subtle flex gap-1">
          <button
            type="button"
            onClick={() => handleTypeSwitch('indoor')}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${
              parkingType === 'indoor'
                ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-sm'
                : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Gedung</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch('outdoor')}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${
              parkingType === 'outdoor'
                ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-sm'
                : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Outdoor</span>
          </button>
        </div>
      </div>

      {/* Interactive GPS Status Card */}
      <div className="bg-white border border-parkpin-border rounded-2xl p-3.5 shadow-subtle space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className={`w-4 h-4 shrink-0 ${gpsData ? 'text-emerald-600' : 'text-parkpin-mutedTeal'}`} />
            <span className="text-parkpin-darkTeal font-mono text-[11px]">
              {isLocating
                ? 'Mendeteksi titik koordinat...'
                : gpsData
                ? `GPS: ${gpsData.latitude.toFixed(5)}°, ${gpsData.longitude.toFixed(5)}°`
                : 'Titik GPS Belum Terkunci'}
            </span>
          </div>
          {gpsData ? (
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-full border border-emerald-200">
                {parkingType === 'outdoor' ? 'GPS Sangat Akurat' : 'Terkunci'}
              </span>
              <button
                type="button"
                onClick={() => setIsGPSModalOpen(true)}
                className="text-[10px] text-parkpin-mutedTeal hover:text-parkpin-deepTeal font-medium underline"
              >
                Ubah
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleManualGPSFetch}
                disabled={isLocating}
                className="px-3 py-1 bg-parkpin-deepTeal text-parkpin-warmIvory text-[11px] font-bold rounded-xl shadow-sm active:scale-95 transition-transform flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Mencari...' : 'Kunci GPS'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGPSModalOpen(true)}
                className="px-2 py-1 bg-parkpin-warmIvory text-parkpin-darkTeal text-[10px] font-semibold rounded-xl border border-parkpin-border"
              >
                Pilih
              </button>
            </div>
          )}
        </div>
        {!gpsData && (
          <p className="text-[11px] text-parkpin-subtext leading-relaxed">
            {parkingType === 'indoor'
              ? 'Sinyal satelit GPS sering terhalang di basement. Jika GPS kosong, Maps akan membuka pencarian berdasarkan nama tempat di bawah.'
              : 'Tekan "Kunci GPS" atau "Pilih" agar koordinat tempat parkir Anda tersimpan langsung ke Google Maps.'}
          </p>
        )}
      </div>

      {/* Landmark Photo Attachment Card */}
      <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle">
        <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block mb-2">
          Foto Patokan / Pilar (Opsional)
        </label>
        {landmarkPhoto ? (
          <div className="relative rounded-2xl overflow-hidden border border-parkpin-border bg-black/5">
            <img
              src={landmarkPhoto}
              alt="Landmark"
              className="w-full h-44 object-cover"
            />
            <button
              type="button"
              onClick={() => setLandmarkPhoto(null)}
              className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 text-white rounded-full backdrop-blur-sm active:scale-95 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsCameraModalOpen(true)}
              className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-white/90 text-parkpin-deepTeal text-xs font-semibold rounded-xl shadow-sm backdrop-blur-sm active:scale-95 transition-transform"
            >
              Ambil Ulang Foto
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCameraModalOpen(true)}
            className="w-full h-24 border-2 border-dashed border-parkpin-border hover:border-parkpin-mutedTeal rounded-2xl flex flex-col items-center justify-center gap-1.5 text-parkpin-subtext hover:text-parkpin-deepTeal transition-colors bg-parkpin-warmIvory/30 active:scale-[0.99]"
          >
            <Camera className="w-6 h-6 stroke-[1.8]" />
            <span className="text-xs font-medium">
              {parkingType === 'outdoor'
                ? 'Buka kamera untuk foto patokan sekitar / plang nama'
                : 'Buka kamera untuk foto kode pilar, nomor lift, atau rambu lantai'}
            </span>
          </button>
        )}
      </div>

      {/* Form Fields Card (Sesuai Konteks Indonesia) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Tempat / Mall */}
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1.5">
          <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block">
            {parkingType === 'indoor' ? 'Nama Gedung / Mall / Kantor' : 'Lokasi / Nama Tempat / Jalan'}
          </label>
          <input
            type="text"
            required
            value={garageName}
            onChange={(e) => setGarageName(e.target.value)}
            placeholder={
              vehicleType === 'motor'
                ? 'misal: Parkir Motor Grand Indonesia, Stasiun Tebet'
                : parkingType === 'indoor'
                ? 'misal: Grand Indonesia, PIM 2, Central Park, Gedung Astra'
                : 'misal: Depan Kopi Tuku Cipete, Jl. Sabang, Parkir Timur GBK'
            }
            className="w-full h-11 px-3.5 bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl text-sm font-semibold text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal"
          />
        </div>

        {/* Pemilih Lantai (Khas Mall/Gedung Indonesia) */}
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block">
              {parkingType === 'indoor' ? 'Lantai / Elevasi Parkir' : 'Area Permukaan'}
            </label>
            <span className="text-[10px] text-parkpin-mutedTeal font-medium">
              {parkingType === 'indoor' ? 'Pilih Lantai' : 'Area Terbuka'}
            </span>
          </div>

          {parkingType === 'indoor' ? (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {INDOOR_FLOORS.map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => {
                      setFloorLevel(floor)
                      setCustomFloor('')
                    }}
                    className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      floorLevel === floor && !customFloor
                        ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-md scale-102 ring-2 ring-parkpin-deepTeal/20'
                        : 'bg-parkpin-warmIvory/80 text-parkpin-darkTeal border border-parkpin-border hover:bg-parkpin-warmIvory'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customFloor}
                onChange={(e) => setCustomFloor(e.target.value)}
                placeholder="Atau ketik lantai lain (misal: P4A, Lantai 5, Mezzanine)"
                className="w-full h-11 px-3.5 text-xs bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal mt-2 font-medium"
              />
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OUTDOOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setFloorLevel(preset)
                    setCustomFloor('')
                  }}
                  className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    floorLevel === preset && !customFloor
                      ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-md scale-102 ring-2 ring-parkpin-deepTeal/20'
                      : 'bg-parkpin-warmIvory/80 text-parkpin-darkTeal border border-parkpin-border hover:bg-parkpin-warmIvory'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Patokan Indonesia: Kode Pilar & Dekat Lobi/Pintu */}
        <div className="grid grid-cols-2 gap-3">
          {/* Kolom 1: Kode Pilar / Tiang / Blok */}
          <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1.5">
            <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block">
              {parkingType === 'indoor' ? 'Kode Pilar / Tiang' : 'Blok / Baris'}
            </label>
            <input
              type="text"
              value={pillarCode}
              onChange={(e) => setPillarCode(e.target.value)}
              placeholder={
                parkingType === 'indoor'
                  ? 'misal: Pilar B12, Tiang 04'
                  : 'misal: Blok A, Baris 2'
              }
              className="w-full h-11 px-3 bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl text-sm font-semibold text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal"
            />
          </div>

          {/* Kolom 2: Dekat Lobi / Pintu Masuk / Lift */}
          <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1.5">
            <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block">
              {parkingType === 'indoor' ? 'Dekat Lobi / Pintu' : 'Patokan Terdekat'}
            </label>
            <input
              type="text"
              value={lobbyGate}
              onChange={(e) => setLobbyGate(e.target.value)}
              placeholder={
                parkingType === 'indoor'
                  ? 'misal: Lobi Barat, Lift Kaca'
                  : 'misal: Depan Indomaret, Samping Pos'
              }
              className="w-full h-11 px-3 bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl text-sm font-semibold text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal"
            />
          </div>
        </div>

        {/* Catatan & Lokasi Karcis Parkir */}
        <div className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle space-y-1.5">
          <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block">
            Catatan Tambahan / Lokasi Karcis Parkir
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="misal: Karcis parkir ada di dompet, kartu Flazz di dashboard mobil..."
            className="w-full p-3 bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl text-xs font-medium text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal resize-none"
          />
        </div>

        {/* Action Buttons (Enforced Standard Height 56px via .btn-primary & .btn-secondary) */}
        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-primary"
          >
            {isSubmitting ? (
              <span className="animate-spin text-lg">⏳</span>
            ) : (
              <>
                <Check className="w-5 h-5 stroke-[2.2] mr-2" />
                <span>Simpan Parkir</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
