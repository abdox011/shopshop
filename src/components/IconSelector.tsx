import React from 'react';

interface IconSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; icon: string; label: string }[];
  required?: boolean;
  multiSelect?: boolean;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  multiSelect = false,
}) => {
  const selectedValues = multiSelect ? value.split(',').filter(v => v.trim()) : [value];

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = value.split(',').filter(v => v.trim());
      if (currentValues.includes(optionValue)) {
        // Remove if already selected
        const newValues = currentValues.filter(v => v !== optionValue);
        onChange(newValues.join(', '));
      } else {
        // Add if not selected
        const newValues = [...currentValues, optionValue];
        onChange(newValues.join(', '));
      }
    } else {
      onChange(optionValue === value ? '' : optionValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">
        {label} {required && <span className="text-emerald-500">*</span>}
        {multiSelect && (
          <span className="text-xs text-gray-500 font-normal ml-2 block sm:inline">
            (يمكن اختيار أكثر من واحد)
          </span>
        )}
      </label>
      
      {/* Selected items display for multi-select - Mobile Optimized */}
      {multiSelect && selectedValues.length > 0 && selectedValues[0] !== '' && (
        <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
          {selectedValues.map((selectedValue, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-full"
            >
              <span className="text-sm sm:text-base">
                {options.find(opt => opt.value === selectedValue)?.icon}
              </span>
              <span className="truncate max-w-[100px] sm:max-w-none">
                {selectedValue}
              </span>
              <button
                type="button"
                onClick={() => handleSelect(selectedValue)}
                className="ml-1 text-white hover:text-red-200 font-bold text-sm"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Options Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300
                transform hover:scale-105 hover:shadow-lg active:scale-95
                flex flex-col items-center gap-1.5 sm:gap-2 min-h-[80px] sm:min-h-[100px]
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                    : 'bg-white text-gray-700 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50'
                }
              `}
            >
              <span className="text-lg sm:text-2xl">{option.icon}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">
                {option.label}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-emerald-500 text-xs sm:text-sm font-bold">✓</span>
                </div>
              )}
              {multiSelect && isSelected && (
                <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] sm:text-xs font-bold">×</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};