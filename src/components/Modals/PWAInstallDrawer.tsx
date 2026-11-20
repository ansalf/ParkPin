import React from 'react'
import { Download, Share2, PlusSquare, X } from 'lucide-react'

interface PWAInstallDrawerProps {
  isOpen: boolean
  onClose: () => void
  isIOS: boolean
  onInstallAndroid: () => Promise<boolean>
}

export const PWAInstallDrawer: React.FC<PWAInstallDrawerProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallAndroid
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl border-t border-parkpin-border pb-[calc(env(safe-area-inset-bottom)+1.5rem)] animate-slide-up z-10">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-parkpin-deepTeal flex items-center justify-center text-white font-bold text-xl shadow-md">
              P
            </div>
            <div>
              <h3 className="font-bold text-lg text-parkpin-deepTeal">Pasang Aplikasi ParkPin</h3>
              <p className="text-xs text-parkpin-subtext">Akses cepat di layar utama & berjalan offline tanpa kuota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          /* iOS Safari instructions */
          <div className="space-y-3.5 bg-parkpin-warmIvory/60 rounded-2xl p-4 border border-parkpin-border/60 text-sm">
            <p className="text-xs font-semibold text-parkpin-subtext uppercase tracking-wider">
              Panduan Pasang di iPhone (Safari)
            </p>
            <div className="flex items-center gap-3 text-parkpin-darkTeal">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-parkpin-deepTeal shrink-0">
                <Share2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <p className="text-xs leading-relaxed">
                1. Tekan tombol <span className="font-semibold text-parkpin-deepTeal">Bagikan (Share)</span> di bilah bawah browser Safari.
              </p>
            </div>
            <div className="flex items-center gap-3 text-parkpin-darkTeal">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-parkpin-deepTeal shrink-0">
                <PlusSquare className="w-4 h-4 stroke-[2.2]" />
              </div>
              <p className="text-xs leading-relaxed">
                2. Gulir ke bawah lalu pilih <span className="font-semibold text-parkpin-deepTeal">"Add to Home Screen" (Tambah ke Layar Utama)</span>.
              </p>
            </div>
            <div className="flex items-center gap-3 text-parkpin-darkTeal">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-parkpin-deepTeal shrink-0 font-bold text-xs">
                3
              </div>
              <p className="text-xs leading-relaxed">
                3. Tekan <span className="font-semibold text-parkpin-deepTeal">Add (Tambah)</span> di pojok kanan atas.
              </p>
            </div>
          </div>
        ) : (
          /* Android 1-Click Install */
          <div className="space-y-4">
            <div className="bg-parkpin-warmIvory/60 rounded-2xl p-4 border border-parkpin-border/60 text-xs text-parkpin-darkTeal space-y-1.5">
              <p className="font-medium">✓ 100% Berfungsi di basement bawah tanah tanpa internet</p>
              <p className="font-medium">✓ Membuka layar penuh seperti aplikasi resmi Play Store</p>
              <p className="font-medium">✓ Foto dan catatan tersimpan aman di memori lokal HP</p>
            </div>
            <button
              onClick={async () => {
                const installed = await onInstallAndroid()
                if (installed) onClose()
              }}
              className="w-full btn-primary"
            >
              <Download className="w-5 h-5 mr-2" />
              <span>Pasang ke Layar Utama Ponsel</span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-center text-xs font-medium text-parkpin-subtext hover:text-parkpin-darkTeal transition-colors"
        >
          Lanjutkan di Browser
        </button>
      </div>
    </div>
  )
}
