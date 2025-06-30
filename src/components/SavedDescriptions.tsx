import React, { useState } from 'react';
import { Trash2, Copy, Calendar, Eye, Edit3, X, Check } from 'lucide-react';
import { GeneratedDescription } from '../types';

interface SavedDescriptionsProps {
  descriptions: GeneratedDescription[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onUpdate: (id: string, updatedDescription: GeneratedDescription) => void;
  translations: any;
}

export const SavedDescriptions: React.FC<SavedDescriptionsProps> = ({
  descriptions,
  onDelete,
  onClear,
  onUpdate,
  translations,
}) => {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleCopy = async (description: string) => {
    try {
      await navigator.clipboard.writeText(description);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleView = (id: string) => {
    setViewingId(viewingId === id ? null : id);
    setEditingId(null);
  };

  const handleEdit = (desc: GeneratedDescription) => {
    setEditingId(desc.id);
    setEditText(desc.description);
    setViewingId(null);
  };

  const handleSaveEdit = (desc: GeneratedDescription) => {
    const updatedDesc = {
      ...desc,
      description: editText,
    };
    onUpdate(desc.id, updatedDesc);
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  if (descriptions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-emerald-100 p-4 sm:p-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl">
            <span className="text-lg sm:text-2xl text-white">💾</span>
          </div>
          <span className="text-xl sm:text-3xl">
            {translations.savedDescriptions} ({descriptions.length})
          </span>
        </h2>
        <button
          onClick={onClear}
          className="
            px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-red-600 
            hover:bg-red-50 border-2 border-red-200 hover:border-red-300
            transition-all duration-200 hover:scale-105 active:scale-95
            self-start sm:self-auto
          "
        >
          {translations.clearAll}
        </button>
      </div>
      
      <div className="space-y-4 sm:space-y-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
        {descriptions.map((desc) => (
          <div
            key={desc.id}
            className="
              rounded-xl sm:rounded-2xl border-2 border-emerald-100
              bg-gradient-to-r from-emerald-50 to-teal-50
              hover:shadow-lg hover:border-emerald-200 transition-all duration-300
              overflow-hidden
            "
          >
            {/* Header - Mobile Optimized */}
            <div className="p-4 sm:p-6 border-b border-emerald-200/50">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-base sm:text-lg font-bold text-gray-800 truncate">
                      {desc.item.brand} {desc.item.type}
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-200 rounded-full self-start">
                      {desc.language.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
                    {desc.description.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                    {new Date(desc.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Action Buttons - Mobile Optimized */}
                <div className="flex gap-1 sm:gap-2 self-start">
                  <button
                    onClick={() => handleView(desc.id)}
                    className="
                      p-2 sm:p-3 rounded-lg sm:rounded-xl text-blue-600
                      hover:bg-blue-100 hover:text-blue-700
                      transition-all duration-200 hover:scale-110 active:scale-95
                    "
                    title="عرض"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(desc)}
                    className="
                      p-2 sm:p-3 rounded-lg sm:rounded-xl text-purple-600
                      hover:bg-purple-100 hover:text-purple-700
                      transition-all duration-200 hover:scale-110 active:scale-95
                    "
                    title="تعديل"
                  >
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleCopy(desc.description)}
                    className="
                      p-2 sm:p-3 rounded-lg sm:rounded-xl text-emerald-600
                      hover:bg-emerald-100 hover:text-emerald-700
                      transition-all duration-200 hover:scale-110 active:scale-95
                    "
                    title="نسخ"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(desc.id)}
                    className="
                      p-2 sm:p-3 rounded-lg sm:rounded-xl text-red-500
                      hover:bg-red-100 hover:text-red-600
                      transition-all duration-200 hover:scale-110 active:scale-95
                    "
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* View Mode - Mobile Optimized */}
            {viewingId === desc.id && (
              <div className="p-4 sm:p-6 bg-white/70 border-t border-emerald-200/50">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-emerald-100">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    الوصف الكامل
                  </h4>
                  <div 
                    className="prose prose-gray max-w-none"
                    dir={desc.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-xs sm:text-sm">
                      {desc.description}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode - Mobile Optimized */}
            {editingId === desc.id && (
              <div className="p-4 sm:p-6 bg-white/70 border-t border-emerald-200/50">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-emerald-100">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                    تعديل الوصف
                  </h4>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="
                      w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-emerald-200
                      bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-base
                      focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
                      transition-all duration-200 resize-none
                      font-sans leading-relaxed
                    "
                    dir={desc.language === 'ar' ? 'rtl' : 'ltr'}
                    placeholder="قم بتعديل الوصف هنا..."
                  />
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <button
                      onClick={() => handleSaveEdit(desc)}
                      className="
                        flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 
                        rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white
                        bg-gradient-to-r from-emerald-500 to-teal-500 
                        hover:from-emerald-600 hover:to-teal-600
                        transition-all duration-200 hover:scale-105 active:scale-95
                      "
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      حفظ التعديل
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="
                        flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 
                        rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-gray-600
                        bg-gray-100 hover:bg-gray-200 border-2 border-gray-200
                        transition-all duration-200 hover:scale-105 active:scale-95
                      "
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};