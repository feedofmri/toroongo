import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services';
import { api } from '../services/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [heroBanners, setHeroBanners] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial load of all data from backend
    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [productsData, categoriesData, sellersData, bannersData] = await Promise.all([
                productService.getAllProducts(),
                api('/system/categories'),
                api('/users/sellers'),
                api('/system/hero-banners')
            ]);

            // Map snake_case API fields to camelCase
            const mappedProducts = productsData.map(p => ({
                ...p,
                imageUrl: p.image_url || p.imageUrl,
                originalPrice: p.original_price || p.originalPrice,
                sellerId: p.seller_id || p.sellerId,
                seller: p.seller_name || p.seller,
                sellerVerified: p.seller_verified || p.sellerVerified,
                metaDescription: p.meta_description || p.metaDescription,
            }));

            const mappedSellers = sellersData.map(s => ({
                ...s,
                storeName: s.store_name || s.name,
                totalProducts: s.products_count ?? s.total_products ?? 0,
                brandColor: s.brand_color,
                joinedDate: s.joined_date || s.created_at,
                isVerified: s.is_verified || s.isVerified,
            }));

            const mappedCategories = categoriesData.map(c => ({
                ...c,
                productCount: c.productCount ?? c.product_count ?? 0,
            }));

            setProducts(mappedProducts);
            setCategories(mappedCategories);
            setSellers(mappedSellers);
            setHeroBanners(bannersData);
            setFilteredProducts(mappedProducts);
        } catch (err) {
            setError('Failed to load data from backend');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const refreshData = () => {
        loadData();
    };

    const getProduct = async (id) => {
        const localMatch = products.find(p => String(p.id) === String(id));
        if (localMatch) return localMatch;
        return await productService.getProductById(id);
    };

    return (
        <ProductContext.Provider value={{
            products,
            categories,
            sellers,
            heroBanners,
            filteredProducts,
            setFilteredProducts,
            isLoading,
            error,
            refreshProducts: refreshData,
            getProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProduct = () => useContext(ProductContext);
