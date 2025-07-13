import React, { useState } from 'react';
import { Copy, Download, Save, Check, Edit } from 'lucide-react';
import { downloadAsImage } from '../utils/imageExport';
import { ImageEditor } from './ImageEditor';
import { AppSettings } from '../types';

interface DescriptionResultProps {
  description: string;
  onSave: () => void;
  translations: any;
  language: 'en' | 'fr' | 'ar';
  settings: AppSettings;
}

export const DescriptionResult: React.FC<DescriptionResultProps> = ({
  description,
  onSave,
  translations,
  language,
  settings,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadAsImage('description-card', 'shopshop-description', settings.imageQuality);
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Get title based on language
  const getCardTitle = () => {
    switch (language) {
      case 'ar':
        return 'بطاقة وصف المنتج';
      case 'fr':
        return 'Fiche Produit';
      case 'en':
      default:
        return 'Product Information';
    }
  };

  // Get card style based on display style setting
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: settings.cardBackgroundColor,
      color: settings.cardTextColor,
    };

    switch (settings.displayStyle) {
      case 'classic':
        return {
          ...baseStyle,
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        };
      case 'minimal':
        return {
          ...baseStyle,
          borderRadius: '4px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        };
      case 'modern':
      default:
        return {
          ...baseStyle,
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        };
    }
  };

  const cardStyle = getCardStyle();

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-emerald-100 p-4 sm:p-8 backdrop-blur-sm">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl">
          <span className="text-lg sm:text-2xl text-white">📝</span>
        </div>
        <span className="text-xl sm:text-3xl">{translations.generatedDescription}</span>
      </h2>
      
      {/* Card with Applied Settings - Mobile Optimized */}
      <div
        id="description-card"
        className={`
          relative overflow-hidden mx-auto mb-6 sm:mb-8 border-2 border-gray-200
          ${language === 'ar' ? 'text-right' : 'text-left'}
        `}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        style={{
          ...cardStyle,
          minHeight: '400px',
          maxWidth: '100%',
          width: '100%'
        }}
      >
        {/* Header with Custom Colors - Mobile Optimized */}
        <div 
          className="px-4 sm:px-8 py-4 sm:py-6"
          style={{
            backgroundColor: settings.cardTextColor,
            color: settings.cardBackgroundColor,
          }}
        >
          <h1 className="text-lg sm:text-2xl font-bold text-center">
            {getCardTitle()}
          </h1>
          <div 
            className="w-16 sm:w-24 h-0.5 mx-auto mt-2 sm:mt-3 rounded-full"
            style={{ backgroundColor: `${settings.cardBackgroundColor}30` }}
          ></div>
        </div>

        {/* Main Content Area with Custom Colors - Mobile Optimized */}
        <div 
          className="p-4 sm:p-8 min-h-[300px] sm:min-h-[350px]"
          style={{
            backgroundColor: `${settings.cardBackgroundColor}f0`,
          }}
        >
          <div 
            className="rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border"
            style={{
              backgroundColor: settings.cardBackgroundColor,
              borderColor: `${settings.cardTextColor}20`,
            }}
          >
            <div className="prose prose-gray max-w-none">
              <pre 
                className="whitespace-pre-wrap font-sans leading-relaxed text-sm sm:text-base"
                style={{ color: settings.cardTextColor }}
              >
                {description}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer with Branding Option - Mobile Optimized */}
        <div 
          className="px-4 sm:px-8 py-2 sm:py-3"
          style={{
            backgroundColor: settings.cardTextColor,
            color: settings.cardBackgroundColor,
          }}
        >
          <div className="flex items-center justify-center">
            {settings.showBranding ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">ShopShop</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div 
                    className="w-3 sm:w-4 h-0.5 rounded-full"
                    style={{ backgroundColor: `${settings.cardBackgroundColor}40` }}
                  ></div>
                  <div 
                    className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full"
                    style={{ backgroundColor: `${settings.cardBackgroundColor}60` }}
                  ></div>
                  <div 
                    className="w-3 sm:w-4 h-0.5 rounded-full"
                    style={{ backgroundColor: `${settings.cardBackgroundColor}40` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div 
                  className="w-3 sm:w-4 h-0.5 rounded-full"
                  style={{ backgroundColor: `${settings.cardBackgroundColor}40` }}
                ></div>
                <div 
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full"
                  style={{ backgroundColor: `${settings.cardBackgroundColor}60` }}
                ></div>
                <div 
                  className="w-3 sm:w-4 h-0.5 rounded-full"
                  style={{ backgroundColor: `${settings.cardBackgroundColor}40` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleCopy}
          className="
            flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-xl font-bold text-sm sm:text-lg
            bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            focus:ring-4 focus:ring-emerald-500/25 active:scale-95
          "
        >
          {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
          {copied ? translations.textCopied : translations.copyText}
        </button>
        
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="
            flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-xl font-bold text-sm sm:text-lg
            bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white
            disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            disabled:scale-100 active:scale-95
            focus:ring-4 focus:ring-teal-500/25
          "
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          {downloading ? 'Downloading...' : translations.downloadImage}
        </button>
        
        <button
          onClick={() => setShowEditor(true)}
          className="
            flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-xl font-bold text-sm sm:text-lg
            bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            focus:ring-4 focus:ring-purple-500/25 active:scale-95
          "
        >
          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          {language === 'ar' ? 'تخصيص وتحرير' : language === 'fr' ? 'Personnaliser et Éditer' : 'Customize & Edit'}
        </button>
        
        <button
          onClick={onSave}
          className="
            flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-xl font-bold text-sm sm:text-lg
            bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            focus:ring-4 focus:ring-cyan-500/25 active:scale-95
          "
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          {translations.saveLocally}
        </button>
      </div>

      {/* Image Editor Modal */}
      <ImageEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        description={description}
        language={language}
        settings={settings}
      />
    </div>
  );
};