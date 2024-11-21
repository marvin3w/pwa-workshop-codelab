import { warmStrategyCache, offlineFallback } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Cache for pages
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// Warm cache with main pages
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Route for page navigation
registerRoute(
  ({ request }) => request.mode === 'navigate',
  pageCache
);

// Asset cache (CSS, JS, Workers)
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Offline fallback
offlineFallback({
  pageFallback: '/offline.html',
});
