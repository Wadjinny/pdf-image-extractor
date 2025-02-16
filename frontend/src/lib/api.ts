import { env } from '@/config/env';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export interface ExtractedImage {
  id: string;
  url: string;
  pdf_id: string;
}

export const api = {
  async extractImages(files: File[], download = false): Promise<{ blob?: Blob; imageCount: number; imageUrls?: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${env.apiUrl}/extract-images?download=${download}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(response.status, error.detail || 'Failed to process PDF');
    }

    // Get image count from header
    const imageCount = parseInt(response.headers.get('X-Image-Count') || '0', 10);

    if (download) {
      const blob = await response.blob();
      return { blob, imageCount };
    } else {
      const jsonResponse = await response.json();
      return {
        imageCount,
        imageUrls: jsonResponse.image_urls || []
      };
    }
  },

  async getPdfImages(pdfId: string): Promise<ExtractedImage[]> {
    const response = await fetch(`${env.apiUrl}/pdf/${pdfId}/images`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new APIError(response.status, error.detail || 'Failed to fetch PDF images');
    }

    return response.json();
  },

  getImageUrl(imageId: string): string {
    // imageId is in format "{pdf_id}/{image_filename}"
    return `${env.apiUrl}/images/${imageId}`;
  }
}; 