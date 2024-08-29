import React, { createContext, useState, useContext, ReactNode } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

interface ProductContextType {
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
  comparedProducts: Product[];
  setComparedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [compareList, setCompareList] = useState<number[]>([]);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  return (
    <ProductContext.Provider
      value={{
        compareList,
        setCompareList,
        comparedProducts,
        setComparedProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
