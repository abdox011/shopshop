import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Star, Zap, Shield } from 'lucide-react';

interface PWAInstallPromptProps {
  language: 'en' | 'fr' | 'ar';
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ language }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const translations = {
    en: {
      title: 'Install ShopShop App',
      subtitle: 'Get the best experience with our mobile app!',
      features: [
        'Work offline anytime',
        'Faster loading',
        'Native app experience',
        'Push notifications'
      ],
      install: 'Install App',
      later: 'Maybe Later',
      installing: 'Installing...',
      benefits: 'Why install?'
    },
    fr: {
      title: 'Installer l\'App ShopShop',
      subtitle: 'Obtenez la meilleure expérience avec notre app mobile!',
      features: [
        'Fonctionne hors ligne',
        'Chargement plus rapide',
        'Expérience app native',
        'Notifications push'
      ],
      install: 'Installer l\'App',
      later: 'Plus Tard',
      installing: 'Installation...',
      benefits: 'Pourquoi installer?'
    },
    ar: {
      title: 'تثبيت تطبيق ShopShop',
      subtitle: 'احصل على أفضل تجربة مع تطبيقنا المحمول!',
      features: [
        'يعمل بدون إنترنت',
        'تحميل أسرع',
        'تجربة تطبيق أصلية',
        'إشعارات فورية'
      ],
      install: 'تثبيت التطبيق',
      later: 'ربما لاحقاً',
      installing: 'جاري التثبيت...',
      benefits: 'لماذا التثبيت؟'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has already dismissed the prompt
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const installed = localStorage.getItem('pwa-installed');
      
      if (!dismissed && !installed) {
        // Show prompt after a short delay
        setTimeout(() => {
          setShowPrompt(true);
          setTimeout(() => setIsVisible(true), 100);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
      setIsVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      const result = await deferredPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
        setShowPrompt(false);
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleDismiss}
      />

      {/* Install Prompt - Sliding from top */}
      <div 
        className={`
          fixed top-0 left-0 right-0 z-50 mx-4 mt-4 
          transform transition-all duration-500 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="relative max-w-md mx-auto">
          {/* Floating Card with Gradient */}
          <div className="
            bg-gradient-to-br from-white via-emerald-50 to-teal-50 
            rounded-2xl shadow-2xl border-2 border-emerald-200/50
            backdrop-blur-xl overflow-hidden
            animate-in slide-in-from-top-4 duration-500
          ">
            {/* Header with Icon Animation */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-bounce">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t.title}</h3>
                    <p className="text-emerald-100 text-sm">{t.subtitle}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Benefits Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {t.benefits}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {t.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-emerald-200/50"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="
                    flex-1 flex items-center justify-center gap-2 px-4 py-3 
                    rounded-xl font-bold text-sm text-white
                    bg-gradient-to-r from-emerald-500 to-teal-500 
                    hover:from-emerald-600 hover:to-teal-600
                    disabled:from-gray-400 disabled:to-gray-500
                    transform transition-all duration-300 hover:scale-105 
                    disabled:scale-100 active:scale-95
                    shadow-lg hover:shadow-xl
                    focus:ring-4 focus:ring-emerald-500/25
                  "
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.installing}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {t.install}
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDismiss}
                  className="
                    px-4 py-3 rounded-xl font-bold text-sm text-gray-600
                    bg-white/80 hover:bg-white border-2 border-gray-200
                    hover:border-gray-300 transition-all duration-200
                    hover:scale-105 active:scale-95
                  "
                >
                  {t.later}
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                <Shield className="w-3 h-3 text-green-600" />
                <span>
                  {language === 'ar' ? 'آمن ومضمون' : 
                   language === 'fr' ? 'Sécurisé et fiable' : 
                   'Safe & Secure'}
                </span>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </>
  );
};