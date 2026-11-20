import React from 'react'
import { Archive, X } from 'lucide-react'
import { ParkingRecord } from '../../services/db'

interface ArchiveModalProps {
  isOpen: boolean
  record: ParkingRecord | null
  onConfirm: () => void
  onCancel: () => void
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  record,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !record) return null

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hrs > 0) return `${hrs} jam ${mins} mnt`
    return `${mins} menit`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onCancel} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl border-t border-parkpin-border pb-[calc(env(safe-area-inset-bottom)+1.5rem)] animate-slide-up z-10">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Archive className="w-7 h-7 stroke-[2]" />
        </div>

        <h3 className="text-xl font-bold text-center text-parkpin-deepTeal">
          Selesaikan Sesi Parkir Ini?
        </h3>
        <p className="text-xs text-center text-parkpin-subtext mt-1.5 px-4 leading-relaxed">
          Pengatur waktu aktif akan dihentikan dan catatan parkir ini akan tersimpan rapi di Riwayat Parkir Anda.
        </p>

        {/* Summary box */}
        <div className="my-5 p-4 bg-parkpin-warmIvory/60 rounded-2xl border border-parkpin-border space-y-2 text-xs">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-parkpin-subtext">Lokasi:</span>
            <span className="font-semibold text-parkpin-darkTeal truncate max-w-[200px]">
              {record.garage_name}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-parkpin-subtext">Posisi:</span>
            <span className="font-semibold text-parkpin-darkTeal">
              Lantai {record.floor_level} {record.zone_section ? `· Dekat ${record.zone_section}` : ''} {record.slot_bay ? `· Pilar ${record.slot_bay}` : ''}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-t border-parkpin-border/60 pt-2">
            <span className="text-parkpin-subtext">Total Waktu Parkir:</span>
            <span className="font-bold text-parkpin-deepTeal">
              {formatDuration(record.duration_seconds)}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onConfirm}
            className="w-full btn-primary"
          >
            ✓ Ya, Selesai Parkir
          </button>
          <button
            onClick={onCancel}
            className="w-full btn-secondary"
          >
            Kembali (Tetap Parkir)
          </button>
        </div>
      </div>
    </div>
  )
}
