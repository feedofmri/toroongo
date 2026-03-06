import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial load of all products
    const loadProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Helper function to re-fetch when products change (e.g., from seller dashboard)
    const refreshProducts = () => {
        loadProducts();
    };

    const getProduct = async (id) => {
        // Attempt sync retrieval from local state first
        const localMatch = products.find(p => p.id === id);
        if (localMatch) return localMatch;
        // Fallback to async retrieval
        return await productService.getProductById(id);
    };

    return (
        <ProductContext.Provider value={{
            products,
            filteredProducts,
            setFilteredProducts,
            isLoading,
            error,
            refreshProducts,
            getProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProduct = () => useContext(ProductContext);
