import axios from 'axios';
import { API_CONFIG } from '../constants';

interface UploadResponse {
  message: string;
  image_count: number;
  filename?: string;
}

export class PdfService {
  private static baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  static async uploadPdf(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // First get the JSON response
      const response = await axios.post<UploadResponse>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.UPLOAD}`,
        formData,
        {
          headers: {},
        }
      );

      // If successful, download the ZIP file
      const downloadFormData = new FormData();
      downloadFormData.append('file', file);
      
      const downloadResponse = await axios.post(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.UPLOAD}?download=true`,
        downloadFormData,
        {
          responseType: 'blob',
          headers: {},
        }
      );

      // Handle the ZIP file download
      const blob = new Blob([downloadResponse.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}_images.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return {
        message: response.data.message,
        image_count: response.data.image_count,
        filename: response.data.filename,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 'Failed to upload PDF';
        console.error('Upload error:', error.response?.data);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  static async downloadImages(filename: string): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseUrl}${API_CONFIG.ENDPOINTS.DOWNLOAD}/${filename}/images`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to download images');
      }
      throw error;
    }
  }
} 