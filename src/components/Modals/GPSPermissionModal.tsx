import React from 'react'
import { Navigation, ShieldCheck } from 'lucide-react'

interface GPSPermissionModalProps {
  isOpen: boolean
  onRetry: () => void
  onManualInput: () => void
  onClose: () => void
}

export const GPSPermissionModal: React.FC<GPSPermissionModalProps> = ({
  isOpen,
  onRetry,
  onManualInput,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl border-t border-parkpin-border pb-[calc(env(safe-area-inset-bottom)+1.5rem)] animate-slide-up z-10">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Navigation className="w-7 h-7 stroke-[2]" />
        </div>

        <h3 className="text-xl font-bold text-center text-parkpin-deepTeal">
          Izin Akses Lokasi (GPS)
        </h3>
        <p className="text-xs text-center text-parkpin-subtext mt-1.5 px-4 leading-relaxed">
          ParkPin menggunakan GPS ponsel untuk mendeteksi koordinat parkir dan membantu kompas penunjuk arah saat Anda kembali ke kendaraan.
        </p>

        {/* Benefits box */}
        <div className="my-5 p-4 bg-parkpin-warmIvory/60 rounded-2xl border border-parkpin-border space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-parkpin-darkTeal">
              <span className="font-semibold">Privasi Terjaga:</span> Titik GPS hanya disimpan di dalam memori ponsel Anda.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-parkpin-darkTeal">
              <span className="font-semibold">Bisa Tanpa GPS:</span> Di basement mall yang kedap sinyal satelit, Anda tetap bisa menyimpan parkir secara manual berdasarkan kode pilar.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onRetry}
            className="w-full btn-primary"
          >
            Aktifkan Izin Lokasi
          </button>
          <button
            onClick={onManualInput}
            className="w-full btn-secondary"
          >
            Lanjutkan Tanpa GPS (Input Manual)
          </button>
        </div>
      </div>
    </div>
  )
}
