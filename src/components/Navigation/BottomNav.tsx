import React from 'react'
import { MapPin, History, Settings } from 'lucide-react'

export type TabType = 'home' | 'history' | 'settings'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  hasActiveSession?: boolean
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, hasActiveSession }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t sm:border-x sm:rounded-t-3xl border-parkpin-border/80 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(36,59,61,0.08)] select-none">
      <div className="flex items-center justify-around h-16 px-3">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 touch-manipulation cursor-pointer group"
        >
          <div
            className={`relative px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'home'
                ? 'bg-parkpin-softSage/60 text-parkpin-deepTeal'
                : 'text-parkpin-subtext group-hover:text-parkpin-deepTeal'
            }`}
          >
            <MapPin className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {hasActiveSession && (
              <span className="absolute top-0.5 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span
            className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
              activeTab === 'home'
                ? 'font-bold text-parkpin-deepTeal'
                : 'font-medium text-parkpin-subtext group-hover:text-parkpin-deepTeal'
            }`}
          >
            Beranda
          </span>
        </button>

        {/* Tab 2: History */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 touch-manipulation cursor-pointer group"
        >
          <div
            className={`relative px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'history'
                ? 'bg-parkpin-softSage/60 text-parkpin-deepTeal'
                : 'text-parkpin-subtext group-hover:text-parkpin-deepTeal'
            }`}
          >
            <History className={`w-5 h-5 ${activeTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span
            className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
              activeTab === 'history'
                ? 'font-bold text-parkpin-deepTeal'
                : 'font-medium text-parkpin-subtext group-hover:text-parkpin-deepTeal'
            }`}
          >
            Riwayat
          </span>
        </button>

        {/* Tab 3: Settings */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 touch-manipulation cursor-pointer group"
        >
          <div
            className={`relative px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'settings'
                ? 'bg-parkpin-softSage/60 text-parkpin-deepTeal'
                : 'text-parkpin-subtext group-hover:text-parkpin-deepTeal'
            }`}
          >
            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span
            className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
              activeTab === 'settings'
                ? 'font-bold text-parkpin-deepTeal'
                : 'font-medium text-parkpin-subtext group-hover:text-parkpin-deepTeal'
            }`}
          >
            Pengaturan
          </span>
        </button>
      </div>
    </nav>
  )
}
