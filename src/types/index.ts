export interface ClothingItem {
  type: string;
  size: string;
  color: string;
  fabric: string;
  condition: string;
  brand: string;
  notes: string;
  season: string;
  category: string;
  price: string;
  currency: string;
  // حقول التوصيل الجديدة
  deliveryAvailable: boolean;
  deliveryCity: string;
  deliveryCityPrice: string;
  otherCitiesPrice: string;
}

export interface Language {
  code: 'en' | 'fr' | 'ar';
  name: string;
  flag: string;
}

export interface GeneratedDescription {
  id: string;
  description: string;
  item: ClothingItem;
  language: Language['code'];
  createdAt: Date;
}

export interface FormOptions {
  types: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  fabrics: string[];
  conditions: string[];
  seasons: string[];
  categories: string[];
  currencies: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultCurrency: string;
  defaultTemplate: 'basic' | 'professional';
  imageQuality: 'low' | 'medium' | 'high';
  exportFormat: 'png' | 'pdf' | 'text';
  cardBackgroundColor: string;
  cardTextColor: string;
  displayStyle: 'modern' | 'classic' | 'minimal';
  autoSave: boolean;
  showBranding: boolean;
}