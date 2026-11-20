import { useState, useEffect, useCallback } from 'react'
import { GPSLocation } from '../services/db'

export function useLocation() {
  const [location, setLocation] = useState<GPSLocation | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Request current position with graceful fallbacks (High Accuracy -> Normal -> IP-based)
  const getCurrentLocation = useCallback(async (): Promise<GPSLocation | null> => {
    setIsLocating(true)
    setError(null)
    setPermissionDenied(false)

    // Helper function to query browser geolocation
    const queryBrowserGeo = (highAccuracy: boolean, timeoutMs: number): Promise<GPSLocation | null> => {
      if (!navigator.geolocation) return Promise.resolve(null)
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              altitude: pos.coords.altitude || undefined,
              heading: pos.coords.heading || undefined
            })
          },
          () => resolve(null),
          {
            enableHighAccuracy: highAccuracy,
            timeout: timeoutMs,
            maximumAge: 30000
          }
        )
      })
    }

    // Step 1: Try high accuracy (works on real phones with GPS chips)
    let loc = await queryBrowserGeo(true, 4000)

    // Step 2: Fallback to normal Wi-Fi/Cellular geolocation (works on laptops/desktops)
    if (!loc) {
      loc = await queryBrowserGeo(false, 4000)
    }

    // Step 3: Fallback to IP-based approximate location if browser/OS blocked native GPS
    if (!loc) {
      try {
        const res = await fetch('https://ipwho.is/', {
          signal: AbortSignal.timeout(3500)
        })
        if (res.ok) {
          const data = await res.json()
          if (data && data.success !== false && data.latitude && data.longitude) {
            loc = {
              latitude: Number(data.latitude),
              longitude: Number(data.longitude),
              accuracy: 2000 // Approximate city/network accuracy
            }
          }
        }
      } catch {
        // IP fallback silent catch
      }
    }

    setIsLocating(false)

    if (loc) {
      setLocation(loc)
      return loc
    } else {
      setPermissionDenied(true)
      setError('Izin lokasi browser tidak aktif atau perangkat tidak memiliki sensor GPS.')
      return null
    }
  }, [])

  // Listen to compass orientation if supported
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let currentHeading: number | null = null
      if ((e as any).webkitCompassHeading) {
        currentHeading = (e as any).webkitCompassHeading
      } else if (e.alpha !== null) {
        currentHeading = 360 - e.alpha
      }

      if (currentHeading !== null) {
        setHeading(Math.round(currentHeading))
      }
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true)
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true)
      }
    }
  }, [])

  return {
    location,
    heading,
    error,
    isLocating,
    permissionDenied,
    getCurrentLocation
  }
}
