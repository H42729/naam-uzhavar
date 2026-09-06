import apiClient, { API_BASE_URL } from './apiClient.js';

export const imageService = {
  /**
   * Upload an image file (File or Blob) to MongoDB
   * Sends base64 payload to POST /api/v1/images/upload
   * @param {File|Blob} file
   * @returns {Promise<string>} Fully qualified or relative MongoDB image URL
   */
  async uploadImage(file) {
    if (!file) throw new Error('No image file provided');

    // Convert file to base64 Data URL
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const response = await apiClient.post('/images/upload', {
      data: base64Data,
      filename: file.name || `photo-${Date.now()}.jpg`,
      contentType: file.type || 'image/jpeg'
    });

    const relativeUrl = response.data?.data?.url || response.data?.url;
    if (!relativeUrl) {
      throw new Error('Failed to retrieve image URL from server');
    }

    // Resolve to full URL if API base url is external
    const serverHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    return relativeUrl.startsWith('http') ? relativeUrl : `${serverHost}${relativeUrl}`;
  }
};

export default imageService;
