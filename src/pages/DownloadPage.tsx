import React, { useState } from 'react'
import {
  Download,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Camera,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  WifiOff,
  Car,
  Bike,
  Sparkles,
  Share2,
  PlusSquare,
  Check,
  ChevronDown,
  Monitor,
  ChevronLeft
} from 'lucide-react'
import { BottomNav, TabType } from '../components/Navigation/BottomNav'

interface DownloadPageProps {
  onOpenApp: () => void
  onPromptInstall: () => Promise<boolean>
  isInstallable: boolean
  isStandalone: boolean
  isIOS: boolean
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
  hasActiveSession?: boolean
}

export const DownloadPage: React.FC<DownloadPageProps> = ({
  onOpenApp,
  onPromptInstall,
  isInstallable,
  isStandalone,
  isIOS,
  activeTab = 'home',
  onTabChange,
  hasActiveSession = false
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Handle direct PWA install
  const handleInstallClick = async () => {
    if (isInstallable) {
      await onPromptInstall()
    } else {
      // If iOS or already installed or browser blocked, trigger smooth scroll to guide
      const el = document.getElementById('panduan-instalasi')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Handle direct standalone shortcut file download (mirrors Harsta executable download experience)
  const handleDownloadLauncher = () => {
    const launcherHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Membuka ParkPin...</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #F5F3EE; color: #1A2C2E; text-align: center; }
    .card { background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 320px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🅿️ ParkPin Indonesia</h2>
    <p>Mengalihkan Anda ke aplikasi ParkPin...</p>
  </div>
  <script>
    window.location.href = window.location.origin || 'http://localhost:5173/';
  </script>
</body>
</html>`
    const blob = new Blob([launcherHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ParkPin-Offline-Launcher.html'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 4000)
  }

  const faqs = [
    {
      q: 'Apakah ParkPin berbayar atau ada biaya langganan?',
      a: 'ParkPin 100% gratis. Tidak ada iklan, tidak ada biaya langganan, dan tidak ada fitur tersembunyi berbayar.'
    },
    {
      q: 'Apakah harus download dari Google Play Store atau Apple App Store?',
      a: 'Tidak perlu. ParkPin menggunakan standar Progressive Web App (PWA) resmi. Aplikasi dapat dipasang langsung ke layar utama ponsel melalui browser Anda dalam hitungan detik tanpa memakan kuota besar (kurang dari 1 MB).'
    },
    {
      q: 'Apakah aplikasi bisa mengingat lokasi saat di basement tanpa sinyal internet?',
      a: 'Tentu saja. ParkPin dirancang dengan prinsip Offline-First. Seluruh data lantai, kode pilar, catatan karcis, dan foto patokan tersimpan langsung di memori HP Anda sehingga selalu dapat diakses di lantai bawah tanah terdalam.'
    },
    {
      q: 'Bagaimana cara memasang ParkPin di iPhone?',
      a: 'Buka ParkPin di browser Safari, tekan tombol Share (ikon kotak dengan panah ke atas) di bilah bawah, lalu pilih menu "Add to Home Screen" (Tambahkan ke Layar Utama).'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#1A2C2E] flex flex-col font-sans selection:bg-[#243B3D] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#F5F3EE]/95 backdrop-blur-md border-b border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Tombol Back */}
            <button
              onClick={onOpenApp}
              className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E1D8] text-[#243B3D] font-bold text-xs sm:text-sm shadow-subtle hover:bg-[#EAE7DF] active:scale-95 transition-all"
              aria-label="Kembali ke Aplikasi ParkPin"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Kembali</span>
            </button>

            {/* Brand Logo - Round & Clickable to Home */}
            <button
              type="button"
              onClick={onOpenApp}
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform text-left"
              title="Kembali ke Beranda"
              aria-label="Kembali ke Beranda"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#243B3D] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-sm hover:bg-[#1A2C2E] transition-colors">
                P
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-base sm:text-lg text-[#243B3D] tracking-tight">ParkPin</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full ml-1.5 sm:ml-2 border border-emerald-300">
                  v1.0.0
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenApp}
              className="px-3 sm:px-4 py-2 bg-[#243B3D] text-[#F5F3EE] text-xs font-bold rounded-xl shadow-sm hover:bg-[#1A2C2E] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Buka Aplikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* ================= HERO DOWNLOAD CARD ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E1D8] shadow-card relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            {/* Left Info Column */}
            <div className="space-y-4 max-w-xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Official Stable Release
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F3EE] text-[#243B3D] border border-[#E5E1D8]">
                  Android · iOS · Desktop
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Diperbarui 12 Nov 2026
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A2C2E] tracking-tight">
                  Download ParkPin 1.0.0
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                  Aplikasi pengingat titik parkir kendaraan di gedung, mall, dan lapangan terbuka di Indonesia. 100% berfungsi offline di basement bawah tanah, tanpa kuota, dan bebas iklan.
                </p>
              </div>

              {/* Technical Architecture Specs */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#243B3D]" />
                  <span>Platform: <strong>Universal Mobile</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#243B3D]" />
                  <span>Paket: <strong>ParkPin.pwa</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#243B3D]" />
                  <span>Ukuran: <strong>&lt; 1 MB (Instan)</strong></span>
                </div>
              </div>
            </div>

            {/* Right Action Column */}
            <div className="flex flex-col gap-3 min-w-[280px] sm:min-w-[320px]">
              {isStandalone ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Aplikasi Sudah Terpasang!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Anda sudah menjalankan ParkPin dalam mode aplikasi mandiri.
                  </p>
                  <button
                    onClick={onOpenApp}
                    className="w-full btn-primary text-sm mt-2"
                  >
                    Buka Aplikasi Sekarang →
                  </button>
                </div>
              ) : (
                <>
                  {/* Primary Download / Install Button (56px) */}
                  <button
                    onClick={handleInstallClick}
                    className="w-full btn-primary shadow-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    <span>
                      {isInstallable
                        ? 'Pasang ke Ponsel Sekarang'
                        : isIOS
                        ? 'Pasang di iPhone (Panduan)'
                        : 'Pasang Aplikasi ParkPin'}
                    </span>
                  </button>

                  {/* Secondary Launcher Download */}
                  <button
                    onClick={handleDownloadLauncher}
                    className="w-full btn-secondary text-xs"
                  >
                    <Smartphone className="w-4 h-4 text-[#243B3D] mr-2" />
                    <span>Download Pintasan Offline (.html)</span>
                  </button>

                  {downloadSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pintasan ParkPin berhasil diunduh ke folder Downloads!</span>
                    </div>
                  )}

                  <p className="text-[11px] text-center text-gray-500 mt-1">
                    Langsung terpasang ke Layar Utama tanpa perlu registrasi akun.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ================= PANDUAN PEMASANGAN (STEP BY STEP) ================= */}
        <section id="panduan-instalasi" className="space-y-6">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#243B3D]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2C2E]">
              Panduan Pemasangan Cepat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-subtle space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#243B3D] text-white flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="font-bold text-base text-[#1A2C2E]">
                Buka di Browser Ponsel
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Akses alamat website ParkPin menggunakan peramban favorit Anda (Safari untuk iPhone, Chrome untuk Android).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-subtle space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#243B3D] text-white flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="font-bold text-base text-[#1A2C2E]">
                Tambahkan ke Layar Utama
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Di iPhone: Tekan tombol <strong>Share</strong> lalu pilih <strong>"Add to Home Screen"</strong>. Di Android: Tekan tombol <strong>"Pasang"</strong> yang muncul di layar.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D8] shadow-subtle space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="font-bold text-base text-[#1A2C2E]">
                Siap Digunakan 100% Offline
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ikon ParkPin akan muncul di beranda HP Anda. Membuka layar penuh seperti aplikasi native dan siap dipakai di basement gedung tanpa internet.
              </p>
            </div>
          </div>
        </section>

        {/* ================= RELEASE HIGHLIGHTS (FITUR UTAMA v1.0.0) ================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#243B3D]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2C2E]">
              Fitur Unggulan ParkPin Indonesia
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#243B3D]/10 text-[#243B3D] flex items-center justify-center font-bold">
                🏢
              </div>
              <h4 className="font-bold text-sm text-[#1A2C2E]">Preset Lantai Mall & Gedung</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mendukung kode lantai mall Indonesia: B3, B2, B1, GF, P1–P3, Rooftop, serta area parkir ruko & outdoor.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#243B3D]/10 text-[#243B3D] flex items-center justify-center font-bold">
                📍
              </div>
              <h4 className="font-bold text-sm text-[#1A2C2E]">Kode Pilar & Patokan Pintu Lobi</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Catat kode tiang (misal Pilar B12) dan pintu lift/lobi terdekat agar Anda tidak tersesat saat keluar dari mall.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#243B3D]/10 text-[#243B3D] flex items-center justify-center font-bold">
                🧭
              </div>
              <h4 className="font-bold text-sm text-[#1A2C2E]">Kompas Pejalan Kaki & Elevasi</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Petunjuk arah mata angin cerdas serta panduan naik/turun lantai menuju kendaraan Anda.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#243B3D]/10 text-[#243B3D] flex items-center justify-center font-bold">
                📸
              </div>
              <h4 className="font-bold text-sm text-[#1A2C2E]">Kamera Foto Patokan Langsung</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Buka viewfinder kamera instan untuk mengambil foto nomor pilar atau rambu lantai tanpa ribet.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#243B3D]/10 text-[#243B3D] flex items-center justify-center font-bold">
                🛵
              </div>
              <h4 className="font-bold text-sm text-[#1A2C2E]">Pilihan Mobil vs Motor</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pengaturan khusus pengendara motor (lantai B1/GF, baris parkir) dan pengendara mobil.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#243B3D]/10 text-[#243B3D] flex items-center justify-center font-bold">
                🛡️
              </div>
              <h4 className="font-bold text-sm text-[#1A2C2E]">100% Offline & Privat</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Semua titik lokasi dan foto aman tersimpan di memori ponsel Anda tanpa perlu kuota internet.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#243B3D]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2C2E]">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-subtle"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#1A2C2E] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-5 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="bg-[#243B3D] text-[#F5F3EE] rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mulai Ingat Lokasi Parkir Anda Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F3EE]/80 max-w-lg mx-auto leading-relaxed">
            Tidak ada lagi momen panik atau berputar-putar mencari mobil dan motor di basement mall. Pasang ParkPin sekarang juga.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto px-8 py-4 bg-[#F5F3EE] text-[#243B3D] font-extrabold text-sm rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Pasang Aplikasi ke Ponsel</span>
            </button>
            <button
              onClick={onOpenApp}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 active:scale-95 transition-all"
            >
              Buka Aplikasi di Web →
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E1D8] py-8 text-center text-xs text-gray-500 space-y-1 pb-28">
        <p className="font-bold text-[#243B3D] tracking-tight">ParkPin v1.0.0</p>
        <p className="text-[11px] text-gray-500 font-medium">
          Developed by <span className="font-bold text-[#243B3D]">saaproject</span>
        </p>
      </footer>

      {/* Bottom Navigation Bar (Tetap tampil di semua halaman) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (onTabChange) {
            onTabChange(tab)
          } else {
            onOpenApp()
          }
        }}
        hasActiveSession={hasActiveSession}
      />
    </div>
  )
}
