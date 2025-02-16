export interface PdfState {
  isUploading: boolean;
  isDownloading: boolean;
  isExtracting: boolean;
  error: string | null;
  pdfFile: File | null;
  extractedImages: string[];
  uploadedFile: string | null;
  imageCount: number;
}

export interface PdfContextType {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  extractedImages: string[];
  setExtractedImages: (urls: string[]) => void;
  isExtracting: boolean;
  setIsExtracting: (value: boolean) => void;
  state: PdfState;
  uploadPdf: (file: File) => Promise<void>;
  downloadImages: (filename: string) => Promise<void>;
  resetState: () => void;
}

export interface PdfProviderProps {
  children: React.ReactNode;
} 