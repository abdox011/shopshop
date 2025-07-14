import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Type, 
  Move, 
  RotateCcw, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Plus,
  Minus,
  Eye,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Trash2,
  ArrowLeft,
  Home
} from 'lucide-react';
import { downloadAsImage } from '../utils/imageExport';
import { AppSettings } from '../types';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  language: 'en' | 'fr' | 'ar';
  settings: AppSettings;
}

interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  width: number;
}

interface BackgroundTemplate {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  gradient: string;
  preview: string;
  textColor: string;
  isCustom?: boolean;
  imageUrl?: string;
}

const backgroundTemplates: BackgroundTemplate[] = [
  {
    id: 'classic-white',
    name: 'Classic White',
    nameAr: 'أبيض كلاسيكي',
    nameFr: 'Blanc Classique',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    preview: 'bg-white',
    textColor: '#1f2937'
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    nameAr: 'نسيم المحيط',
    nameFr: 'Brise Océanique',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
    preview: 'bg-gradient-to-br from-sky-500 to-blue-600',
    textColor: '#ffffff'
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    nameAr: 'توهج الغروب',
    nameFr: 'Lueur du Coucher',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
    preview: 'bg-gradient-to-br from-orange-500 to-red-600',
    textColor: '#ffffff'
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    nameAr: 'ضباب الغابة',
    nameFr: 'Brume Forestière',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    preview: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    textColor: '#ffffff'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    nameAr: 'بنفسجي ملكي',
    nameFr: 'Violet Royal',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    preview: 'bg-gradient-to-br from-violet-500 to-purple-700',
    textColor: '#ffffff'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    nameAr: 'الساعة الذهبية',
    nameFr: 'Heure Dorée',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    preview: 'bg-gradient-to-br from-yellow-400 to-orange-600',
    textColor: '#1f2937'
  },
  {
    id: 'midnight-sky',
    name: 'Midnight Sky',
    nameAr: 'سماء منتصف الليل',
    nameFr: 'Ciel de Minuit',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)',
    preview: 'bg-gradient-to-br from-slate-800 to-slate-950',
    textColor: '#ffffff'
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    nameAr: 'حديقة الورود',
    nameFr: 'Jardin de Roses',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
    preview: 'bg-gradient-to-br from-pink-400 to-pink-600',
    textColor: '#ffffff'
  }
];

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  description,
  language,
  settings
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BackgroundTemplate>(backgroundTemplates[0]);
  const [customBackgrounds, setCustomBackgrounds] = useState<BackgroundTemplate[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('1');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'backgrounds' | 'text' | 'preview'>('backgrounds');

  // إعادة تعيين البيانات عند فتح المحرر أو تغيير الوصف
  useEffect(() => {
    if (isOpen) {
      // إعادة تعيين القالب إلى الافتراضي
      setSelectedTemplate(backgroundTemplates[0]);
      
      // إعادة تعيين عناصر النص مع الوصف الجديد
      const newTextElement: TextElement = {
        id: '1',
        content: description,
        x: 20,
        y: 60,
        fontSize: 14,
        color: backgroundTemplates[0].textColor,
        fontFamily: 'Inter',
        fontWeight: '400',
        textAlign: 'left',
        width: 280
      };
      
      setTextElements([newTextElement]);
      setSelectedElement('1');
      
      // إعادة تعيين حالة السحب
      setIsDragging(false);
      setDragStart({ x: 0, y: 0 });
      
      // بدء بتبويب المعاينة على الهاتف
      setActiveTab(window.innerWidth < 768 ? 'preview' : 'backgrounds');
    }
  }, [isOpen, description]);

  const getTemplateName = (template: BackgroundTemplate) => {
    switch (language) {
      case 'ar':
        return template.nameAr;
      case 'fr':
        return template.nameFr;
      default:
        return template.name;
    }
  };

  const handleTemplateSelect = (template: BackgroundTemplate) => {
    setSelectedTemplate(template);
    // تحديث لون النص ليتناسب مع القالب
    setTextElements(prev => prev.map(el => ({
      ...el,
      color: template.textColor
    })));
  };

  const handleCustomBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const customTemplate: BackgroundTemplate = {
          id: `custom-${Date.now()}`,
          name: 'Custom Background',
          nameAr: 'خلفية مخصصة',
          nameFr: 'Arrière-plan personnalisé',
          gradient: '',
          preview: '',
          textColor: '#1f2937',
          isCustom: true,
          imageUrl: imageUrl
        };
        
        setCustomBackgrounds(prev => [...prev, customTemplate]);
        setSelectedTemplate(customTemplate);
        
        // تحديث لون النص
        setTextElements(prev => prev.map(el => ({
          ...el,
          color: customTemplate.textColor
        })));
      };
      reader.readAsDataURL(file);
    }
    
    // إعادة تعيين قيمة input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteCustomBackground = (templateId: string) => {
    setCustomBackgrounds(prev => prev.filter(bg => bg.id !== templateId));
    
    // إذا كانت الخلفية المحذوفة هي المحددة، العودة للافتراضية
    if (selectedTemplate.id === templateId) {
      setSelectedTemplate(backgroundTemplates[0]);
      setTextElements(prev => prev.map(el => ({
        ...el,
        color: backgroundTemplates[0].textColor
      })));
    }
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      content: language === 'ar' ? 'نص جديد' : language === 'fr' ? 'Nouveau texte' : 'New Text',
      x: 50,
      y: 150,
      fontSize: 14,
      color: selectedTemplate.textColor,
      fontFamily: 'Inter',
      fontWeight: '400',
      textAlign: 'left',
      width: 200
    };
    setTextElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const deleteTextElement = (id: string) => {
    if (textElements.length > 1) {
      setTextElements(prev => prev.filter(el => el.id !== id));
      setSelectedElement(textElements.find(el => el.id !== id)?.id || '');
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    setSelectedElement(elementId);
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const element = textElements.find(el => el.id === elementId);
      if (element) {
        setDragStart({
          x: e.clientX - rect.left - element.x,
          y: e.clientY - rect.top - element.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left - dragStart.x;
        const y = e.clientY - rect.top - dragStart.y;
        updateTextElement(selectedElement, { 
          x: Math.max(10, Math.min(x, rect.width - 150)), 
          y: Math.max(10, Math.min(y, rect.height - 30)) 
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    setIsDownloading(true);
    try {
      await downloadAsImage('editor-canvas', 'shopshop-custom-design', settings.imageQuality);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedElementData = textElements.find(el => el.id === selectedElement);
  const allBackgrounds = [...backgroundTemplates, ...customBackgrounds];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black z-50 overflow-hidden">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {language === 'ar' ? 'محرر الصور' : language === 'fr' ? 'Éditeur d\'Images' : 'Image Editor'}
            </h1>
          </div>
        </div>
        
        {/* Download Button - Always Visible */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="
            flex items-center gap-2 px-3 sm:px-4 py-2 
            rounded-lg font-bold text-sm text-white
            bg-white/20 hover:bg-white/30
            disabled:bg-white/10
            transition-all duration-300
            active:scale-95
          "
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Téléchargement...' : 'Downloading...'}
              </span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'تحميل' : language === 'fr' ? 'Télécharger' : 'Download'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'preview', icon: Eye, label: language === 'ar' ? 'معاينة' : language === 'fr' ? 'Aperçu' : 'Preview' },
            { id: 'backgrounds', icon: ImageIcon, label: language === 'ar' ? 'خلفيات' : language === 'fr' ? 'Arrière-plans' : 'Backgrounds' },
            { id: 'text', icon: Type, label: language === 'ar' ? 'نص' : language === 'fr' ? 'Texte' : 'Text' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium
                ${activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-full">
        {/* Desktop Sidebar / Mobile Content */}
        <div className={`
          ${activeTab === 'preview' ? 'hidden md:block' : 'block'}
          w-full md:w-80 bg-white shadow-2xl overflow-y-auto
          ${activeTab !== 'preview' ? 'md:block' : ''}
        `}>
          
          {/* Background Templates */}
          {(activeTab === 'backgrounds' || window.innerWidth >= 768) && (
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  {language === 'ar' ? 'خلفيات' : language === 'fr' ? 'Arrière-plans' : 'Backgrounds'}
                </h3>
                
                {/* زر تحميل خلفية مخصصة */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBackgroundUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    title={language === 'ar' ? 'تحميل خلفية من الجهاز' : language === 'fr' ? 'Télécharger arrière-plan' : 'Upload Background'}
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {allBackgrounds.map((template) => (
                  <div key={template.id} className="relative">
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className={`
                        relative h-20 w-full rounded-xl border-2 transition-all duration-300
                        hover:scale-105 hover:shadow-lg overflow-hidden
                        ${selectedTemplate.id === template.id
                          ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-lg'
                          : 'border-gray-200 hover:border-emerald-300'
                        }
                      `}
                      style={{
                        background: template.isCustom && template.imageUrl 
                          ? `url(${template.imageUrl}) center/cover` 
                          : template.gradient,
                      }}
                    >
                      {!template.isCustom && (
                        <div className={`absolute inset-0 flex items-center justify-center ${template.preview}`}>
                          <span className="text-xs font-bold text-center px-2" style={{ color: template.textColor }}>
                            {getTemplateName(template)}
                          </span>
                        </div>
                      )}
                      
                      {template.isCustom && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-white text-center px-2">
                            {getTemplateName(template)}
                          </span>
                        </div>
                      )}
                      
                      {selectedTemplate.id === template.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>
                    
                    {/* زر حذف الخلفيات المخصصة */}
                    {template.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomBackground(template.id);
                        }}
                        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        title={language === 'ar' ? 'حذف الخلفية' : language === 'fr' ? 'Supprimer arrière-plan' : 'Delete Background'}
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Controls */}
          {(activeTab === 'text' || window.innerWidth >= 768) && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Type className="w-5 h-5 text-emerald-600" />
                  {language === 'ar' ? 'النصوص' : language === 'fr' ? 'Textes' : 'Text Elements'}
                </h3>
                <button
                  onClick={addTextElement}
                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Text Element List */}
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {textElements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedElement === element.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                      }
                    `}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'ar' ? `نص ${index + 1}` : language === 'fr' ? `Texte ${index + 1}` : `Text ${index + 1}`}
                      </span>
                      {textElements.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTextElement(element.id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {element.content.substring(0, 30)}...
                    </p>
                  </div>
                ))}
              </div>

              {/* Text Editor */}
              {selectedElementData && (
                <div className="space-y-4">
                  {/* Content */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {language === 'ar' ? 'المحتوى' : language === 'fr' ? 'Contenu' : 'Content'}
                    </label>
                    <textarea
                      value={selectedElementData.content}
                      onChange={(e) => updateTextElement(selectedElement, { content: e.target.value })}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 resize-none text-sm"
                      rows={4}
                    />
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {language === 'ar' ? 'حجم الخط' : language === 'fr' ? 'Taille de police' : 'Font Size'}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTextElement(selectedElement, { fontSize: Math.max(8, selectedElementData.fontSize - 1) })}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 bg-gray-50 rounded-lg font-bold min-w-[60px] text-center text-sm">
                        {selectedElementData.fontSize}px
                      </span>
                      <button
                        onClick={() => updateTextElement(selectedElement, { fontSize: Math.min(32, selectedElementData.fontSize + 1) })}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {language === 'ar' ? 'لون النص' : language === 'fr' ? 'Couleur du texte' : 'Text Color'}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={selectedElementData.color}
                        onChange={(e) => updateTextElement(selectedElement, { color: e.target.value })}
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElementData.color}
                        onChange={(e) => updateTextElement(selectedElement, { color: e.target.value })}
                        className="flex-1 p-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {language === 'ar' ? 'محاذاة النص' : language === 'fr' ? 'Alignement du texte' : 'Text Alignment'}
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'left', icon: AlignLeft },
                        { value: 'center', icon: AlignCenter },
                        { value: 'right', icon: AlignRight }
                      ].map(({ value, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => updateTextElement(selectedElement, { textAlign: value as any })}
                          className={`
                            flex-1 p-3 rounded-lg border-2 transition-all
                            ${selectedElementData.textAlign === value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Weight */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {language === 'ar' ? 'سمك الخط' : language === 'fr' ? 'Épaisseur de police' : 'Font Weight'}
                    </label>
                    <select
                      value={selectedElementData.fontWeight}
                      onChange={(e) => updateTextElement(selectedElement, { fontWeight: e.target.value })}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-sm"
                    >
                      <option value="300">Light</option>
                      <option value="400">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi Bold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra Bold</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className={`
          ${activeTab === 'preview' ? 'block' : 'hidden md:block'}
          flex-1 flex flex-col bg-gray-100 overflow-hidden
        `}>
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  {language === 'ar' ? 'معاينة مباشرة' : language === 'fr' ? 'Aperçu en Direct' : 'Live Preview'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Move className="w-3 h-3" />
                  {language === 'ar' ? 'اسحب النصوص' : language === 'fr' ? 'Glissez les textes' : 'Drag texts'}
                </div>
              </div>

              {/* Canvas */}
              <div
                id="editor-canvas"
                ref={canvasRef}
                className="relative w-full rounded-xl border-2 border-gray-200 overflow-hidden cursor-crosshair"
                style={{ 
                  height: '400px',
                  background: selectedTemplate.isCustom && selectedTemplate.imageUrl 
                    ? `url(${selectedTemplate.imageUrl}) center/cover` 
                    : selectedTemplate.gradient 
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {textElements.map((element) => (
                  <div
                    key={element.id}
                    className={`
                      absolute cursor-move select-none transition-all duration-200
                      ${selectedElement === element.id ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''}
                    `}
                    style={{
                      left: element.x,
                      top: element.y,
                      fontSize: element.fontSize,
                      color: element.color,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      textAlign: element.textAlign,
                      width: Math.min(element.width, 280),
                      lineHeight: 1.4,
                      padding: '6px',
                      borderRadius: selectedElement === element.id ? '6px' : '0',
                      backgroundColor: selectedElement === element.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      maxWidth: 'calc(100% - 20px)',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {element.content}
                    </pre>
                  </div>
                ))}

                {/* Grid overlay when dragging */}
                {isDragging && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full opacity-20" style={{
                      backgroundImage: `
                        linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                )}
              </div>

              {/* Canvas Info */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span>
                    {language === 'ar' ? 'القالب:' : language === 'fr' ? 'Modèle:' : 'Template:'} {getTemplateName(selectedTemplate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  <span>{textElements.length} {language === 'ar' ? 'عناصر' : language === 'fr' ? 'éléments' : 'elements'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};