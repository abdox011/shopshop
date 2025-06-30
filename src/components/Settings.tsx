import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Download, 
  Eye, 
  Shield, 
  MessageCircle, 
  X,
  Save,
  RotateCcw,
  Monitor,
  Moon,
  Sun,
  Image,
  FileText,
  Smartphone,
  Paintbrush
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
  language: 'en' | 'fr' | 'ar';
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

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

// مجموعة ألوان فريدة وجميلة للخلفيات
const uniqueBackgroundColors = [
  { color: '#ffffff', name: 'Pure White', nameAr: 'أبيض نقي', nameFr: 'Blanc Pur' },
  { color: '#fef7f0', name: 'Warm Cream', nameAr: 'كريمي دافئ', nameFr: 'Crème Chaude' },
  { color: '#f0f9ff', name: 'Sky Blue', nameAr: 'أزرق سماوي', nameFr: 'Bleu Ciel' },
  { color: '#f0fdf4', name: 'Mint Fresh', nameAr: 'نعناعي منعش', nameFr: 'Menthe Fraîche' },
  { color: '#fdf4ff', name: 'Lavender Dream', nameAr: 'بنفسجي حالم', nameFr: 'Rêve Lavande' },
  { color: '#fffbeb', name: 'Golden Sand', nameAr: 'رملي ذهبي', nameFr: 'Sable Doré' },
  { color: '#f8fafc', name: 'Cool Gray', nameAr: 'رمادي بارد', nameFr: 'Gris Frais' },
  { color: '#fef2f2', name: 'Rose Blush', nameAr: 'وردي ناعم', nameFr: 'Rose Tendre' },
  { color: '#ecfdf5', name: 'Forest Mist', nameAr: 'ضباب الغابة', nameFr: 'Brume Forêt' },
  { color: '#f0f4ff', name: 'Ocean Breeze', nameAr: 'نسيم المحيط', nameFr: 'Brise Océan' },
  { color: '#fefce8', name: 'Sunshine', nameAr: 'أشعة الشمس', nameFr: 'Rayon Soleil' },
  { color: '#f5f3ff', name: 'Mystic Purple', nameAr: 'بنفسجي سحري', nameFr: 'Violet Mystique' },
];

// مجموعة ألوان فريدة وجميلة للنصوص
const uniqueTextColors = [
  { color: '#1f2937', name: 'Deep Charcoal', nameAr: 'فحمي عميق', nameFr: 'Charbon Profond' },
  { color: '#0f172a', name: 'Midnight Blue', nameAr: 'أزرق منتصف الليل', nameFr: 'Bleu Minuit' },
  { color: '#7c2d12', name: 'Rich Brown', nameAr: 'بني غني', nameFr: 'Brun Riche' },
  { color: '#14532d', name: 'Forest Green', nameAr: 'أخضر الغابة', nameFr: 'Vert Forêt' },
  { color: '#581c87', name: 'Royal Purple', nameAr: 'بنفسجي ملكي', nameFr: 'Violet Royal' },
  { color: '#92400e', name: 'Amber Gold', nameAr: 'ذهبي كهرماني', nameFr: 'Or Ambre' },
  { color: '#374151', name: 'Storm Gray', nameAr: 'رمادي العاصفة', nameFr: 'Gris Orage' },
  { color: '#991b1b', name: 'Crimson Red', nameAr: 'أحمر قرمزي', nameFr: 'Rouge Cramoisi' },
  { color: '#065f46', name: 'Emerald Deep', nameAr: 'زمردي عميق', nameFr: 'Émeraude Profond' },
  { color: '#1e40af', name: 'Ocean Blue', nameAr: 'أزرق المحيط', nameFr: 'Bleu Océan' },
  { color: '#a16207', name: 'Sunset Orange', nameAr: 'برتقالي الغروب', nameFr: 'Orange Couchant' },
  { color: '#7c3aed', name: 'Violet Dream', nameAr: 'بنفسجي الأحلام', nameFr: 'Violet Rêve' },
];

// مجموعات ألوان متناسقة
const colorCombinations = [
  { 
    name: 'Classic Elegance', 
    nameAr: 'أناقة كلاسيكية',
    nameFr: 'Élégance Classique',
    bg: '#ffffff', 
    text: '#1f2937',
    preview: 'bg-white text-gray-800'
  },
  { 
    name: 'Warm Sunset', 
    nameAr: 'غروب دافئ',
    nameFr: 'Coucher Chaleureux',
    bg: '#fef7f0', 
    text: '#7c2d12',
    preview: 'bg-orange-50 text-orange-900'
  },
  { 
    name: 'Ocean Breeze', 
    nameAr: 'نسيم المحيط',
    nameFr: 'Brise Océanique',
    bg: '#f0f9ff', 
    text: '#0f172a',
    preview: 'bg-sky-50 text-slate-900'
  },
  { 
    name: 'Forest Harmony', 
    nameAr: 'انسجام الغابة',
    nameFr: 'Harmonie Forestière',
    bg: '#f0fdf4', 
    text: '#14532d',
    preview: 'bg-green-50 text-green-900'
  },
  { 
    name: 'Royal Purple', 
    nameAr: 'بنفسجي ملكي',
    nameFr: 'Violet Royal',
    bg: '#fdf4ff', 
    text: '#581c87',
    preview: 'bg-purple-50 text-purple-900'
  },
  { 
    name: 'Golden Hour', 
    nameAr: 'الساعة الذهبية',
    nameFr: 'Heure Dorée',
    bg: '#fffbeb', 
    text: '#92400e',
    preview: 'bg-yellow-50 text-yellow-800'
  },
  { 
    name: 'Midnight Sky', 
    nameAr: 'سماء منتصف الليل',
    nameFr: 'Ciel de Minuit',
    bg: '#f8fafc', 
    text: '#0f172a',
    preview: 'bg-slate-50 text-slate-900'
  },
  { 
    name: 'Rose Garden', 
    nameAr: 'حديقة الورود',
    nameFr: 'Jardin de Roses',
    bg: '#fef2f2', 
    text: '#991b1b',
    preview: 'bg-red-50 text-red-800'
  },
];

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  translations,
  language,
  settings,
  onSettingsChange,
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const saveSettings = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const resetSettings = () => {
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    // تطبيق التغييرات فوراً
    onSettingsChange(newSettings);
  };

  const applyColorCombination = (combination: typeof colorCombinations[0]) => {
    const newSettings = {
      ...localSettings,
      cardBackgroundColor: combination.bg,
      cardTextColor: combination.text,
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const getColorName = (colorOption: any) => {
    switch (language) {
      case 'ar':
        return colorOption.nameAr || colorOption.name;
      case 'fr':
        return colorOption.nameFr || colorOption.name;
      default:
        return colorOption.name;
    }
  };

  const getCombinationName = (combination: any) => {
    switch (language) {
      case 'ar':
        return combination.nameAr || combination.name;
      case 'fr':
        return combination.nameFr || combination.name;
      default:
        return combination.name;
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', icon: SettingsIcon, label: language === 'ar' ? 'عام' : language === 'fr' ? 'Général' : 'General' },
    { id: 'appearance', icon: Palette, label: language === 'ar' ? 'المظهر' : language === 'fr' ? 'Apparence' : 'Appearance' },
    { id: 'colors', icon: Paintbrush, label: language === 'ar' ? 'الألوان' : language === 'fr' ? 'Couleurs' : 'Colors' },
    { id: 'export', icon: Download, label: language === 'ar' ? 'التصدير' : language === 'fr' ? 'Export' : 'Export' },
    { id: 'display', icon: Eye, label: language === 'ar' ? 'العرض' : language === 'fr' ? 'Affichage' : 'Display' },
    { id: 'legal', icon: Shield, label: language === 'ar' ? 'قانوني' : language === 'fr' ? 'Légal' : 'Legal' },
    { id: 'contact', icon: MessageCircle, label: language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Contact' : 'Contact' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              {language === 'ar' ? 'الإعدادات' : language === 'fr' ? 'Paramètres' : 'Settings'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'ar' ? 'الإعدادات العامة' : language === 'fr' ? 'Paramètres généraux' : 'General Settings'}
                  </h3>

                  {/* Theme */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      {language === 'ar' ? 'المظهر' : language === 'fr' ? 'Thème' : 'Theme'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', icon: Sun, label: language === 'ar' ? 'فاتح' : language === 'fr' ? 'Clair' : 'Light' },
                        { value: 'dark', icon: Moon, label: language === 'ar' ? 'داكن' : language === 'fr' ? 'Sombre' : 'Dark' },
                        { value: 'auto', icon: Monitor, label: language === 'ar' ? 'تلقائي' : language === 'fr' ? 'Auto' : 'Auto' },
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => updateSetting('theme', theme.value)}
                          className={`
                            flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${localSettings.theme === theme.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                            }
                          `}
                        >
                          <theme.icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Default Currency */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      {language === 'ar' ? 'العملة الافتراضية' : language === 'fr' ? 'Devise par défaut' : 'Default Currency'}
                    </label>
                    <select
                      value={localSettings.defaultCurrency}
                      onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="EGP">EGP - Egyptian Pound</option>
                      <option value="MAD">MAD - Moroccan Dirham</option>
                      <option value="TND">TND - Tunisian Dinar</option>
                    </select>
                  </div>

                  {/* Auto Save */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-bold text-gray-700">
                          {language === 'ar' ? 'الحفظ التلقائي' : language === 'fr' ? 'Sauvegarde automatique' : 'Auto Save'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'ar' ? 'حفظ الأوصاف تلقائياً عند إنشائها' : language === 'fr' ? 'Sauvegarder automatiquement les descriptions' : 'Automatically save descriptions when generated'}
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('autoSave', !localSettings.autoSave)}
                        className={`
                          relative w-12 h-6 rounded-full transition-colors
                          ${localSettings.autoSave ? 'bg-emerald-500' : 'bg-gray-300'}
                        `}
                      >
                        <div className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                          ${localSettings.autoSave ? 'translate-x-7' : 'translate-x-1'}
                        `} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'ar' ? 'إعدادات المظهر' : language === 'fr' ? 'Paramètres d\'apparence' : 'Appearance Settings'}
                  </h3>

                  {/* Show Branding */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-bold text-gray-700">
                          {language === 'ar' ? 'إظهار العلامة التجارية' : language === 'fr' ? 'Afficher la marque' : 'Show Branding'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'ar' ? 'إظهار شعار ShopShop في البطاقات المُصدرة' : language === 'fr' ? 'Afficher le logo ShopShop sur les cartes' : 'Show ShopShop logo on exported cards'}
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('showBranding', !localSettings.showBranding)}
                        className={`
                          relative w-12 h-6 rounded-full transition-colors
                          ${localSettings.showBranding ? 'bg-emerald-500' : 'bg-gray-300'}
                        `}
                      >
                        <div className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                          ${localSettings.showBranding ? 'translate-x-7' : 'translate-x-1'}
                        `} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Colors Settings - New Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Paintbrush className="w-8 h-8 text-purple-600" />
                    {language === 'ar' ? 'إعدادات الألوان' : language === 'fr' ? 'Paramètres de couleurs' : 'Color Settings'}
                  </h3>

                  {/* Color Combinations */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <label className="block text-lg font-bold text-purple-800 mb-6 flex items-center gap-3">
                      <span className="text-3xl">🎨</span>
                      {language === 'ar' ? 'مجموعات ألوان متناسقة' : language === 'fr' ? 'Combinaisons de couleurs harmonieuses' : 'Beautiful Color Combinations'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {colorCombinations.map((combination, index) => (
                        <button
                          key={index}
                          onClick={() => applyColorCombination(combination)}
                          className={`
                            group relative p-6 rounded-xl border-2 transition-all duration-300
                            hover:scale-105 hover:shadow-xl
                            ${combination.preview}
                            ${localSettings.cardBackgroundColor === combination.bg && localSettings.cardTextColor === combination.text
                              ? 'border-purple-500 ring-4 ring-purple-500/20 shadow-lg'
                              : 'border-gray-200 hover:border-purple-300'
                            }
                          `}
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-current opacity-60"></div>
                            <span className="text-sm font-bold">{getCombinationName(combination)}</span>
                          </div>
                          {localSettings.cardBackgroundColor === combination.bg && localSettings.cardTextColor === combination.text && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Colors */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <label className="block text-lg font-bold text-blue-800 mb-6 flex items-center gap-3">
                      <span className="text-3xl">🌈</span>
                      {language === 'ar' ? 'ألوان الخلفية' : language === 'fr' ? 'Couleurs de fond' : 'Background Colors'}
                    </label>
                    
                    {/* Color Picker */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border-2 border-blue-200">
                      <input
                        type="color"
                        value={localSettings.cardBackgroundColor}
                        onChange={(e) => updateSetting('cardBackgroundColor', e.target.value)}
                        className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer shadow-lg"
                      />
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {language === 'ar' ? 'اختر لون مخصص' : language === 'fr' ? 'Choisir une couleur personnalisée' : 'Choose Custom Color'}
                        </label>
                        <input
                          type="text"
                          value={localSettings.cardBackgroundColor}
                          onChange={(e) => updateSetting('cardBackgroundColor', e.target.value)}
                          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    {/* Preset Colors */}
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {uniqueBackgroundColors.map((colorOption, index) => (
                        <button
                          key={index}
                          onClick={() => updateSetting('cardBackgroundColor', colorOption.color)}
                          className={`
                            relative group h-20 rounded-xl border-2 transition-all duration-300
                            hover:scale-110 hover:shadow-xl hover:z-10
                            ${localSettings.cardBackgroundColor === colorOption.color
                              ? 'border-blue-500 ring-4 ring-blue-500/50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300'
                            }
                          `}
                          style={{ backgroundColor: colorOption.color }}
                          title={getColorName(colorOption)}
                        >
                          {localSettings.cardBackgroundColor === colorOption.color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-2xl drop-shadow-lg">✓</span>
                            </div>
                          )}
                          <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {getColorName(colorOption)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Colors */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <label className="block text-lg font-bold text-green-800 mb-6 flex items-center gap-3">
                      <span className="text-3xl">✍️</span>
                      {language === 'ar' ? 'ألوان النص' : language === 'fr' ? 'Couleurs de texte' : 'Text Colors'}
                    </label>
                    
                    {/* Color Picker */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border-2 border-green-200">
                      <input
                        type="color"
                        value={localSettings.cardTextColor}
                        onChange={(e) => updateSetting('cardTextColor', e.target.value)}
                        className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer shadow-lg"
                      />
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {language === 'ar' ? 'اختر لون نص مخصص' : language === 'fr' ? 'Choisir une couleur de texte personnalisée' : 'Choose Custom Text Color'}
                        </label>
                        <input
                          type="text"
                          value={localSettings.cardTextColor}
                          onChange={(e) => updateSetting('cardTextColor', e.target.value)}
                          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>

                    {/* Preset Colors */}
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {uniqueTextColors.map((colorOption, index) => (
                        <button
                          key={index}
                          onClick={() => updateSetting('cardTextColor', colorOption.color)}
                          className={`
                            relative group h-20 rounded-xl border-2 transition-all duration-300
                            hover:scale-110 hover:shadow-xl hover:z-10
                            ${localSettings.cardTextColor === colorOption.color
                              ? 'border-green-500 ring-4 ring-green-500/50 shadow-lg'
                              : 'border-gray-200 hover:border-green-300'
                            }
                          `}
                          style={{ backgroundColor: colorOption.color }}
                          title={getColorName(colorOption)}
                        >
                          {localSettings.cardTextColor === colorOption.color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white font-bold text-2xl drop-shadow-lg">✓</span>
                            </div>
                          )}
                          <div className="absolute bottom-1 left-1 right-1 bg-white/90 text-gray-800 text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {getColorName(colorOption)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-gray-200">
                    <label className="block text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <span className="text-3xl">👁️</span>
                      {language === 'ar' ? 'معاينة مباشرة' : language === 'fr' ? 'Aperçu en direct' : 'Live Preview'}
                    </label>
                    <div 
                      className="w-full h-64 rounded-xl border-2 border-gray-200 flex items-center justify-center transition-all duration-300 shadow-lg"
                      style={{ 
                        backgroundColor: localSettings.cardBackgroundColor,
                        color: localSettings.cardTextColor 
                      }}
                    >
                      <div className="text-center p-8">
                        <h4 className="text-2xl font-bold mb-4">ShopShop</h4>
                        <p className="text-lg opacity-75 mb-4">
                          {language === 'ar' ? 'معاينة البطاقة' : language === 'fr' ? 'Aperçu de la carte' : 'Card Preview'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <div 
                            className="w-8 h-2 rounded-full"
                            style={{ backgroundColor: localSettings.cardTextColor, opacity: 0.3 }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: localSettings.cardTextColor, opacity: 0.5 }}
                          ></div>
                          <div 
                            className="w-8 h-2 rounded-full"
                            style={{ backgroundColor: localSettings.cardTextColor, opacity: 0.3 }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Settings */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'ar' ? 'إعدادات التصدير' : language === 'fr' ? 'Paramètres d\'export' : 'Export Settings'}
                  </h3>

                  {/* Image Quality */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      {language === 'ar' ? 'جودة الصورة' : language === 'fr' ? 'Qualité d\'image' : 'Image Quality'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'low', label: language === 'ar' ? 'منخفضة' : language === 'fr' ? 'Faible' : 'Low' },
                        { value: 'medium', label: language === 'ar' ? 'متوسطة' : language === 'fr' ? 'Moyenne' : 'Medium' },
                        { value: 'high', label: language === 'ar' ? 'عالية' : language === 'fr' ? 'Haute' : 'High' },
                      ].map((quality) => (
                        <button
                          key={quality.value}
                          onClick={() => updateSetting('imageQuality', quality.value)}
                          className={`
                            flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${localSettings.imageQuality === quality.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                            }
                          `}
                        >
                          <Image className="w-5 h-5" />
                          <span className="font-medium">{quality.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export Format */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      {language === 'ar' ? 'تنسيق التصدير' : language === 'fr' ? 'Format d\'export' : 'Export Format'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'png', icon: Image, label: 'PNG' },
                        { value: 'pdf', icon: FileText, label: 'PDF' },
                        { value: 'text', icon: FileText, label: language === 'ar' ? 'نص' : language === 'fr' ? 'Texte' : 'Text' },
                      ].map((format) => (
                        <button
                          key={format.value}
                          onClick={() => updateSetting('exportFormat', format.value)}
                          className={`
                            flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${localSettings.exportFormat === format.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                            }
                          `}
                        >
                          <format.icon className="w-6 h-6" />
                          <span className="font-medium">{format.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Default Template */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      {language === 'ar' ? 'القالب الافتراضي' : language === 'fr' ? 'Modèle par défaut' : 'Default Template'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'basic', label: language === 'ar' ? 'أساسي' : language === 'fr' ? 'Basique' : 'Basic' },
                        { value: 'professional', label: language === 'ar' ? 'احترافي' : language === 'fr' ? 'Professionnel' : 'Professional' },
                      ].map((template) => (
                        <button
                          key={template.value}
                          onClick={() => updateSetting('defaultTemplate', template.value)}
                          className={`
                            flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${localSettings.defaultTemplate === template.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                            }
                          `}
                        >
                          <FileText className="w-5 h-5" />
                          <span className="font-medium">{template.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'ar' ? 'إعدادات العرض' : language === 'fr' ? 'Paramètres d\'affichage' : 'Display Settings'}
                  </h3>

                  {/* Display Style */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      {language === 'ar' ? 'نمط العرض' : language === 'fr' ? 'Style d\'affichage' : 'Display Style'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'modern', label: language === 'ar' ? 'عصري' : language === 'fr' ? 'Moderne' : 'Modern' },
                        { value: 'classic', label: language === 'ar' ? 'كلاسيكي' : language === 'fr' ? 'Classique' : 'Classic' },
                        { value: 'minimal', label: language === 'ar' ? 'بسيط' : language === 'fr' ? 'Minimal' : 'Minimal' },
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => updateSetting('displayStyle', style.value)}
                          className={`
                            flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${localSettings.displayStyle === style.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                            }
                          `}
                        >
                          <Smartphone className="w-6 h-6" />
                          <span className="font-medium">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Legal */}
              {activeTab === 'legal' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'ar' ? 'الشروط والخصوصية' : language === 'fr' ? 'Conditions et confidentialité' : 'Terms & Privacy'}
                  </h3>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowTerms(true)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {language === 'ar' ? 'الشروط والأحكام' : language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Service'}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {language === 'ar' ? 'اقرأ شروط استخدام التطبيق' : language === 'fr' ? 'Lire les conditions d\'utilisation' : 'Read our terms of service'}
                          </p>
                        </div>
                        <Shield className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>

                    <button
                      onClick={() => setShowPrivacy(true)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {language === 'ar' ? 'سياسة الخصوصية' : language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {language === 'ar' ? 'تعرف على كيفية حماية بياناتك' : language === 'fr' ? 'Découvrez comment nous protégeons vos données' : 'Learn how we protect your data'}
                          </p>
                        </div>
                        <Shield className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Contact */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
                  </h3>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'}
                        </h4>
                        <p className="text-gray-600">support@shopshop.app</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          {language === 'ar' ? 'الموقع الإلكتروني' : language === 'fr' ? 'Site web' : 'Website'}
                        </h4>
                        <p className="text-gray-600">www.shopshop.app</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          {language === 'ar' ? 'الإصدار' : language === 'fr' ? 'Version' : 'Version'}
                        </h4>
                        <p className="text-gray-600">ShopShop v1.0.0</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                    <h4 className="font-bold text-emerald-800 mb-2">
                      {language === 'ar' ? 'نحن نحب ملاحظاتك!' : language === 'fr' ? 'Nous aimons vos commentaires!' : 'We love your feedback!'}
                    </h4>
                    <p className="text-emerald-700 text-sm">
                      {language === 'ar' 
                        ? 'إذا كان لديك أي اقتراحات أو مشاكل، لا تتردد في التواصل معنا.'
                        : language === 'fr'
                        ? 'Si vous avez des suggestions ou des problèmes, n\'hésitez pas à nous contacter.'
                        : 'If you have any suggestions or issues, feel free to reach out to us.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {language === 'ar' ? 'إعادة تعيين' : language === 'fr' ? 'Réinitialiser' : 'Reset'}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              onClick={saveSettings}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : language === 'fr' ? 'Sauvegarder' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {language === 'ar' ? 'الشروط والأحكام' : language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Service'}
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-gray max-w-none text-sm">
                {language === 'ar' ? (
                  <div className="space-y-4 text-right" dir="rtl">
                    <h4 className="font-bold">1. الاستخدام المقبول</h4>
                    <p>يُسمح باستخدام التطبيق للأغراض الشخصية والتجارية المشروعة فقط.</p>
                    
                    <h4 className="font-bold">2. المسؤولية</h4>
                    <p>المستخدم مسؤول عن دقة المعلومات المُدخلة والتطبيق غير مسؤول عن أي خسائر.</p>
                    
                    <h4 className="font-bold">3. الملكية الفكرية</h4>
                    <p>الأوصاف المُولدة ملك للمستخدم مع احترام حقوق العلامات التجارية.</p>
                  </div>
                ) : language === 'fr' ? (
                  <div className="space-y-4">
                    <h4 className="font-bold">1. Utilisation acceptable</h4>
                    <p>L'application ne peut être utilisée qu'à des fins personnelles et commerciales légitimes.</p>
                    
                    <h4 className="font-bold">2. Responsabilité</h4>
                    <p>L'utilisateur est responsable de l'exactitude des informations saisies.</p>
                    
                    <h4 className="font-bold">3. Propriété intellectuelle</h4>
                    <p>Les descriptions générées appartiennent à l'utilisateur.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-bold">1. Acceptable Use</h4>
                    <p>The application may only be used for legitimate personal and commercial purposes.</p>
                    
                    <h4 className="font-bold">2. Liability</h4>
                    <p>Users are responsible for the accuracy of information entered.</p>
                    
                    <h4 className="font-bold">3. Intellectual Property</h4>
                    <p>Generated descriptions belong to the user.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {language === 'ar' ? 'سياسة الخصوصية' : language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setShowPrivacy(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-gray max-w-none text-sm">
                {language === 'ar' ? (
                  <div className="space-y-4 text-right" dir="rtl">
                    <h4 className="font-bold">1. جمع البيانات</h4>
                    <p>البيانات تُحفظ محلياً على جهازك فقط ولا نشاركها مع أطراف ثالثة.</p>
                    
                    <h4 className="font-bold">2. استخدام البيانات</h4>
                    <p>نستخدم البيانات لتحسين تجربة المستخدم وتطوير ميزات جديدة.</p>
                    
                    <h4 className="font-bold">3. حماية البيانات</h4>
                    <p>بياناتك محمية بالتشفير ولا يمكن الوصول إليها من الخادم.</p>
                  </div>
                ) : language === 'fr' ? (
                  <div className="space-y-4">
                    <h4 className="font-bold">1. Collecte de données</h4>
                    <p>Les données sont stockées localement sur votre appareil uniquement.</p>
                    
                    <h4 className="font-bold">2. Utilisation des données</h4>
                    <p>Nous utilisons les données pour améliorer l'expérience utilisateur.</p>
                    
                    <h4 className="font-bold">3. Protection des données</h4>
                    <p>Vos données sont protégées par cryptage.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-bold">1. Data Collection</h4>
                    <p>Data is stored locally on your device only and not shared with third parties.</p>
                    
                    <h4 className="font-bold">2. Data Usage</h4>
                    <p>We use data to improve user experience and develop new features.</p>
                    
                    <h4 className="font-bold">3. Data Protection</h4>
                    <p>Your data is protected with encryption and cannot be accessed from servers.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};