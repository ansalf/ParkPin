import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Workbox Service Worker for offline PWA functionality
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, reload to update.')
  },
  onOfflineReady() {
    console.log('ParkPin is cached and ready to operate offline.')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
