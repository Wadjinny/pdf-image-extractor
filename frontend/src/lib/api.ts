const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  async extractImages(files: File[]): Promise<{ blob: Blob; imageCount: number }> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/extract-images`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(response.status, error.detail || 'Failed to process PDF');
    }

    // Get image count from header or response body
    let imageCount = 0;
    const headerImageCount = response.headers.get('X-Image-Count');
    
    if (headerImageCount) {
      imageCount = parseInt(headerImageCount, 10);
    } else {
      // Try to get image count from response body
      const jsonResponse = await response.json();
      imageCount = jsonResponse.image_count || 0;
      // Create a new response with the same headers but new body
      return {
        blob: new Blob([JSON.stringify(jsonResponse)], { type: 'application/json' }),
        imageCount
      };
    }

    const blob = await response.blob();
    return { blob, imageCount };
  }
}; 