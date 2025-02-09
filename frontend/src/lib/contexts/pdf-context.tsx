import React, { createContext, useContext, useReducer } from 'react';
import { PdfService } from '../services/pdf.service';
import { PdfState, PdfContextType, PdfProviderProps } from '../types/pdf.types';

const initialState: PdfState = {
  isUploading: false,
  isDownloading: false,
  error: null,
  uploadedFile: null,
  imageCount: 0,
};

type PdfAction =
  | { type: 'START_UPLOAD' }
  | { type: 'UPLOAD_SUCCESS'; payload: { filename: string; imageCount: number } }
  | { type: 'UPLOAD_ERROR'; payload: string }
  | { type: 'START_DOWNLOAD' }
  | { type: 'DOWNLOAD_SUCCESS' }
  | { type: 'DOWNLOAD_ERROR'; payload: string }
  | { type: 'RESET' };

function pdfReducer(state: PdfState, action: PdfAction): PdfState {
  switch (action.type) {
    case 'START_UPLOAD':
      return { ...state, isUploading: true, error: null };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        isUploading: false,
        uploadedFile: action.payload.filename,
        imageCount: action.payload.imageCount,
        error: null,
      };
    case 'UPLOAD_ERROR':
      return { ...state, isUploading: false, error: action.payload };
    case 'START_DOWNLOAD':
      return { ...state, isDownloading: true, error: null };
    case 'DOWNLOAD_SUCCESS':
      return { ...state, isDownloading: false, error: null };
    case 'DOWNLOAD_ERROR':
      return { ...state, isDownloading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const PdfContext = createContext<PdfContextType | null>(null);

export function PdfProvider({ children }: PdfProviderProps) {
  const [state, dispatch] = useReducer(pdfReducer, initialState);

  const uploadPdf = async (file: File) => {
    dispatch({ type: 'START_UPLOAD' });
    try {
      const response = await PdfService.uploadPdf(file);
      dispatch({
        type: 'UPLOAD_SUCCESS',
        payload: { filename: file.name, imageCount: response.imageCount },
      });
    } catch (error) {
      dispatch({
        type: 'UPLOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to upload PDF',
      });
    }
  };

  const downloadImages = async (filename: string) => {
    dispatch({ type: 'START_DOWNLOAD' });
    try {
      const blob = await PdfService.downloadImages(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace('.pdf', '')}_images.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      dispatch({ type: 'DOWNLOAD_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'DOWNLOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to download images',
      });
    }
  };

  const resetState = () => dispatch({ type: 'RESET' });

  return (
    <PdfContext.Provider value={{ state, uploadPdf, downloadImages, resetState }}>
      {children}
    </PdfContext.Provider>
  );
}

export function usePdf() {
  const context = useContext(PdfContext);
  if (!context) {
    throw new Error('usePdf must be used within a PdfProvider');
  }
  return context;
} 