import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, Loader2, File, Zap, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api, APIError } from '@/lib/api'
import { toast } from 'sonner'
import { usePdf } from '@/lib/pdf-context'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function PdfUploader() {
  const {
    pdfFile,
    setPdfFile,
    extractedImages,
    setExtractedImages,
    isExtracting,
    setIsExtracting
  } = usePdf()

  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE)
    
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the 50MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }

    setIsExtracting(true)
    setError(null)
    setPdfFile(acceptedFiles[0])
    setExtractedImages([])
    
    try {
      // Start progress animation
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 1000)

      // Make API call for instant viewing
      const { imageUrls, imageCount } = await api.extractImages(acceptedFiles, false)
      
      // Clean up and show success
      clearInterval(interval)
      setProgress(100)
      
      setTimeout(() => {
        setIsExtracting(false)
        if (imageUrls) {
          // Convert relative URLs to absolute URLs using the helper function
          const absoluteUrls = imageUrls.map(url => {
            // If the URL is just an ID, use the helper function
            if (!url.startsWith('http') && !url.startsWith('/')) {
              return api.getImageUrl(url)
            }
            return url
          })
          setExtractedImages(absoluteUrls)
        }
      }, 10)
    } catch (error) {
      let message = 'Failed to process files. Please try again.'
      if (error instanceof APIError) {
        message = error.message
      }
      setError(message)
      toast.error(message)
      setPdfFile(null)
    } finally {
      setIsExtracting(false)
    }
  }, [setIsExtracting, setPdfFile, setExtractedImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isExtracting
  })

  const handleDownload = async () => {
    if (!pdfFile) return
    
    setIsDownloading(true)
    try {
      // Make API call for download only when needed
      const { blob } = await api.extractImages([pdfFile], true)
      if (!blob) {
        throw new Error('Failed to get download blob')
      }

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'extracted_images.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download file')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-12 w-full max-w-3xl mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight animate-gradient bg-gradient-to-r from-chart-2 via-chart-3 to-chart-2 bg-[length:200%_auto] bg-clip-text text-transparent sm:text-5xl">
          PDF Image Extractor
        </h1>
        <p className="text-muted-foreground max-w-[42rem] mx-auto text-lg">
          Drag & drop your PDF files to extract high-quality images instantly. Supports multiple files and batch processing.
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`
          group border-2 border-dashed rounded-xl py-16 px-8 text-center cursor-pointer
          transition-all duration-200 relative overflow-hidden
          dark:bg-muted/5
          hover:border-chart-2/50 hover:bg-chart-2/5
          dark:hover:border-chart-2/50 dark:hover:bg-chart-2/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chart-2
          ${isDragActive ? 'border-chart-2 bg-chart-2/10 dark:bg-chart-2/20' : 'border-border'}
          ${isExtracting ? 'opacity-50 pointer-events-none' : ''}
          before:absolute before:inset-0 before:bg-grid-pattern before:opacity-[0.03]
          before:transition-opacity before:duration-200
          group-hover:before:opacity-[0.06]
        `}
        role="button"
        tabIndex={0}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-fit p-4 rounded-full bg-background border">
            {isExtracting ? (
              <Loader2 className="w-8 h-8 text-chart-2 animate-spin" />
            ) : (
              <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-chart-2' : 'text-muted-foreground'}`} />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">
              {isExtracting ? 'Processing Files...' : 'Drag PDFs Here'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isExtracting ? 'Extracting images from your documents' : 'or click to browse files'}
            </p>
          </div>
        </div>
      </div>

      {isExtracting && (
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2 w-full bg-muted" 
            indicatorClassName="bg-chart-2 transition-all duration-300"
          />
          <p className="text-sm text-center text-muted-foreground">
            {Math.round(progress)}% complete - Hang tight!
          </p>
        </div>
      )}

      {extractedImages.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 bg-green-950 text-emerald-400 px-4 py-2 rounded-md">
              <Zap className="w-5 h-5" />
              <span className="font-medium">
                Extracted {extractedImages.length} images successfully!
              </span>
            </div>
            
            <Button 
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-500/90 text-white"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <File className="w-4 h-4 mr-2" />
                  Download extracted_images.zip
                </>
              )}
            </Button>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {extractedImages.map((imageUrl, index) => (
              <div 
                key={imageUrl} 
                className="relative aspect-square rounded-lg overflow-hidden bg-muted/10 border"
              >
                <img
                  src={imageUrl}
                  alt={`Extracted image ${index + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-center animate-in fade-in">
          <div className="inline-flex items-center gap-3 bg-destructive/10 text-destructive px-8 py-4 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground/60 text-center">
        Maximum file size: 50MB
      </p>
    </div>
  )
} 