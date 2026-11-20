import React, { useState, useEffect } from 'react'
import { Cloud, Database, ShieldCheck, User, ChevronRight, Smartphone, Bell, Edit3, Download } from 'lucide-react'
import { getUserProfile, UserProfile } from '../services/db'

interface SettingsScreenProps {
  profile?: UserProfile
  onOpenSyncStatus: () => void
  onOpenAuth: () => void
  onOpenDownloadPage?: () => void
  isOnline: boolean
  isStandalone: boolean
  onPromptInstall: () => void
  isInstallable: boolean
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile: propProfile,
  onOpenSyncStatus,
  onOpenAuth,
  onOpenDownloadPage,
  isOnline,
  isStandalone,
  onPromptInstall,
  isInstallable
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => propProfile || {
    name: 'Anissa Alifia',
    email: 'anissa@example.com',
    isLoggedIn: false
  })

  // Sinkronisasi data saat prop berubah
  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile)
    }
  }, [propProfile])

  // Muat dari IndexedDB / localStorage saat pertama kali mount & dengarkan event update profil
  useEffect(() => {
    getUserProfile().then((p) => {
      if (p) setProfile(p)
    })

    const handleProfileUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>
      if (customEvent.detail) {
        setProfile(customEvent.detail)
      } else {
        getUserProfile().then((p) => {
          if (p) setProfile(p)
        })
      }
    }

    window.addEventListener('parkpin:profile_updated', handleProfileUpdated)
    return () => window.removeEventListener('parkpin:profile_updated', handleProfileUpdated)
  }, [])

  const currentProfile = propProfile || profile

  const getInitials = (name: string) => {
    const trimmed = (name || '').trim()
    if (!trimmed) return 'PP'
    const parts = trimmed.split(/\s+/)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return trimmed.substring(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-4 pb-6">
      {/* User Profile Card (Gaya Modern iOS / Grab / Tokopedia) */}
      <div
        onClick={onOpenAuth}
        className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle flex items-center justify-between gap-4 cursor-pointer active:scale-[0.99] transition-all hover:border-parkpin-mutedTeal/40 group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-parkpin-deepTeal to-parkpin-darkTeal text-parkpin-warmIvory flex items-center justify-center font-extrabold text-base shadow-md">
              {getInitials(currentProfile.name)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border border-parkpin-border flex items-center justify-center text-parkpin-deepTeal shadow-xs">
              <Edit3 className="w-2.5 h-2.5 text-parkpin-mutedTeal" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-parkpin-darkTeal truncate">
                {currentProfile.name}
              </h3>
              {currentProfile.isLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Aktif" />
              )}
            </div>
            <p className="text-xs text-parkpin-subtext mt-0.5 truncate font-medium">
              {currentProfile.email || 'Pengemudi ParkPin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 bg-parkpin-warmIvory text-parkpin-deepTeal text-xs font-bold rounded-xl border border-parkpin-border group-hover:bg-parkpin-border/40 transition-colors shrink-0 shadow-subtle">
          <span>Edit</span>
          <ChevronRight className="w-4 h-4 text-parkpin-mutedTeal" />
        </div>
      </div>

      {/* Cloud Sync & Offline HUD Action Card */}
      <div
        onClick={onOpenSyncStatus}
        className="bg-parkpin-deepTeal text-parkpin-warmIvory rounded-3xl p-5 shadow-card cursor-pointer active:scale-[0.99] transition-transform flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Cloud className="w-6 h-6 text-parkpin-softSand" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">Status Cloud & Memori Offline</span>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>
            <p className="text-xs text-parkpin-warmIvory/70 mt-0.5 leading-relaxed">
              {isOnline ? 'Online · Sinkronisasi Cloud Siap' : 'Offline · Data Tersimpan Aman di HP'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-parkpin-softSand/80 shrink-0 ml-2" />
      </div>

      {/* PWA Standalone Mode Indicator or Install Banner */}
      {isStandalone ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center gap-3.5 text-xs text-emerald-900 shadow-subtle">
          <Smartphone className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="text-xs font-medium leading-relaxed">
            Berjalan dalam <span className="font-bold">Mode Aplikasi Mandiri (Standalone PWA)</span>.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-parkpin-softSage/40 flex items-center justify-center text-parkpin-deepTeal shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-parkpin-darkTeal">Pasang Aplikasi ParkPin</p>
              <p className="text-[11px] text-parkpin-subtext mt-0.5">Tambahkan ke Layar Utama untuk akses instan</p>
            </div>
          </div>
          <button
            onClick={onPromptInstall}
            className="px-4 py-2 bg-parkpin-deepTeal text-parkpin-warmIvory text-xs font-bold rounded-xl shadow-sm active:scale-95 transition-transform shrink-0"
          >
            Install
          </button>
        </div>
      )}

      {/* Halaman Download & Panduan Rilis (seperti Harsta) */}
      {onOpenDownloadPage && (
        <div
          onClick={onOpenDownloadPage}
          className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle flex items-center justify-between cursor-pointer active:bg-parkpin-warmIvory/50 transition-colors group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-parkpin-softSage/40 flex items-center justify-center text-parkpin-deepTeal shrink-0">
              <Download className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-parkpin-darkTeal">Halaman Download Resmi</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  v1.0.0
                </span>
              </div>
              <p className="text-[11px] text-parkpin-subtext mt-0.5">
                Info paket rilis, panduan pasang, & file pintasan
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-parkpin-subtext shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}

      {/* Keamanan & Penyimpanan (Desain Proporsional & Rapi) */}
      <div className="bg-white rounded-3xl p-5 border border-parkpin-border shadow-subtle space-y-4">
        <span className="text-[11px] font-bold text-parkpin-subtext uppercase tracking-wider block">
          Keamanan & Pengaturan Offline
        </span>

        <div className="divide-y divide-parkpin-border/60">
          {/* Row 1 */}
          <div className="flex items-center justify-between py-3.5 first:pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-parkpin-softSage/50 text-parkpin-deepTeal flex items-center justify-center shrink-0 shadow-inner">
                <Database className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-parkpin-darkTeal">Penyimpanan Offline</p>
                <p className="text-[11px] text-parkpin-subtext mt-0.5">Semua data tersimpan aman di memori HP</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shrink-0">
              Aktif & Aman
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-parkpin-softSage/50 text-parkpin-deepTeal flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-parkpin-darkTeal">Akses Basement & Bawah Tanah</p>
                <p className="text-[11px] text-parkpin-subtext mt-0.5">Bisa digunakan penuh tanpa sinyal internet</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-parkpin-warmIvory text-parkpin-darkTeal rounded-full border border-parkpin-border shrink-0">
              100% Offline
            </span>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between py-3.5 last:pb-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-parkpin-softSage/50 text-parkpin-deepTeal flex items-center justify-center shrink-0 shadow-inner">
                <Bell className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-parkpin-darkTeal">Pengingat Waktu Parkir</p>
                <p className="text-[11px] text-parkpin-subtext mt-0.5">Peringatan sebelum tarif bertambah jam</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-parkpin-warmIvory text-parkpin-darkTeal rounded-full border border-parkpin-border shrink-0">
              15 Menit Sebelum
            </span>
          </div>
        </div>
      </div>

      {/* App Branding Footer */}
      <div className="pt-4 text-center text-xs space-y-1">
        <p className="font-semibold text-parkpin-darkTeal">ParkPin v1.0.0</p>
        <p className="text-[11px] text-parkpin-subtext font-medium">
          Developed by <span className="font-semibold text-parkpin-darkTeal">saaproject</span>
        </p>
      </div>
    </div>
  )
}
