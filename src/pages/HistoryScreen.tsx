import React, { useState } from 'react'
import { Search, MapPin, Calendar, Clock, ChevronRight, Inbox, Filter } from 'lucide-react'
import { ParkingRecord } from '../services/db'

interface HistoryScreenProps {
  history: ParkingRecord[]
  activeRecord: ParkingRecord | null
  onSelectRecord: (recordId: string) => void
  onSaveNewSpot: () => void
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  activeRecord,
  onSelectRecord,
  onSaveNewSpot
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterWithPhoto, setFilterWithPhoto] = useState(false)

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.garage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.floor_level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.zone_section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slot_bay.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPhoto = filterWithPhoto ? Boolean(item.landmark_photo) : true
    return matchesSearch && matchesPhoto
  })

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hrs > 0) return `${hrs} jam ${mins} mnt`
    return `${mins} menit`
  }

  // ================= SCENARIO A: EMPTY HISTORY (STATE 01) =================
  if (history.length === 0 && !activeRecord) {
    return (
      <div className="py-12 px-4 text-center space-y-4 pb-24">
        <div className="w-20 h-20 rounded-full bg-parkpin-softSage/50 text-parkpin-deepTeal flex items-center justify-center mx-auto shadow-inner">
          <Inbox className="w-10 h-10 stroke-[1.8]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-parkpin-darkTeal">
            Riwayat Parkir Masih Kosong
          </h3>
          <p className="text-xs text-parkpin-subtext mt-1.5 max-w-xs mx-auto leading-relaxed">
            Anda belum memiliki riwayat parkir. Setiap kali selesai memarkirkan kendaraan, catatannya akan otomatis tersimpan rapi di sini.
          </p>
        </div>
        <button
          onClick={onSaveNewSpot}
          className="px-6 py-3.5 bg-parkpin-deepTeal text-parkpin-warmIvory font-semibold rounded-2xl shadow-card active:scale-[0.98] transition-transform text-xs inline-flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          <span>Simpan Parkir Pertama Anda</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-parkpin-subtext absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama gedung, lantai, pilar..."
          className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-parkpin-border rounded-2xl shadow-subtle text-parkpin-darkTeal focus:outline-none focus:border-parkpin-deepTeal"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterWithPhoto(false)}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            !filterWithPhoto
              ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-sm'
              : 'bg-white border border-parkpin-border text-parkpin-subtext'
          }`}
        >
          Semua ({history.length})
        </button>
        <button
          onClick={() => setFilterWithPhoto(true)}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filterWithPhoto
              ? 'bg-parkpin-deepTeal text-parkpin-warmIvory shadow-sm'
              : 'bg-white border border-parkpin-border text-parkpin-subtext'
          }`}
        >
          Ada Foto Patokan
        </button>
      </div>

      {/* Currently Active Banner */}
      {activeRecord && (
        <div
          onClick={() => onSelectRecord(activeRecord.id)}
          className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 shadow-subtle cursor-pointer active:scale-[0.99] transition-transform space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Sedang Parkir Aktif
            </span>
            <span className="text-[11px] font-bold text-emerald-800">
              Lihat Detail Parkir →
            </span>
          </div>
          <div className="text-sm font-bold text-emerald-950">
            {activeRecord.vehicle_type === 'motor' ? '🛵 ' : '🚗 '}
            {activeRecord.garage_name} · Lantai {activeRecord.floor_level}
          </div>
          <p className="text-[11px] text-emerald-800/80">
            {activeRecord.zone_section ? `Patokan: ${activeRecord.zone_section} · ` : ''}Pilar {activeRecord.slot_bay || '—'}
          </p>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider px-1">
          Daftar Riwayat Parkir
        </h4>

        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-parkpin-border text-center text-xs text-parkpin-subtext">
            Tidak ada catatan parkir yang cocok.
          </div>
        ) : (
          filteredHistory.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelectRecord(record.id)}
              className="bg-white rounded-3xl p-4 border border-parkpin-border shadow-subtle flex items-center justify-between cursor-pointer active:bg-parkpin-warmIvory/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {record.landmark_photo ? (
                  <img
                    src={record.landmark_photo}
                    alt="Landmark"
                    className="w-12 h-12 rounded-2xl object-cover border border-parkpin-border shrink-0 shadow-sm"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-2xl bg-parkpin-warmIvory border border-parkpin-border flex items-center justify-center font-black text-xs text-parkpin-deepTeal shrink-0 text-center px-1"
                    title={record.floor_level}
                  >
                    {['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(record.floor_level)
                      ? 'OUT'
                      : record.floor_level}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-parkpin-darkTeal truncate max-w-[190px]">
                    {record.vehicle_type === 'motor' ? '🛵 ' : '🚗 '}
                    {record.garage_name}
                  </h4>
                  <p className="text-[11px] text-parkpin-subtext mt-0.5">
                    Lantai {record.floor_level} · {record.zone_section ? `Dekat ${record.zone_section}` : 'Umum'}{record.slot_bay ? ` · Pilar ${record.slot_bay}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-parkpin-subtext">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-parkpin-mutedTeal" />
                      {formatDuration(record.duration_seconds)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-parkpin-mutedTeal" />
                      {new Date(record.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-parkpin-subtext/60 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
