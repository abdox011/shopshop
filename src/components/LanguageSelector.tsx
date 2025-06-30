import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language['code'];
  onLanguageChange: (language: Language['code']) => void;
  translations: any;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  translations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (langCode: Language['code']) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl 
          font-semibold text-xs sm:text-sm
          bg-white text-gray-700 border-2 border-emerald-200
          hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
          transform transition-all duration-300 hover:scale-105 hover:shadow-lg
          focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
          min-w-[100px] sm:min-w-[140px] justify-between
          active:scale-95
        "
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
          <span className="text-sm sm:text-lg">{selectedLang.flag}</span>
          <span className="hidden xs:inline truncate">{selectedLang.name}</span>
        </div>
        <ChevronDown 
          className={`w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2 
          bg-white border-2 border-emerald-200 rounded-lg sm:rounded-xl shadow-2xl 
          overflow-hidden z-50 min-w-[140px] sm:min-w-[180px]
          animate-in slide-in-from-top-2 duration-200
        ">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`
                w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left
                transition-all duration-200 font-semibold text-xs sm:text-sm
                ${
                  selectedLanguage === lang.code
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700'
                }
                first:rounded-t-lg last:rounded-b-lg
                active:scale-95
              `}
            >
              <span className="text-sm sm:text-lg">{lang.flag}</span>
              <span className="flex-1 truncate">{lang.name}</span>
              {selectedLanguage === lang.code && (
                <span className="text-white font-bold text-sm">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};