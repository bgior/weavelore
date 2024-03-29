// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

/* The build process involves Workbox grabbing this file, injecting the precacheManifest
attribute, and generating a modified service-worker.js in the dist directory.

I switched from the default "GenerateSW" strategy (which auto-generates the whole
service worker) to "InjectManifest" (which lets us define it here) to be able to
change the cache suffix. This was configured in vue.config.js. */

/* eslint no-undef: 0 */
// Add a suffix so that the cache of a new worker doesn't overwrite an old one's.
// This matters because the new worker won't immediately become active.
workbox.core.setCacheNameDetails({ prefix: "weavelore", suffix: '1.0.2' });

self.__precacheManifest = [].concat(self.__precacheManifest || []);

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Make all navigation requests be directed to index.html, since it's a SPA
workbox.routing.registerNavigationRoute('/index.html');

// An immediate update of the app can be triggered by sending this message to the new worker waiting
addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') {
    return skipWaiting();
  }
});
