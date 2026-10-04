// BUBT Connect Service Worker
const CACHE_NAME = 'bubt-connect-v1'
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/images/bubt-logo.png',
  '/images/bubt-campus.jpg'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching partial warning:', err)
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  // Skip non-http(s) and cross-origin chrome extensions
  if (!url.protocol.startsWith('http')) return

  // Network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful static assets
        if (
          networkResponse.status === 200 &&
          (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/images/'))
        ) {
          const responseClone = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return networkResponse
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          return new Response('Offline: Please reconnect to internet to view dynamic BUBT Connect updates.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        })
      })
  )
})
