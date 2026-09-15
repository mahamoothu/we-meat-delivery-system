import React, { createContext, useContext, useState } from 'react';
import { Product, ProductFormData } from '../types/shop';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface ProductContextType {
  products: Product[];
  addProduct: (formData: ProductFormData) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (formData: ProductFormData): Product => {
    const randomId = `prod_${Date.now()}`;
    const newProduct: Product = {
      id: randomId,
      name: formData.name.trim(),
      tagline: formData.tagline?.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      weight: formData.weight.trim(),
      pieces: formData.pieces?.trim(),
      serves: formData.serves?.trim(),
      cookingTime: formData.cookingTime?.trim(),
      isAvailable: formData.isAvailable,
      isBestseller: false,
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p)));
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleAvailability,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export function useProduct(): ProductContextType {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
