import { useState, useEffect } from 'react';

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
          
          // Update service worker if needed
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        } catch (registrationError) {
          console.log('SW registration failed: ', registrationError);
        }
      });
    }

    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
        return;
      }
      
      // Check if running as PWA on mobile
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
        return;
      }
      
      // Check localStorage flag
      if (localStorage.getItem('pwa-installed') === 'true') {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
      
      // Don't show if already dismissed recently
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (now - dismissedTime > oneDay) {
        setIsInstallable(true);
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS Safari - check if can be added to home screen
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone;
    
    if (isIOS && !isInStandaloneMode && !localStorage.getItem('pwa-installed')) {
      // Show iOS install instructions after a delay
      setTimeout(() => {
        setIsInstallable(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      // For iOS or browsers that don't support install prompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert('لتثبيت التطبيق على iOS:\n1. اضغط على زر المشاركة\n2. اختر "إضافة إلى الشاشة الرئيسية"');
        return false;
      }
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
        setIsInstallable(false);
        localStorage.setItem('pwa-installed', 'true');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      return false;
    } catch (error) {
      console.error('Installation failed:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
    deferredPrompt
  };
};