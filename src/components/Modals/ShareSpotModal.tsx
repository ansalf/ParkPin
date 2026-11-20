import React, { useState } from 'react'
import { Share2, X, Check, Copy, MessageCircle, MapPin, ExternalLink, Smartphone } from 'lucide-react'
import { ParkingRecord } from '../../services/db'

interface ShareSpotModalProps {
  isOpen: boolean
  onClose: () => void
  record: ParkingRecord | null
}

export const ShareSpotModal: React.FC<ShareSpotModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !record) return null

  // Generate clean, readable message for WhatsApp / SMS / Telegram
  const generateShareMessage = () => {
    const lines = [
      '🅿️ *Catatan Lokasi Parkir (ParkPin)*',
      `• *Kendaraan:* ${record.vehicle_type === 'motor' ? '🛵 Motor' : '🚗 Mobil'}`,
      `• *Tempat:* ${record.garage_name}`,
      `• *Lantai:* ${['Luar Ruangan', 'Tepi Jalan', 'Halaman Ruko', 'VIP / Valet'].includes(record.floor_level) ? record.floor_level : `Lantai ${record.floor_level}`}`
    ]

    if (record.slot_bay) {
      lines.push(`• *Pilar / Tiang:* ${record.slot_bay}`)
    }
    if (record.zone_section) {
      lines.push(`• *Patokan Lobi:* ${record.zone_section}`)
    }
    if (record.notes) {
      lines.push(`• *Catatan:* "${record.notes}"`)
    }
    if (record.gps?.latitude && record.gps?.longitude) {
      lines.push(`• *Titik Maps:* https://maps.google.com/?q=${record.gps.latitude},${record.gps.longitude}`)
    }

    return lines.join('\n')
  }

  const shareText = generateShareMessage()

  // 1. Copy to clipboard
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText)
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = shareText
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.warn('Clipboard write failed:', err)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // 2. Share via WhatsApp
  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  // 3. Native system share dialog
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lokasi Parkir Saya',
          text: shareText
        })
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-parkpin-border pb-[calc(env(safe-area-inset-bottom)+1.5rem)] animate-slide-up z-10 space-y-4">
        {/* Top Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-parkpin-deepTeal text-parkpin-warmIvory flex items-center justify-center font-bold shadow-sm">
              <Share2 className="w-5 h-5 text-parkpin-softSand" />
            </div>
            <div>
              <h3 className="font-bold text-base text-parkpin-darkTeal">Bagikan Lokasi Parkir</h3>
              <p className="text-xs text-parkpin-subtext">Kirim titik parkir ke teman atau keluarga</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview Box */}
        <div className="p-3.5 bg-parkpin-warmIvory/60 rounded-2xl border border-parkpin-border text-xs text-parkpin-darkTeal space-y-1 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed shadow-inner">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Direct Share */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform text-sm"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Kirim via WhatsApp</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopy}
            className="w-full h-14 bg-white border border-parkpin-border text-parkpin-darkTeal font-bold rounded-2xl shadow-subtle hover:bg-parkpin-warmIvory/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-sm"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                <span className="text-emerald-700 font-bold">✓ Teks Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 text-parkpin-mutedTeal" />
                <span>Salin Teks Lokasi Parkir</span>
              </>
            )}
          </button>

          {/* Native Share fallback (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 text-center text-xs font-semibold text-parkpin-mutedTeal hover:text-parkpin-deepTeal flex items-center justify-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Gunakan Menu Berbagi Ponsel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
