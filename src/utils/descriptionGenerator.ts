import { ClothingItem } from '../types';

const defaultTemplates = {
  en: {
    empty: () => `
✨ Fashion Item Description Card

🔹 Product Details:
• Style: Versatile Fashion Piece
• Quality: Premium Selection
• Design: Modern & Elegant
• Versatility: Multi-Occasion Wear

🔹 Description:
This carefully curated fashion piece represents the perfect blend of style and functionality. Designed with attention to detail and crafted for the modern wardrobe, this item offers endless styling possibilities.

Whether you're dressing up for a special occasion or creating a casual everyday look, this piece adapts beautifully to your personal style. The timeless design ensures it will remain a staple in your wardrobe for years to come.

Perfect for fashion enthusiasts who appreciate quality and style. This piece embodies the essence of contemporary fashion while maintaining classic appeal.

💰 Excellent value for a quality fashion piece
📦 Ready to enhance your wardrobe
🌟 Style meets functionality

#Fashion #Style #Wardrobe #Quality #Modern
    `.trim(),
  },
  
  fr: {
    empty: () => `
✨ Carte de Description d'Article de Mode

🔹 Détails du produit:
• Style: Pièce de Mode Polyvalente
• Qualité: Sélection Premium
• Design: Moderne & Élégant
• Polyvalence: Tenue Multi-Occasions

🔹 Description:
Cette pièce de mode soigneusement sélectionnée représente le mélange parfait entre style et fonctionnalité. Conçue avec attention aux détails et créée pour la garde-robe moderne, cet article offre des possibilités de style infinies.

Que vous vous habilliez pour une occasion spéciale ou que vous créiez un look décontracté quotidien, cette pièce s'adapte magnifiquement à votre style personnel. Le design intemporel garantit qu'elle restera un élément de base de votre garde-robe pendant des années.

Parfait pour les passionnés de mode qui apprécient la qualité et le style. Cette pièce incarne l'essence de la mode contemporaine tout en conservant un attrait classique.

💰 Excellent rapport qualité-prix pour une pièce de mode de qualité
📦 Prêt à améliorer votre garde-robe
🌟 Le style rencontre la fonctionnalité

#Mode #Style #GardeRobe #Qualité #Moderne
    `.trim(),
  },
  
  ar: {
    empty: () => `
✨ بطاقة وصف قطعة أزياء

🔹 تفاصيل المنتج:
• الستايل: قطعة أزياء متعددة الاستخدامات
• الجودة: اختيار مميز
• التصميم: عصري وأنيق
• التنوع: مناسب لمختلف المناسبات

🔹 الوصف:
هذه القطعة المختارة بعناية تمثل المزيج المثالي بين الأناقة والعملية. مصممة بعناية فائقة ومصنوعة لخزانة الملابس العصرية، تقدم هذه القطعة إمكانيات لا محدودة للتنسيق.

سواء كنت تتأنق لمناسبة خاصة أو تنشئ إطلالة يومية عادية، تتكيف هذه القطعة بشكل رائع مع أسلوبك الشخصي. التصميم الخالد يضمن أنها ستبقى عنصراً أساسياً في خزانة ملابسك لسنوات قادمة.

مثالية لعشاق الموضة الذين يقدرون الجودة والأناقة. هذه القطعة تجسد جوهر الموضة المعاصرة مع الحفاظ على الجاذبية الكلاسيكية.

💰 قيمة ممتازة لقطعة أزياء عالية الجودة
📦 جاهزة لتحسين خزانة ملابسك
🌟 الأناقة تلتقي بالعملية

#أزياء #ستايل #خزانة_ملابس #جودة #عصري
    `.trim(),
  },
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

const generateDeliverySection = (item: ClothingItem, language: 'en' | 'fr' | 'ar'): string => {
  if (!item.deliveryAvailable) return '';

  const currencySymbol = getCurrencySymbol(item.currency);

  const deliveryTexts = {
    en: {
      title: '🚚 Delivery Information:',
      cityDelivery: `• ${item.deliveryCity}: ${item.deliveryCityPrice} ${currencySymbol}`,
      otherCities: `• Other Cities: ${item.otherCitiesPrice} ${currencySymbol}`,
      available: '• Delivery Available',
      fast: '• Fast & Reliable Shipping',
      secure: '• Secure Packaging'
    },
    fr: {
      title: '🚚 Informations de Livraison:',
      cityDelivery: `• ${item.deliveryCity}: ${item.deliveryCityPrice} ${currencySymbol}`,
      otherCities: `• Autres Villes: ${item.otherCitiesPrice} ${currencySymbol}`,
      available: '• Livraison Disponible',
      fast: '• Expédition Rapide et Fiable',
      secure: '• Emballage Sécurisé'
    },
    ar: {
      title: '🚚 معلومات التوصيل:',
      cityDelivery: `• ${item.deliveryCity}: ${item.deliveryCityPrice} ${currencySymbol}`,
      otherCities: `• باقي المدن: ${item.otherCitiesPrice} ${currencySymbol}`,
      available: '• التوصيل متوفر',
      fast: '• شحن سريع وموثوق',
      secure: '• تغليف آمن'
    }
  };

  const texts = deliveryTexts[language];
  let deliverySection = `\n\n${texts.title}\n`;
  
  if (item.deliveryCity && item.deliveryCityPrice) {
    deliverySection += `${texts.cityDelivery}\n`;
  }
  
  if (item.otherCitiesPrice) {
    deliverySection += `${texts.otherCities}\n`;
  }
  
  if (!item.deliveryCity && !item.deliveryCityPrice && !item.otherCitiesPrice) {
    deliverySection += `${texts.available}\n`;
  }
  
  deliverySection += `${texts.fast}\n${texts.secure}`;
  
  return deliverySection;
};

const templates = {
  en: {
    basic: (item: ClothingItem) => {
      const currencySymbol = getCurrencySymbol(item.currency);
      return `
${item.brand ? `${item.brand} ` : ''}${item.type} in ${item.color} | Size ${item.size}

📏 Size: ${item.size}
🎨 Color: ${item.color}
🧵 Material: ${item.fabric}
✨ Condition: ${item.condition}
🌟 Season: ${item.season}
👥 Category: ${item.category}
${item.brand ? `🏷️ Brand: ${item.brand}\n` : ''}${item.price ? `💰 Price: ${item.price} ${currencySymbol}\n` : ''}
${item.notes ? `📝 Additional Details: ${item.notes}\n` : ''}
Perfect for ${item.season.toLowerCase()} wear and everyday styling. This ${item.type.toLowerCase()} offers comfort and style in one package.
${generateDeliverySection(item, 'en')}

#Fashion #${item.type.replace(/\s+/g, '')} #Style #Clothing
      `.trim();
    },
    
    professional: (item: ClothingItem) => {
      const currencySymbol = getCurrencySymbol(item.currency);
      return `
✨ ${item.brand ? `${item.brand} ` : ''}${item.type} - ${item.color} 

🔹 Product Details:
• Size: ${item.size}
• Color: ${item.color}
• Fabric: ${item.fabric}
• Condition: ${item.condition}
• Season: ${item.season}
• Category: ${item.category}
${item.brand ? `• Brand: ${item.brand}\n` : ''}${item.price ? `• Price: ${item.price} ${currencySymbol}\n` : ''}
${item.notes ? `• Special Features: ${item.notes}\n` : ''}
🔹 Description:
This premium ${item.type.toLowerCase()} combines quality craftsmanship with timeless style. Made from high-quality ${item.fabric.toLowerCase()}, it offers both durability and comfort. The ${item.color.toLowerCase()} color${item.color.includes(',') ? 's make' : ' makes'} it versatile for various occasions, perfect for ${item.season.toLowerCase()} wear.

Designed for ${item.category.toLowerCase()}, this piece represents excellent value for quality fashion.
${generateDeliverySection(item, 'en')}

💰 ${item.price ? `Priced at ${item.price} ${currencySymbol} - ` : ''}Excellent value for a quality piece
📦 Ready to ship
🌟 Customer satisfaction guaranteed

#QualityClothing #${item.type.replace(/\s+/g, '')} #PremiumFashion #${item.season.replace(/\s+/g, '')}
      `.trim();
    },
  },
  
  fr: {
    basic: (item: ClothingItem) => {
      const currencySymbol = getCurrencySymbol(item.currency);
      return `
${item.brand ? `${item.brand} ` : ''}${item.type} en ${item.color} | Taille ${item.size}

📏 Taille: ${item.size}
🎨 Couleur: ${item.color}
🧵 Matière: ${item.fabric}
✨ État: ${item.condition}
🌟 Saison: ${item.season}
👥 Catégorie: ${item.category}
${item.brand ? `🏷️ Marque: ${item.brand}\n` : ''}${item.price ? `💰 Prix: ${item.price} ${currencySymbol}\n` : ''}
${item.notes ? `📝 Détails supplémentaires: ${item.notes}\n` : ''}
Parfait pour le porter ${item.season.toLowerCase()} et le style quotidien. Ce ${item.type.toLowerCase()} offre confort et style en un seul ensemble.
${generateDeliverySection(item, 'fr')}

#Mode #${item.type.replace(/\s+/g, '')} #Style #Vêtements
      `.trim();
    },
    
    professional: (item: ClothingItem) => {
      const currencySymbol = getCurrencySymbol(item.currency);
      return `
✨ ${item.brand ? `${item.brand} ` : ''}${item.type} - ${item.color}

🔹 Détails du produit:
• Taille: ${item.size}
• Couleur: ${item.color}
• Tissu: ${item.fabric}
• État: ${item.condition}
• Saison: ${item.season}
• Catégorie: ${item.category}
${item.brand ? `• Marque: ${item.brand}\n` : ''}${item.price ? `• Prix: ${item.price} ${currencySymbol}\n` : ''}
${item.notes ? `• Caractéristiques spéciales: ${item.notes}\n` : ''}
🔹 Description:
Ce ${item.type.toLowerCase()} haut de gamme combine un savoir-faire de qualité avec un style intemporel. Fabriqué en ${item.fabric.toLowerCase()} de haute qualité, il offre à la fois durabilité et confort. La couleur ${item.color.toLowerCase()} le rend polyvalent pour diverses occasions, parfait pour la saison ${item.season.toLowerCase()}.

Conçu pour ${item.category.toLowerCase()}, cette pièce représente un excellent rapport qualité-prix.
${generateDeliverySection(item, 'fr')}

💰 ${item.price ? `Prix: ${item.price} ${currencySymbol} - ` : ''}Excellent rapport qualité-prix
📦 Prêt à expédier
🌟 Satisfaction client garantie

#VêtementsQualité #${item.type.replace(/\s+/g, '')} #ModePremium #${item.season.replace(/\s+/g, '')}
      `.trim();
    },
  },
  
  ar: {
    basic: (item: ClothingItem) => {
      const currencySymbol = getCurrencySymbol(item.currency);
      return `
${item.brand ? `${item.brand} ` : ''}${item.type} باللون ${item.color} | المقاس ${item.size}

📏 المقاس: ${item.size}
🎨 اللون: ${item.color}
🧵 القماش: ${item.fabric}
✨ الحالة: ${item.condition}
🌟 الموسم: ${item.season}
👥 الفئة: ${item.category}
${item.brand ? `🏷️ الماركة: ${item.brand}\n` : ''}${item.price ? `💰 السعر: ${item.price} ${currencySymbol}\n` : ''}
${item.notes ? `📝 تفاصيل إضافية: ${item.notes}\n` : ''}
مثالي للارتداء ${item.season} والأناقة العصرية. هذا ${item.type} يوفر الراحة والأناقة في قطعة واحدة.
${generateDeliverySection(item, 'ar')}

#أزياء #${item.type.replace(/\s+/g, '')} #ستايل #ملابس
      `.trim();
    },
    
    professional: (item: ClothingItem) => {
      const currencySymbol = getCurrencySymbol(item.currency);
      return `
✨ ${item.brand ? `${item.brand} ` : ''}${item.type} - ${item.color}

🔹 تفاصيل المنتج:
• المقاس: ${item.size}
• اللون: ${item.color}
• نوع القماش: ${item.fabric}  
• الحالة: ${item.condition}
• الموسم: ${item.season}
• الفئة: ${item.category}
${item.brand ? `• الماركة: ${item.brand}\n` : ''}${item.price ? `• السعر: ${item.price} ${currencySymbol}\n` : ''}
${item.notes ? `• ميزات خاصة: ${item.notes}\n` : ''}
🔹 الوصف:
هذا ${item.type} الفاخر يجمع بين الجودة العالية والأناقة الخالدة. مصنوع من ${item.fabric} عالي الجودة، يوفر المتانة والراحة معاً. اللون ${item.color} يجعله متناسقاً مع مختلف المناسبات، مثالي للموسم ${item.season}.

مصمم لفئة ${item.category}، هذه القطعة تمثل قيمة ممتازة للأزياء عالية الجودة.
${generateDeliverySection(item, 'ar')}

💰 ${item.price ? `السعر: ${item.price} ${currencySymbol} - ` : ''}قيمة ممتازة مقابل قطعة عالية الجودة
📦 جاهز للشحن
🌟 ضمان رضا العملاء

#ملابس_جودة #${item.type.replace(/\s+/g, '')} #أزياء_فاخرة #${item.season.replace(/\s+/g, '')}
      `.trim();
    },
  },
};

const hasAnyData = (item: ClothingItem): boolean => {
  return Object.values(item).some(value => {
    if (typeof value === 'boolean') return false; // تجاهل القيم البوليانية
    return value && value.toString().trim() !== '' && value !== 'USD';
  });
};

export const generateDescription = (item: ClothingItem, language: 'en' | 'fr' | 'ar', template: 'basic' | 'professional' = 'professional'): string => {
  // If no data is provided, return a beautiful default template
  if (!hasAnyData(item)) {
    return defaultTemplates[language].empty();
  }
  
  // If some data is provided, use the regular templates
  return templates[language][template](item);
};