import React from 'react';
import { ClothingItem, AppSettings } from '../types';
import { iconOptions } from '../utils/iconOptions';
import { IconSelector } from './IconSelector';
import { Truck, MapPin, DollarSign } from 'lucide-react';

interface ClothingFormProps {
  item: ClothingItem;
  onChange: (item: ClothingItem) => void;
  onSubmit: () => void;
  translations: any;
  isGenerating: boolean;
  language: 'en' | 'fr' | 'ar';
  settings: AppSettings;
}

export const ClothingForm: React.FC<ClothingFormProps> = ({
  item,
  onChange,
  onSubmit,
  translations,
  isGenerating,
  language,
  settings,
}) => {
  const options = iconOptions[language];

  const handleChange = (field: keyof ClothingItem, value: string | boolean) => {
    onChange({ ...item, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // دالة للحصول على رمز العملة
  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AED': 'د.إ',
      'SAR': 'ر.س',
      'EGP': 'ج.م',
      'MAD': 'د.م',
      'TND': 'د.ت'
    };
    return symbols[currency] || currency;
  };

  const inputClasses = `
    w-full p-3 sm:p-4 rounded-xl border-2 border-emerald-200 
    bg-white text-gray-900 text-sm sm:text-base
    placeholder-gray-500
    focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
    transition-all duration-200 hover:border-emerald-300
  `;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-emerald-100 p-4 sm:p-8 backdrop-blur-sm">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl">
          <span className="text-lg sm:text-2xl text-white">👔</span>
        </div>
        <span className="text-xl sm:text-3xl">{translations.clothingDetails}</span>
      </h2>
      
      {/* Empty Form Note - Mobile Optimized */}
      <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl border-2 border-emerald-200">
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-lg sm:text-2xl flex-shrink-0 mt-0.5">💡</span>
          <p className="text-emerald-700 font-medium text-sm sm:text-base leading-relaxed">
            {translations.emptyFormNote}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Type Selection */}
        <IconSelector
          label={translations.type}
          value={item.type}
          onChange={(value) => handleChange('type', value)}
          options={options.types}
        />
        
        {/* Size Selection - Multi-select for flexibility */}
        <IconSelector
          label={translations.size}
          value={item.size}
          onChange={(value) => handleChange('size', value)}
          options={options.sizes}
          multiSelect
        />
        
        {/* Color Selection - Multi-select for mixed colors */}
        <IconSelector
          label={translations.color}
          value={item.color}
          onChange={(value) => handleChange('color', value)}
          options={options.colors}
          multiSelect
        />
        
        {/* Fabric Selection - Multi-select for blended fabrics */}
        <IconSelector
          label={translations.fabric}
          value={item.fabric}
          onChange={(value) => handleChange('fabric', value)}
          options={options.fabrics}
          multiSelect
        />
        
        {/* Condition Selection */}
        <IconSelector
          label={translations.condition}
          value={item.condition}
          onChange={(value) => handleChange('condition', value)}
          options={options.conditions}
        />
        
        {/* Season Selection - Multi-select for versatile pieces */}
        <IconSelector
          label={translations.season}
          value={item.season}
          onChange={(value) => handleChange('season', value)}
          options={options.seasons}
          multiSelect
        />
        
        {/* Category Selection */}
        <IconSelector
          label={translations.category}
          value={item.category}
          onChange={(value) => handleChange('category', value)}
          options={options.categories}
        />
        
        {/* Brand Selection (Optional) */}
        <IconSelector
          label={translations.brand}
          value={item.brand}
          onChange={(value) => handleChange('brand', value)}
          options={options.brands}
        />
        
        {/* Price Section - Mobile Optimized with Currency Display */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-200">
          <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span>{translations.price}</span>
            <span className="text-sm font-normal text-green-600">
              ({getCurrencySymbol(settings.defaultCurrency)} {settings.defaultCurrency})
            </span>
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                {translations.price}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder={translations.pricePlaceholder}
                  className={inputClasses}
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span className="text-green-600 font-bold text-lg">
                    {getCurrencySymbol(settings.defaultCurrency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Display */}
          <div className="mt-4 p-3 bg-white rounded-lg border-2 border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {translations.currency}:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  {getCurrencySymbol(settings.defaultCurrency)}
                </span>
                <span className="text-sm font-bold text-green-800">
                  {settings.defaultCurrency}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'يمكن تغيير العملة من الإعدادات' : 
               language === 'fr' ? 'La devise peut être changée dans les paramètres' : 
               'Currency can be changed in settings'}
            </p>
          </div>
        </div>

        {/* قسم التوصيل الجديد - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
          <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span>{translations.delivery}</span>
          </h3>

          {/* خيار توفر التوصيل */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    {translations.deliveryAvailable}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'ar' ? 'هل التوصيل متوفر لهذه القطعة؟' : 
                     language === 'fr' ? 'La livraison est-elle disponible pour cet article?' : 
                     'Is delivery available for this item?'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChange('deliveryAvailable', !item.deliveryAvailable)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${item.deliveryAvailable ? 'bg-blue-500' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${item.deliveryAvailable ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>

          {/* حقول التوصيل - تظهر فقط عند تفعيل التوصيل */}
          {item.deliveryAvailable && (
            <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-top-2 duration-300">
              {/* مدينة البائع */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {translations.deliveryCity}
                </label>
                <input
                  type="text"
                  value={item.deliveryCity}
                  onChange={(e) => handleChange('deliveryCity', e.target.value)}
                  placeholder={translations.deliveryCityPlaceholder}
                  className={inputClasses}
                />
              </div>

              {/* أسعار التوصيل */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* سعر التوصيل داخل المدينة */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    {translations.deliveryCityPrice}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={item.deliveryCityPrice}
                      onChange={(e) => handleChange('deliveryCityPrice', e.target.value)}
                      placeholder={translations.deliveryCityPricePlaceholder}
                      className={inputClasses}
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-green-600 font-bold">
                        {getCurrencySymbol(settings.defaultCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* سعر التوصيل لباقي المدن */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    {translations.otherCitiesPrice}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={item.otherCitiesPrice}
                      onChange={(e) => handleChange('otherCitiesPrice', e.target.value)}
                      placeholder={translations.otherCitiesPricePlaceholder}
                      className={inputClasses}
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-orange-600 font-bold">
                        {getCurrencySymbol(settings.defaultCurrency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* معاينة أسعار التوصيل */}
              {(item.deliveryCity || item.deliveryCityPrice || item.otherCitiesPrice) && (
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">📦</span>
                    {language === 'ar' ? 'معاينة أسعار التوصيل' : 
                     language === 'fr' ? 'Aperçu des prix de livraison' : 
                     'Delivery Prices Preview'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {item.deliveryCity && item.deliveryCityPrice && (
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-green-700 font-medium">
                          📍 {item.deliveryCity}
                        </span>
                        <span className="text-green-800 font-bold">
                          {item.deliveryCityPrice} {getCurrencySymbol(settings.defaultCurrency)}
                        </span>
                      </div>
                    )}
                    {item.otherCitiesPrice && (
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="text-orange-700 font-medium">
                          🌍 {language === 'ar' ? 'باقي المدن' : 
                               language === 'fr' ? 'Autres villes' : 
                               'Other Cities'}
                        </span>
                        <span className="text-orange-800 font-bold">
                          {item.otherCitiesPrice} {getCurrencySymbol(settings.defaultCurrency)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Notes - Mobile Optimized */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
            {translations.notes}
          </label>
          <textarea
            rows={3}
            value={item.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder={translations.notesPlaceholder}
            className={`${inputClasses} resize-none`}
          />
        </div>
        
        {/* Submit Button - Mobile Optimized */}
        <button
          type="submit"
          disabled={isGenerating}
          className="
            w-full py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl 
            font-bold text-base sm:text-lg text-white
            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
            hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600
            disabled:from-gray-400 disabled:to-gray-500
            transform transition-all duration-300
            hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/25
            disabled:scale-100 disabled:shadow-none
            focus:ring-4 focus:ring-emerald-500/25
            active:scale-[0.98]
          "
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl sm:text-2xl">✨</span>
              <span>{translations.generateDescription}</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};