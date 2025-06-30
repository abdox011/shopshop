import React, { useState, useEffect } from 'react';
import { Shirt, Settings as SettingsIcon } from 'lucide-react';
import { ClothingItem, Language, GeneratedDescription, AppSettings } from './types';
import { translations, getTranslation } from './utils/translations';
import { generateDescription } from './utils/descriptionGenerator';
import { saveDescription, getSavedDescriptions, clearSavedDescriptions, deleteDescription, updateDescription } from './utils/localStorage';
import { LanguageSelector } from './components/LanguageSelector';
import { ClothingForm } from './components/ClothingForm';
import { DescriptionResult } from './components/DescriptionResult';
import { SavedDescriptions } from './components/SavedDescriptions';
import { Settings } from './components/Settings';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { usePWA } from './hooks/usePWA';

const defaultSettings: AppSettings = {
  theme: 'light',
  defaultCurrency: 'USD',
  defaultTemplate: 'professional',
  imageQuality: 'high',
  exportFormat: 'png',
  cardBackgroundColor: '#ffffff',
  cardTextColor: '#1f2937',
  displayStyle: 'modern',
  autoSave: true,
  showBranding: false,
};

function App() {
  const [language, setLanguage] = useState<Language['code']>('en');
  const [item, setItem] = useState<ClothingItem>({
    type: '',
    size: '',
    color: '',
    fabric: '',
    condition: '',
    brand: '',
    notes: '',
    season: '',
    category: '',
    price: '',
    currency: 'USD',
    // حقول التوصيل الجديدة
    deliveryAvailable: false,
    deliveryCity: '',
    deliveryCityPrice: '',
    otherCitiesPrice: '',
  });
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedDescriptions, setSavedDescriptions] = useState<GeneratedDescription[]>([]);
  const [notification, setNotification] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings);

  // PWA Hook
  const { isInstallable, isInstalled } = usePWA();

  const t = translations[language];

  useEffect(() => {
    // Load saved descriptions
    setSavedDescriptions(getSavedDescriptions());

    // Load language preference
    const savedLanguage = localStorage.getItem('shopshop_language') as Language['code'];
    if (savedLanguage && ['en', 'fr', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }

    // Load app settings
    const savedSettings = localStorage.getItem('shopshop_settings');
    if (savedSettings) {
      const loadedSettings = { ...defaultSettings, ...JSON.parse(savedSettings) };
      setAppSettings(loadedSettings);
      
      // تطبيق العملة الافتراضية على النموذج
      setItem(prev => ({
        ...prev,
        currency: loadedSettings.defaultCurrency
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopshop_language', language);
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // تحديث العملة في النموذج عند تغيير الإعدادات
  useEffect(() => {
    setItem(prev => ({
      ...prev,
      currency: appSettings.defaultCurrency
    }));
  }, [appSettings.defaultCurrency]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const description = generateDescription(item, language);
    setGeneratedDescription(description);
    setIsGenerating(false);

    // Auto-save if enabled
    if (appSettings.autoSave && description) {
      const newDescription: GeneratedDescription = {
        id: Date.now().toString(),
        description: description,
        item: { ...item },
        language,
        createdAt: new Date(),
      };
      saveDescription(newDescription);
      setSavedDescriptions(getSavedDescriptions());
      showNotification(t.descriptionSaved || 'Description saved automatically!');
    }
  };

  const handleSave = () => {
    if (!generatedDescription) return;

    const newDescription: GeneratedDescription = {
      id: Date.now().toString(),
      description: generatedDescription,
      item: { ...item },
      language,
      createdAt: new Date(),
    };

    saveDescription(newDescription);
    setSavedDescriptions(getSavedDescriptions());
    showNotification(t.descriptionSaved || 'Description saved successfully!');
  };

  const handleDeleteSaved = (id: string) => {
    deleteDescription(id);
    setSavedDescriptions(getSavedDescriptions());
    showNotification('تم حذف الوصف بنجاح');
  };

  const handleUpdateSaved = (id: string, updatedDescription: GeneratedDescription) => {
    updateDescription(id, updatedDescription);
    setSavedDescriptions(getSavedDescriptions());
    showNotification('تم تحديث الوصف بنجاح');
  };

  const handleClearSaved = () => {
    clearSavedDescriptions();
    setSavedDescriptions([]);
    showNotification('تم مسح جميع الأوصاف');
  };

  const handleSettingsUpdate = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('shopshop_settings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* PWA Install Prompt */}
      {isInstallable && !isInstalled && (
        <PWAInstallPrompt language={language} />
      )}

      {/* Top Navigation Bar - Mobile Optimized */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-emerald-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Shirt className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {t.appName}
            </h1>
            {/* PWA Installed Badge */}
            {isInstalled && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {language === 'ar' ? 'مثبت' : language === 'fr' ? 'Installé' : 'Installed'}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="
                p-2 sm:p-2.5 rounded-lg sm:rounded-xl 
                bg-white text-gray-700 border-2 border-emerald-200
                hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
                transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
                active:scale-95
              "
              title={language === 'ar' ? 'الإعدادات' : language === 'fr' ? 'Paramètres' : 'Settings'}
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </button>
            
            {/* Language Selector */}
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={setLanguage}
              translations={t}
            />
          </div>
        </div>
      </div>

      {/* Notification - Mobile Optimized */}
      {notification && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg text-center text-sm sm:text-base">
            {notification}
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 max-w-6xl">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-4 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl sm:rounded-3xl shadow-lg">
              <Shirt className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {t.appName}
            </h1>
          </div>
          <p className="text-lg sm:text-2xl text-gray-700 font-medium mb-2 px-4">
            {t.tagline}
          </p>
          <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className="space-y-6 sm:space-y-8">
          {/* Form */}
          <ClothingForm
            item={item}
            onChange={setItem}
            onSubmit={handleGenerate}
            translations={t}
            isGenerating={isGenerating}
            language={language}
            settings={appSettings}
          />

          {/* Result */}
          {generatedDescription && (
            <DescriptionResult
              description={generatedDescription}
              onSave={handleSave}
              translations={t}
              language={language}
              settings={appSettings}
            />
          )}

          {/* Saved Descriptions */}
          <SavedDescriptions
            descriptions={savedDescriptions}
            onDelete={handleDeleteSaved}
            onUpdate={handleUpdateSaved}
            onClear={handleClearSaved}
            translations={t}
          />
        </div>

        {/* Footer - Mobile Optimized */}
        <footer className="mt-12 sm:mt-16 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            <span className="text-xl sm:text-2xl">✨</span>
            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
          </div>
          <p className="text-sm sm:text-lg font-medium px-4">
            Made with ❤️ for fashion enthusiasts • ShopShop 2024
          </p>
          {/* PWA Status */}
          {isInstalled && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              {language === 'ar' ? '📱 التطبيق مثبت بنجاح' : 
               language === 'fr' ? '📱 Application installée avec succès' : 
               '📱 App installed successfully'}
            </p>
          )}
        </footer>
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        translations={t}
        language={language}
        settings={appSettings}
        onSettingsChange={handleSettingsUpdate}
      />
    </div>
  );
}

export default App;