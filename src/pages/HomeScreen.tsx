import React, { useState, useEffect } from 'react'
import { MapPin, Navigation, Clock, Camera, Compass, Share2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { ParkingRecord, updateParkingRecord } from '../services/db'
import { ShareSpotModal } from '../components/Modals/ShareSpotModal'

interface HomeScreenProps {
  activeRecord: ParkingRecord | null
  recentHistory: ParkingRecord[]
  onSaveNewSpot: () => void
  onFindVehicle: () => void
  onEndParking: () => void
  onViewRecordDetail: (recordId: string) => void
  onReloadData?: () => void
  isOnline: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeRecord,
  recentHistory,
  onSaveNewSpot,
  onFindVehicle,
  onEndParking,
  onViewRecordDetail,
  onReloadData,
  isOnline
}) => {
  // Live timer for active session
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    if (!activeRecord) return

    const updateTimer = () => {
      const start = new Date(activeRecord.created_at).getTime()
      const now = Date.now()
      setElapsedSeconds(Math.max(0, Math.floor((now - start) / 1000)))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [activeRecord])

  const formatElapsed = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`
  }

  // ================= SCENARIO A: ACTIVE PARKING SESSION (Screen 03) =================
  if (activeRecord) {
    return (
      <div className="space-y-4 pb-6">
        {/* Active Badge Strip */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-parkpin-deepTeal uppercase">
              Kendaraan Terparkir
            </span>
          </div>
          <span className="text-[11px] font-medium text-parkpin-subtext">
            {activeRecord.sync_status === 'synced' ? '✓ Tersinkron Cloud' : '• Tersimpan di Memori HP'}
          </span>
        </div>

        {/* Live Timer HUD Card */}
        <div className="bg-parkpin-deepTeal text-parkpin-warmIvory rounded-3xl p-5 shadow-card relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
            <Clock className="w-36 h-36" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-parkpin-softSand tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Durasi Parkir Berjalan</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight mt-1 font-mono">
            {formatElapsed(elapsedSeconds)}
          </div>
          <p className="text-[11px] text-parkpin-warmIvory/70 mt-1">
            Diparkir pukul {new Date(activeRecord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Spot Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-parkpin-subtext font-medium">
              <MapPin className="w-3.5 h-3.5 text-parkpin-mutedTeal" />
              <span>{activeRecord.garage_name || 'Lokasi Parkir'}</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="text-2xl font-bold text-parkpin-darkTeal tracking-tight flex items-center gap-1.5">
                <span>{activeRecord.vehicle_type === 'motor' ? '🛵' : '🚗'}</span>
                <span>
                  {['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(activeRecord.floor_level)
                    ? activeRecord.floor_level
                    : `Lantai ${activeRecord.floor_level}`}
                  {activeRecord.slot_bay ? ` · ${activeRecord.slot_bay}` : ''}
                </span>
              </div>

              {/* Quick Vehicle Switcher */}
              <div className="inline-flex bg-parkpin-warmIvory rounded-xl p-0.5 border border-parkpin-border gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    await updateParkingRecord(activeRecord.id, { vehicle_type: 'mobil', updated_at: new Date().toISOString() })
                    if (onReloadData) onReloadData()
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1 ${
                    activeRecord.vehicle_type !== 'motor'
                      ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-xs'
                      : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
                  }`}
                  title="Ganti ke Mobil"
                >
                  <span>🚗</span>
                  <span className="hidden sm:inline">Mobil</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateParkingRecord(activeRecord.id, { vehicle_type: 'motor', updated_at: new Date().toISOString() })
                    if (onReloadData) onReloadData()
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1 ${
                    activeRecord.vehicle_type === 'motor'
                      ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-xs'
                      : 'text-parkpin-subtext hover:text-parkpin-darkTeal'
                  }`}
                  title="Ganti ke Motor"
                >
                  <span>🛵</span>
                  <span className="hidden sm:inline">Motor</span>
                </button>
              </div>
            </div>
            {activeRecord.zone_section && (
              <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs font-semibold bg-parkpin-softSage/60 text-parkpin-deepTeal rounded-lg border border-parkpin-mutedTeal/30">
                Patokan: {activeRecord.zone_section}
              </span>
            )}
          </div>

          {/* Landmark Preview Photo if exists */}
          {activeRecord.landmark_photo && (
            <div className="flex items-center gap-3 bg-parkpin-warmIvory/60 rounded-2xl p-2.5 border border-parkpin-border/60">
              <img
                src={activeRecord.landmark_photo}
                alt="Landmark"
                className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0"
              />
              <div className="text-xs overflow-hidden">
                <p className="font-semibold text-parkpin-darkTeal truncate">Foto Patokan Tersimpan</p>
                <p className="text-[11px] text-parkpin-subtext line-clamp-2">
                  {activeRecord.notes || 'Foto patokan visual terlampir'}
                </p>
              </div>
            </div>
          )}

          {activeRecord.notes && !activeRecord.landmark_photo && (
            <div className="bg-parkpin-warmIvory/60 rounded-2xl p-3 border border-parkpin-border/60 text-xs text-parkpin-darkTeal">
              <span className="font-semibold text-parkpin-subtext block text-[10px] uppercase tracking-wider mb-0.5">
                Catatan
              </span>
              {activeRecord.notes}
            </div>
          )}
        </div>

        {/* Primary Action: Find My Vehicle */}
        <button
          onClick={onFindVehicle}
          className="w-full btn-primary"
        >
          <Compass className="w-5 h-5 stroke-[2.2] mr-2" />
          <span>Petunjuk Arah ke Kendaraan →</span>
        </button>

        {/* Secondary Actions (Tinggi Proporsional 56px Anti-Gepeng) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="h-14 bg-white rounded-2xl border border-parkpin-border flex items-center justify-center gap-2 text-xs font-bold text-parkpin-darkTeal shadow-subtle active:scale-[0.98] transition-transform hover:bg-parkpin-warmIvory/40"
          >
            <Share2 className="w-4 h-4 text-parkpin-mutedTeal" />
            <span>Bagikan Lokasi</span>
          </button>

          <button
            onClick={onEndParking}
            className="h-14 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-center gap-2 text-xs font-bold text-red-700 shadow-subtle active:scale-[0.98] transition-transform hover:bg-red-100/50"
          >
            <CheckCircle2 className="w-4 h-4 text-red-600" />
            <span>Selesai Parkir</span>
          </button>
        </div>

        {/* Modal Berbagi Lokasi Lengkap (WhatsApp, Salin Teks, dll) */}
        <ShareSpotModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          record={activeRecord}
        />
      </div>
    )
  }

  // Helper for clean floor badge without text overflow
  const renderFloorBadge = (floor: string) => {
    if (['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(floor)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-parkpin-softSage/70 flex items-center justify-center text-parkpin-deepTeal font-extrabold text-[11px] border border-parkpin-mutedTeal/30 shrink-0" title={floor}>
          OUT
        </div>
      )
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-parkpin-warmIvory flex items-center justify-center text-parkpin-deepTeal font-extrabold text-xs border border-parkpin-border shrink-0">
        {floor}
      </div>
    )
  }

  // ================= SCENARIO B: NO ACTIVE SESSION / READY TO PIN (Screen 01) =================
  return (
    <div className="space-y-4 pb-6">
      {/* Hero Empty State Card */}
      <div className="bg-white rounded-3xl p-6 border border-parkpin-border shadow-subtle text-center space-y-4">
        {/* Beacon Outer / Inner P Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-parkpin-softSage/40 animate-ping opacity-75" />
          <div className="relative w-16 h-16 rounded-full bg-parkpin-deepTeal flex items-center justify-center text-parkpin-warmIvory shadow-md">
            <span className="font-extrabold text-2xl font-mono">P</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-parkpin-darkTeal">
            Belum Ada Parkir Aktif
          </h2>
          <p className="text-xs text-parkpin-subtext mt-1.5 px-4 leading-relaxed">
            ParkPin siap mengingat lokasi parkir Anda. Simpan lantai, kode tiang/pilar, patokan lobi, atau foto saat memarkir kendaraan.
          </p>
        </div>

        <button
          onClick={onSaveNewSpot}
          className="w-full btn-primary"
        >
          <MapPin className="w-5 h-5 mr-2" />
          <span>Simpan Titik Parkir Baru</span>
        </button>
      </div>

      {/* Smart Quick Tip */}
      <div className="bg-parkpin-softSage/30 border border-parkpin-mutedTeal/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-parkpin-deepTeal/10 flex items-center justify-center text-parkpin-deepTeal shrink-0">
          <Camera className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-parkpin-deepTeal uppercase tracking-wider text-[10px] block">
            Tips Parkir Praktis
          </span>
          <p className="text-parkpin-darkTeal mt-0.5 leading-relaxed">
            Ambil foto kode tiang terdekat atau pintu lift agar Anda tidak bingung saat mencari kendaraan nanti.
          </p>
        </div>
      </div>

      {/* Recent History Preview */}
      {recentHistory.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-parkpin-subtext uppercase tracking-wider">
              Riwayat Parkir Terakhir
            </h3>
            <span className="text-[11px] text-parkpin-mutedTeal font-medium">
              {recentHistory.length} Tersimpan
            </span>
          </div>

          <div className="space-y-2">
            {recentHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onViewRecordDetail(item.id)}
                className="bg-white rounded-2xl p-3.5 border border-parkpin-border shadow-subtle flex items-center justify-between cursor-pointer active:bg-parkpin-warmIvory/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {renderFloorBadge(item.floor_level)}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-parkpin-darkTeal truncate max-w-[180px]">
                      {item.garage_name}
                    </h4>
                    <p className="text-[11px] text-parkpin-subtext mt-0.5 truncate">
                      {item.zone_section ? `${item.zone_section} · ` : ''}Pilar {item.slot_bay || '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[10px] font-medium text-parkpin-subtext block">
                    {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-parkpin-subtext inline-block mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
