import React from 'react'
import { ChevronLeft, RefreshCw } from 'lucide-react'

interface TopBarProps {
  title?: string
  showBrand?: boolean
  onBack?: () => void
  backLabel?: string
  rightAction?: React.ReactNode
  isOnline?: boolean
  onHome?: () => void
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBrand = false,
  onBack,
  backLabel = 'Back',
  rightAction,
  isOnline = true,
  onHome
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-30 bg-parkpin-warmIvory/95 backdrop-blur-md pt-[calc(env(safe-area-inset-top)+0.625rem)] pb-2.5 px-4 sm:px-5 border-b border-parkpin-border/60 transition-colors">
      <div className="flex items-center justify-between h-10 relative">
        {/* Left: Back button or Brand logo */}
        <div className="flex items-center z-10">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-parkpin-deepTeal text-sm font-semibold active:scale-95 transition-all py-1.5 pr-2.5 rounded-xl hover:bg-parkpin-border/30 -ml-1"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              <span>{backLabel}</span>
            </button>
          ) : showBrand ? (
            <button
              type="button"
              onClick={onHome}
              className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform text-left py-1"
              title="Kembali ke Beranda"
              aria-label="Kembali ke Beranda"
            >
              <div className="w-7 h-7 rounded-full bg-parkpin-deepTeal flex items-center justify-center text-parkpin-warmIvory font-black text-xs shadow-sm group-hover:bg-parkpin-darkTeal transition-colors">
                P
              </div>
              <span className="font-extrabold text-lg text-parkpin-deepTeal tracking-tight group-hover:text-parkpin-darkTeal transition-colors">
                ParkPin
              </span>
            </button>
          ) : onHome ? (
            <button
              type="button"
              onClick={onHome}
              className="flex items-center gap-1 text-parkpin-deepTeal active:scale-95 transition-transform cursor-pointer p-1"
              title="Kembali ke Beranda"
              aria-label="Kembali ke Beranda"
            >
              <div className="w-7 h-7 rounded-full bg-parkpin-deepTeal flex items-center justify-center text-parkpin-warmIvory font-black text-xs shadow-sm hover:bg-parkpin-darkTeal transition-colors">
                P
              </div>
            </button>
          ) : (
            <div className="w-7" />
          )}
        </div>

        {/* Center: Title (centered across viewport with safe margin) */}
        {title && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-16">
            <h1 className="text-sm font-bold text-parkpin-darkTeal truncate tracking-tight text-center">
              {title}
            </h1>
          </div>
        )}

        {/* Right: Actions or Network status */}
        <div className="flex items-center gap-2 z-10">
          {!isOnline && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
              Offline
            </span>
          )}
          {rightAction ? (
            rightAction
          ) : (
            <div className="w-7" />
          )}
        </div>
      </div>
    </header>
  )
}
