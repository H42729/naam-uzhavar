import apiClient, { API_BASE_URL } from './apiClient.js';

const serverHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('/api')) {
    return `${serverHost}${url}`;
  }
  return url;
}

export const requestService = {
  /**
   * Fetch buyer's procurement proposals
   * GET /api/v1/requests/buyer
   */
  async getBuyerRequests(params = {}) {
    try {
      const response = await apiClient.get('/requests/buyer', { params });
      const records = response.data?.data || response.data?.requests || response.data;
      if (Array.isArray(records)) {
        return records.map((r) => ({
          ...r,
          id: r._id || r.id,
          productImage: resolveImageUrl(r.productImage)
        }));
      }
    } catch (err) {
      console.warn('Error fetching buyer requests from server:', err.message);
    }
    return [];
  },

  /**
   * Fetch farmer's received procurement requests
   * GET /api/v1/requests/farmer
   */
  async getFarmerRequests(params = {}) {
    try {
      const response = await apiClient.get('/requests/farmer', { params });
      const records = response.data?.data || response.data?.requests || response.data;
      if (Array.isArray(records)) {
        return records.map((r) => ({
          ...r,
          id: r._id || r.id,
          productImage: resolveImageUrl(r.productImage)
        }));
      }
    } catch (err) {
      console.warn('Error fetching farmer requests from server:', err.message);
    }
    return [];
  },

  /**
   * Fetch single request detail
   * GET /api/v1/requests/:id
   */
  async getRequestById(id) {
    try {
      const response = await apiClient.get(`/requests/${id}`);
      const request = response.data?.data || response.data?.request || response.data;
      if (request) {
        return {
          ...request,
          id: request._id || request.id,
          productImage: resolveImageUrl(request.productImage)
        };
      }
    } catch (err) {
      console.warn(`Error fetching request ${id}:`, err.message);
    }
    return null;
  },

  /**
   * Create procurement proposal (Buyer)
   * POST /api/v1/requests
   */
  async createRequest(requestData) {
    const response = await apiClient.post('/requests', requestData);
    const created = response.data?.data || response.data?.request || response.data;
    return {
      ...created,
      id: created._id || created.id,
      productImage: resolveImageUrl(created.productImage)
    };
  },

  /**
   * Accept or decline a procurement request (Farmer)
   * POST /api/v1/requests/:id/respond
   */
  async respondToRequest(id, decision, message = '', rejectionReason = '') {
    const response = await apiClient.post(`/requests/${id}/respond`, {
      decision,
      message,
      rejectionReason
    });
    const updated = response.data?.data || response.data?.request || response.data;
    return {
      ...updated,
      id: updated._id || updated.id
    };
  }
};

export default requestService;
