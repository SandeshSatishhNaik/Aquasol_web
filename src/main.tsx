import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Media (the hero video first) comes from the R2 bucket when one is configured: open that
// connection now, alongside the app, rather than when the first <video> asks for it.
const mediaBase = import.meta.env.VITE_MEDIA_BASE as string | undefined
if (mediaBase) {
  try {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = new URL(mediaBase).origin
    document.head.appendChild(link)
  } catch {
    // not an absolute URL: media() still works, there is just nothing to preconnect to
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
