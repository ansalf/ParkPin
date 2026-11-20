import React, { useState, useEffect } from 'react'
import {
  getActiveParkingRecord,
  getParkingHistory,
  getParkingRecordById,
  saveParkingRecord,
  archiveParkingRecord,
  deleteParkingRecord,
  getUserProfile,
  ParkingRecord,
  UserProfile
} from './services/db'
import { processSyncQueue } from './services/supabase'
import { usePWA } from './hooks/usePWA'
import { TopBar } from './components/Navigation/TopBar'
import { BottomNav, TabType } from './components/Navigation/BottomNav'
import { HomeScreen } from './pages/HomeScreen'
import { SaveSpotScreen } from './pages/SaveSpotScreen'
import { FindVehicleScreen } from './pages/FindVehicleScreen'
import { HistoryScreen } from './pages/HistoryScreen'
import { RecordDetailScreen } from './pages/RecordDetailScreen'
import { SettingsScreen } from './pages/SettingsScreen'
import { SyncStatusScreen } from './pages/SyncStatusScreen'
import { DownloadPage } from './pages/DownloadPage'
import { ArchiveModal } from './components/Modals/ArchiveModal'
import { GPSPermissionModal } from './components/Modals/GPSPermissionModal'
import { AuthModal } from './components/Modals/AuthModal'
import { PWAInstallDrawer } from './components/Modals/PWAInstallDrawer'
import { Smartphone, Download } from 'lucide-react'

type ScreenView =
  | 'home'
  | 'save_spot'
  | 'find_vehicle'
  | 'record_detail'
  | 'sync_status'
  | 'download'

export function App() {
  const { isInstallable, isStandalone, isIOS, isOnline, promptInstall } = usePWA()

  // App Navigation States
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/download')) {
      return 'download'
    }
    return 'home'
  })

  // Listen to browser popstate (back / forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/download')) {
        setCurrentScreen('download')
      } else {
        setCurrentScreen('home')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Data States
  const [activeRecord, setActiveRecord] = useState<ParkingRecord | null>(null)
  const [historyRecords, setHistoryRecords] = useState<ParkingRecord[]>([])
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<ParkingRecord | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Modal States
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [isGPSModalOpen, setIsGPSModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isPWAInstallDrawerOpen, setIsPWAInstallDrawerOpen] = useState(false)

  // Load records from IndexedDB
  const reloadData = async () => {
    try {
      const active = await getActiveParkingRecord()
      setActiveRecord(active || null)
      const past = await getParkingHistory()
      setHistoryRecords(past)

      const prof = await getUserProfile()
      setUserProfile(prof)

      if (selectedRecordId) {
        const item = await getParkingRecordById(selectedRecordId)
        setSelectedRecord(item || null)
      }
    } catch (err) {
      console.error('Error loading data from IndexedDB:', err)
    }
  }

  useEffect(() => {
    reloadData()
  }, [selectedRecordId])

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline) {
      processSyncQueue().then(() => reloadData())
    }
  }, [isOnline])

  // Listen for instant profile updates
  useEffect(() => {
    const handleProfileEvent = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>
      if (customEvent.detail) {
        setUserProfile(customEvent.detail)
      } else {
        reloadData()
      }
    }
    window.addEventListener('parkpin:profile_updated', handleProfileEvent)
    return () => window.removeEventListener('parkpin:profile_updated', handleProfileEvent)
  }, [])

  // Handle Tab Navigation (Berlaku global di semua halaman)
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSelectedRecordId(null)
    setSelectedRecord(null)
    setCurrentScreen('home')
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/download')) {
      window.history.pushState(null, '', '/')
    }
  }

  // Handle Saving New Spot
  const handleSaveSpot = async (record: ParkingRecord) => {
    await saveParkingRecord(record)
    await reloadData()
    setCurrentScreen('home')
    setActiveTab('home')
  }

  // Handle Archiving / Ending Parking
  const handleConfirmArchive = async () => {
    if (!activeRecord) return
    await archiveParkingRecord(activeRecord.id)
    setIsArchiveModalOpen(false)
    await reloadData()
    setCurrentScreen('home')
  }

  // Handle Deleting Record
  const handleDeleteRecord = async (id: string) => {
    await deleteParkingRecord(id)
    await reloadData()
  }

  // Determine TopBar Configuration
  const getTopBarProps = () => {
    if (currentScreen === 'save_spot') {
      return {
        title: 'Simpan Titik Parkir',
        onBack: () => setCurrentScreen('home'),
        backLabel: 'Batal'
      }
    }
    if (currentScreen === 'find_vehicle' && activeRecord) {
      return {
        title: 'Cari Kendaraan Saya',
        onBack: () => setCurrentScreen('home'),
        backLabel: 'Kembali'
      }
    }
    if (currentScreen === 'record_detail') {
      return {
        title: 'Detail Catatan Parkir',
        onBack: () => {
          setSelectedRecordId(null)
          setSelectedRecord(null)
          setCurrentScreen('home')
        },
        backLabel: 'Kembali'
      }
    }
    if (currentScreen === 'sync_status') {
      return {
        title: 'Status Memori & Cloud',
        onBack: () => setCurrentScreen('home'),
        backLabel: 'Kembali'
      }
    }

    // Default Main Screens (by activeTab)
    if (activeTab === 'history') {
      return {
        title: 'Riwayat Parkir',
        showBrand: false
      }
    }
    if (activeTab === 'settings') {
      return {
        title: 'Pengaturan & Akun',
        showBrand: false
      }
    }

    // Home Screen
    return {
      showBrand: true,
      rightAction: !isStandalone && (
        <button
          onClick={() => {
            if (isInstallable) {
              promptInstall().then((accepted) => {
                if (!accepted) setIsPWAInstallDrawerOpen(true)
              })
            } else {
              setIsPWAInstallDrawerOpen(true)
            }
          }}
          className="px-3 py-1.5 bg-parkpin-deepTeal text-parkpin-warmIvory text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
          title="Install / Pasang Aplikasi ke Layar Utama"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      )
    }
  }

  // Render Full-Width Download Page (seperti harstasetup.vercel.app/download)
  if (currentScreen === 'download') {
    return (
      <DownloadPage
        onOpenApp={() => {
          window.history.pushState(null, '', '/')
          setCurrentScreen('home')
        }}
        onPromptInstall={promptInstall}
        isInstallable={isInstallable}
        isStandalone={isStandalone}
        isIOS={isIOS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasActiveSession={Boolean(activeRecord)}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-parkpin-warmIvory flex flex-col relative shadow-2xl">
      {/* Top Header Bar */}
      <TopBar
        {...getTopBarProps()}
        isOnline={isOnline}
        onHome={() => {
          setActiveTab('home')
          setSelectedRecordId(null)
          setSelectedRecord(null)
          setCurrentScreen('home')
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 px-5 pt-3 pb-28">
        {/* Save Spot Screen */}
        {currentScreen === 'save_spot' && (
          <SaveSpotScreen
            onSave={handleSaveSpot}
            onCancel={() => setCurrentScreen('home')}
            isOnline={isOnline}
          />
        )}

        {/* Find Vehicle Screen */}
        {currentScreen === 'find_vehicle' && activeRecord && (
          <FindVehicleScreen
            record={activeRecord}
            onFoundVehicle={() => setIsArchiveModalOpen(true)}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* Record Detail Screen */}
        {currentScreen === 'record_detail' && selectedRecord && (
          <RecordDetailScreen
            record={selectedRecord}
            onBack={() => {
              setSelectedRecordId(null)
              setSelectedRecord(null)
              setCurrentScreen('home')
            }}
            onDelete={handleDeleteRecord}
          />
        )}

        {/* Sync Status Screen */}
        {currentScreen === 'sync_status' && (
          <SyncStatusScreen
            onBack={() => setCurrentScreen('home')}
            isOnline={isOnline}
          />
        )}

        {/* Tab 1: Home View */}
        {currentScreen === 'home' && activeTab === 'home' && (
          <HomeScreen
            activeRecord={activeRecord}
            recentHistory={historyRecords}
            onSaveNewSpot={() => setCurrentScreen('save_spot')}
            onFindVehicle={() => setCurrentScreen('find_vehicle')}
            onEndParking={() => setIsArchiveModalOpen(true)}
            onViewRecordDetail={(id) => {
              setSelectedRecordId(id)
              setCurrentScreen('record_detail')
            }}
            onReloadData={reloadData}
            isOnline={isOnline}
          />
        )}

        {/* Tab 2: History View */}
        {currentScreen === 'home' && activeTab === 'history' && (
          <HistoryScreen
            history={historyRecords}
            activeRecord={activeRecord}
            onSelectRecord={(id) => {
              setSelectedRecordId(id)
              setCurrentScreen('record_detail')
            }}
            onSaveNewSpot={() => {
              setActiveTab('home')
              setCurrentScreen('save_spot')
            }}
          />
        )}

        {/* Tab 3: Settings View */}
        {currentScreen === 'home' && activeTab === 'settings' && (
          <SettingsScreen
            profile={userProfile || undefined}
            onOpenSyncStatus={() => setCurrentScreen('sync_status')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenDownloadPage={() => {
              window.history.pushState(null, '', '/download')
              setCurrentScreen('download')
            }}
            isOnline={isOnline}
            isStandalone={isStandalone}
            onPromptInstall={() => setIsPWAInstallDrawerOpen(true)}
            isInstallable={isInstallable}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Dipertahankan di semua halaman untuk kemudahan navigasi) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasActiveSession={Boolean(activeRecord)}
      />

      {/* Modal Dialogs & Sheets */}
      <ArchiveModal
        isOpen={isArchiveModalOpen}
        record={activeRecord}
        onConfirm={handleConfirmArchive}
        onCancel={() => setIsArchiveModalOpen(false)}
      />

      <GPSPermissionModal
        isOpen={isGPSModalOpen}
        onRetry={() => setIsGPSModalOpen(false)}
        onManualInput={() => setIsGPSModalOpen(false)}
        onClose={() => setIsGPSModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialProfile={userProfile}
        onSuccess={(updated) => {
          if (updated) setUserProfile(updated)
          reloadData()
        }}
      />

      <PWAInstallDrawer
        isOpen={isPWAInstallDrawerOpen}
        onClose={() => setIsPWAInstallDrawerOpen(false)}
        isIOS={isIOS}
        onInstallAndroid={promptInstall}
      />
    </div>
  )
}
