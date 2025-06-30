import { GeneratedDescription } from '../types';

const STORAGE_KEY = 'shopshop_descriptions';

export const saveDescription = (description: GeneratedDescription): void => {
  const existing = getSavedDescriptions();
  const updated = [description, ...existing].slice(0, 50); // Keep only last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getSavedDescriptions = (): GeneratedDescription[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const clearSavedDescriptions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteDescription = (id: string): void => {
  const existing = getSavedDescriptions();
  const filtered = existing.filter(desc => desc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateDescription = (id: string, updatedDescription: GeneratedDescription): void => {
  const existing = getSavedDescriptions();
  const updated = existing.map(desc => 
    desc.id === id ? updatedDescription : desc
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};