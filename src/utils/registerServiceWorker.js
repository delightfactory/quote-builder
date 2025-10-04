/**
 * Register Service Worker for PWA functionality
 */
export const registerServiceWorker = () => {
  // Check if we're on a secure context (HTTPS or localhost)
  const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
  
  if (!isSecureContext) {
    console.warn('⚠️ Service Workers require HTTPS or localhost');
    return;
  }
  
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Workers are not supported in this browser');
    return;
  }

  window.addEventListener('load', () => {
    console.log('🔄 Attempting to register Service Worker...');
    
    navigator.serviceWorker
      .register('/service-worker.js', {
        scope: '/'
      })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully');
        console.log('   Scope:', registration.scope);
        console.log('   State:', registration.active?.state || 'installing');

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');

          newWorker.addEventListener('statechange', () => {
            console.log('   New worker state:', newWorker.state);
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('✨ New version available! Reload to update.');
              
              // Show update notification
              if (window.confirm('تحديث جديد متاح! هل تريد التحديث الآن؟')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
        console.error('   Error name:', error.name);
        console.error('   Error message:', error.message);
      });

    // Handle controller change
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('🔄 Service Worker controller changed, reloading...');
        window.location.reload();
      }
    });
  });
};

/**
 * Unregister all service workers (for development/testing)
 */
export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('✅ Service Worker unregistered');
      })
      .catch((error) => {
        console.error('❌ Error unregistering Service Worker:', error);
      });
  }
};

/**
 * Check if app is running as PWA
 */
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

/**
 * Prompt user to install PWA
 */
let deferredPrompt = null;

export const setupInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log('💾 PWA install prompt ready');
    
    // Show custom install button/banner
    const installEvent = new CustomEvent('pwa-install-available');
    window.dispatchEvent(installEvent);
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
  });
};

export const promptInstall = async () => {
  if (!deferredPrompt) {
    console.warn('⚠️ Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user's response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);
  
  // Clear the deferred prompt
  deferredPrompt = null;
  
  return outcome === 'accepted';
};
