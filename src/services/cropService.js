import apiClient, { API_BASE_URL } from './apiClient.js';

const serverHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('/api')) {
    return `${serverHost}${url}`;
  }
  return url;
}

export const cropService = {
  /**
   * Fetch master horticulture crops catalog from MongoDB
   * GET /api/v1/crops
   */
  async getCrops(params = {}) {
    try {
      const response = await apiClient.get('/crops', { params });
      const crops = response.data?.data || response.data?.crops || response.data;
      if (Array.isArray(crops)) {
        return crops.map((c) => ({
          ...c,
          id: c.slug || c._id || c.id,
          image: resolveImageUrl(c.image)
        }));
      }
    } catch (err) {
      console.warn('Error fetching crops from server:', err.message);
    }
    return [];
  },

  /**
   * Fetch single crop by ID or slug
   * GET /api/v1/crops/:id
   */
  async getCropById(idOrSlug) {
    try {
      const response = await apiClient.get(`/crops/${idOrSlug}`);
      const crop = response.data?.data || response.data?.crop || response.data;
      if (crop) {
        return {
          ...crop,
          id: crop.slug || crop._id || crop.id,
          image: resolveImageUrl(crop.image)
        };
      }
    } catch (err) {
      console.warn(`Error fetching crop ${idOrSlug}:`, err.message);
    }
    return null;
  }
};

export default cropService;
