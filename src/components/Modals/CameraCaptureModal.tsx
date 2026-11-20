import React, { useState, useEffect, useRef } from 'react'
import { Camera, X, RefreshCw, Check, Image, SwitchCamera } from 'lucide-react'

interface CameraCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (photoBase64: string) => void
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileFallbackRef = useRef<HTMLInputElement>(null)

  // Start camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setIsLoading(true)
    setCameraError(null)

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera langsung.')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err: any) {
      console.warn('getUserMedia error:', err)
      setCameraError(
        err.message || 'Tidak dapat mengakses kamera. Pastikan izin kamera browser telah diaktifkan.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode)
    } else if (!isOpen) {
      // Clean up stream on modal close
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
      setCapturedImage(null)
      setCameraError(null)
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen, facingMode])

  if (!isOpen) return null

  // Capture current frame from video to canvas
  const handleSnapPhoto = () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Mirror if front camera
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      setCapturedImage(dataUrl)

      // Pause live stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    startCamera(facingMode)
  }

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      onClose()
    }
  }

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextMode)
    startCamera(nextMode)
  }

  const handleFallbackFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onCapture(reader.result)
        onClose()
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-2 sm:p-4">
      {/* Hidden file input fallback */}
      <input
        ref={fileFallbackRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFallbackFileSelect}
        className="hidden"
      />

      <div className="relative w-full max-w-md h-[88vh] max-h-[640px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10">
        {/* Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5 text-parkpin-softSand" />
            <span className="font-bold text-sm tracking-wide">Kamera Patokan Parkir</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Review Captured Photo */
            <img
              src={capturedImage}
              alt="Hasil Jepretan"
              className="w-full h-full object-cover"
            />
          ) : cameraError ? (
            /* Camera Permission Error / Fallback Card */
            <div className="p-6 text-center text-white space-y-4 max-w-xs">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-amber-400">
                <Camera className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div>
                <p className="font-bold text-sm">Akses Kamera Langsung Ditolak</p>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  {cameraError}
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileFallbackRef.current?.click()}
                className="w-full py-3 bg-white text-parkpin-darkTeal font-bold rounded-2xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Image className="w-4 h-4" />
                <span>Buka Kamera / Galeri HP</span>
              </button>
            </div>
          ) : (
            /* Live Video Stream Viewfinder */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Reticle Frame */}
              <div className="absolute inset-8 pointer-events-none border-2 border-white/30 rounded-2xl flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 bg-black/50 text-white/90 text-[10px] font-semibold rounded-full backdrop-blur-sm">
                    Arahkan ke pilar, nomor slot, atau lift
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
                </div>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-parkpin-softSand" />
                  <span>Membuka sensor kamera...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Shutter / Action Controls Footer */}
        <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around">
          {capturedImage ? (
            /* Review Actions */
            <div className="w-full flex gap-3 px-2">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs active:scale-95 transition-transform flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Foto Ulang</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Gunakan Foto Ini</span>
              </button>
            </div>
          ) : (
            /* Live Camera Controls */
            <div className="w-full flex items-center justify-between px-6">
              {/* Gallery / File Picker */}
              <button
                type="button"
                onClick={() => fileFallbackRef.current?.click()}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
                title="Pilih dari Galeri"
              >
                <Image className="w-5 h-5 text-white/90" />
                <span className="text-[8px] font-medium text-white/70">Galeri</span>
              </button>

              {/* Big Circular Camera Shutter Button */}
              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={isLoading || Boolean(cameraError)}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition-transform disabled:opacity-50"
              >
                <div className="w-full h-full bg-white rounded-full active:bg-gray-300 transition-colors shadow-inner" />
              </button>

              {/* Switch Camera (Front/Rear) */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                disabled={isLoading || Boolean(cameraError)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform disabled:opacity-50"
                title="Putar Kamera"
              >
                <SwitchCamera className="w-5 h-5 text-white/90" />
                <span className="text-[8px] font-medium text-white/70">Putar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
