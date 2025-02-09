import { createContext, useContext, useState, ReactNode } from 'react'

type PdfContextType = {
  pdfFile: File | null
  setPdfFile: (file: File | null) => void
  extractedImages: string[]
  setExtractedImages: (images: string[]) => void
  isExtracting: boolean
  setIsExtracting: (isExtracting: boolean) => void
}

const PdfContext = createContext<PdfContextType | undefined>(undefined)

export function PdfProvider({ children }: { children: ReactNode }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [extractedImages, setExtractedImages] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)

  return (
    <PdfContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        extractedImages,
        setExtractedImages,
        isExtracting,
        setIsExtracting,
      }}
    >
      {children}
    </PdfContext.Provider>
  )
}

export function usePdf() {
  const context = useContext(PdfContext)
  if (context === undefined) {
    throw new Error('usePdf must be used within a PdfProvider')
  }
  return context
} 