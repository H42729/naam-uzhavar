/**
 * Product & Harvest Service
 * Connects frontend directly to MongoDB backend /api/v1/products
 */

import apiClient, { API_BASE_URL } from './apiClient.js';

const serverHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('/api')) {
    return `${serverHost}${url}`;
  }
  return url;
}

export const productService = {
  /**
   * Fetch list of available products from backend MongoDB
   * GET /api/v1/products
   */
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', {
        params: { limit: 100, ...params }
      });
      const products = response.data?.data || response.data?.products || response.data;
      if (Array.isArray(products)) {
        return products.map((p) => ({
          ...p,
          id: p._id || p.id,
          crop: p.crop || p.name,
          price: p.price ?? p.pricePerKg ?? 25,
          mandiPrice: p.mandiPrice ?? 32,
          quantity: p.quantity,
          location: p.location || 'Dindigul',
          image: resolveImageUrl(p.image || p.images?.[0]),
          images: Array.isArray(p.images) && p.images.length > 0
            ? p.images.map(resolveImageUrl)
            : [resolveImageUrl(p.image)]
        }));
      }
    } catch (err) {
      console.warn('Error fetching products from server:', err.message);
    }
    return [];
  },

  /**
   * Fetch single product by ID
   * GET /api/v1/products/:id
   */
  async getProductById(id) {
    if (!id) return null;
    try {
      const response = await apiClient.get(`/products/${id}`);
      const product = response.data?.data || response.data?.product || response.data;
      if (product) {
        return {
          ...product,
          id: product._id || product.id,
          crop: product.crop || product.name,
          price: product.price ?? product.pricePerKg,
          mandiPrice: product.mandiPrice ?? 30,
          image: resolveImageUrl(product.image || product.images?.[0]),
          images: Array.isArray(product.images) && product.images.length > 0
            ? product.images.map(resolveImageUrl)
            : [resolveImageUrl(product.image)]
        };
      }
    } catch (err) {
      console.warn(`Error fetching product ${id}:`, err.message);
    }
    return null;
  },

  /**
   * Create a new harvest product listing (Farmer role)
   * POST /api/v1/products
   */
  async createProduct(productData) {
    const rawImages = productData.images || (productData.image ? [productData.image] : []);
    const payload = {
      crop: productData.cropName || productData.name || productData.crop,
      tamilName: productData.tamilName || '',
      category: productData.category || 'Vegetables',
      quantity: Number(productData.quantity) || 100,
      unit: productData.unit || 'kg',
      price: Number(productData.pricePerKg || productData.price) || 25,
      mandiPrice: Number(productData.mandiPrice) || 0,
      location: productData.location || 'Dindigul',
      farmAddress: productData.farmAddress || productData.location || 'Dindigul, Tamil Nadu',
      grade: productData.grade || 'Grade A Premium',
      organicStatus: productData.organicStatus || 'Naturally Grown',
      shelfLife: productData.shelfLife || '7 - 10 Days',
      minOrder: Number(productData.minOrder) || 10,
      description: productData.description || '',
      image: rawImages[0] || '',
      images: rawImages
    };

    const response = await apiClient.post('/products', payload);
    const created = response.data?.data || response.data?.product || response.data;
    return {
      ...created,
      id: created._id || created.id,
      image: resolveImageUrl(created.image),
      images: (created.images || []).map(resolveImageUrl)
    };
  }
};

export default productService;
