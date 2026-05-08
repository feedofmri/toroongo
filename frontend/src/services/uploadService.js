import { apiUpload } from './api';

export const uploadService = {
  /**
   * Upload one or more media files to the server.
   * Files are optimized server-side (images → WebP, videos → H.264).
   *
   * @param {File[]} files - Array of File objects
   * @param {Function} [onProgress] - Progress callback (0-100)
   * @returns {Promise<{ urls: string[], stats: Array }>}
   */
  async uploadMedia(files, onProgress) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files[]', file));

    return await apiUpload('/upload/media', formData, { onProgress });
  },
};
