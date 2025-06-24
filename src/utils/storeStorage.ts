// Local storage utilities for managing generated stores

export interface StoreData {
  id: string;
  name: string;
  tagline: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
  }>;
  content: {
    about: string;
    hero: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
  };
  createdAt: string;
  originalPrompt: string;
}

const STORAGE_KEY = 'ai_store_builder_stores';

// Get all stored stores
export function getStoredStores(): StoreData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stored stores:', error);
    return [];
  }
}

// Save a new store
export function saveStore(store: StoreData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existingStores = getStoredStores();
    const updatedStores = [store, ...existingStores.filter(s => s.id !== store.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStores));
  } catch (error) {
    console.error('Error saving store:', error);
  }
}

// Delete a store
export function deleteStore(storeId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existingStores = getStoredStores();
    const updatedStores = existingStores.filter(s => s.id !== storeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStores));
  } catch (error) {
    console.error('Error deleting store:', error);
  }
}

// Get a specific store by ID
export function getStoreById(storeId: string): StoreData | null {
  const stores = getStoredStores();
  return stores.find(s => s.id === storeId) || null;
}

// Clear all stored stores
export function clearAllStores(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stores:', error);
  }
}