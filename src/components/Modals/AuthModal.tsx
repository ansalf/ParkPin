import React, { useState, useEffect } from 'react'
import { Shield, Mail, X, User, Check, Sparkles, CloudCheck, Phone } from 'lucide-react'
import { getUserProfile, setUserProfile, UserProfile } from '../../services/db'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (updated?: UserProfile) => void
  initialProfile?: UserProfile | null
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialProfile }) => {
  const [profileName, setProfileName] = useState('Anissa Alifia')
  const [profileEmail, setProfileEmail] = useState('anissa@example.com')
  const [isSaved, setIsSaved] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)

  useEffect(() => {
    if (isOpen) {
      if (initialProfile) {
        setProfileName(initialProfile.name)
        setProfileEmail(initialProfile.email)
      } else {
        getUserProfile().then((p) => {
          setProfileName(p.name)
          setProfileEmail(p.email)
        })
      }
      setIsSaved(false)
    }
  }, [isOpen, initialProfile])

  if (!isOpen) return null

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated: UserProfile = {
        name: profileName.trim() || 'Pengemudi ParkPin',
        email: profileEmail.trim() || 'user@parkpin.app',
        isLoggedIn: true
      }
      await setUserProfile(updated)

      // Broadcast custom event for any listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('parkpin:profile_updated', { detail: updated }))
      }

      // Instant state update to parent
      onSuccess(updated)
      setIsSaved(true)

      // Close modal smoothly
      setTimeout(() => {
        onClose()
      }, 400)
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan profil.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-parkpin-border animate-scale-up space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-parkpin-deepTeal text-parkpin-warmIvory flex items-center justify-center font-bold text-lg shadow-sm">
            <User className="w-6 h-6 text-parkpin-softSand" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-parkpin-darkTeal">
              Profil & Akun Anda
            </h3>
            <p className="text-xs text-parkpin-subtext">
              Atur identitas untuk penyimpanan akun
            </p>
          </div>
        </div>

        {/* Info card untuk pengguna umum */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Data lokasi parkir Anda tersimpan <b>privat & aman di HP</b>. Mengisi profil ini memastikan data Anda memiliki identitas akun pribadi.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3.5 pt-1">
          <div>
            <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-parkpin-subtext absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full h-11 pl-10 pr-3 text-sm bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl focus:outline-none focus:border-parkpin-deepTeal text-parkpin-darkTeal font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block mb-1.5">
              Email Anda
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-parkpin-subtext absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-11 pl-10 pr-3 text-sm bg-parkpin-warmIvory/60 border border-parkpin-border rounded-xl focus:outline-none focus:border-parkpin-deepTeal text-parkpin-darkTeal font-medium"
              />
            </div>
          </div>

          {/* Opsi Cadangan Otomatis */}
          <div className="p-3 bg-parkpin-warmIvory/50 rounded-2xl border border-parkpin-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-parkpin-darkTeal">Cadangan Otomatis</p>
              <p className="text-[10px] text-parkpin-subtext">Sinkronkan data saat ada koneksi internet</p>
            </div>
            <input
              type="checkbox"
              checked={autoBackup}
              onChange={(e) => setAutoBackup(e.target.checked)}
              className="w-4 h-4 text-parkpin-deepTeal rounded accent-parkpin-deepTeal cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary mt-2"
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                <span>Profil Tersimpan!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Simpan Profil</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
