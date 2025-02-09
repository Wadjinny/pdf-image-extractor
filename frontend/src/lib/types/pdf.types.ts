export interface PdfState {
  isUploading: boolean;
  isDownloading: boolean;
  error: string | null;
  uploadedFile: string | null;
  imageCount: number;
}

export interface PdfContextType {
  state: PdfState;
  uploadPdf: (file: File) => Promise<void>;
  downloadImages: (filename: string) => Promise<void>;
  resetState: () => void;
}

export interface PdfProviderProps {
  children: React.ReactNode;
} 