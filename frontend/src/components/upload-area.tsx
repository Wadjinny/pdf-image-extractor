import { useDropzone } from 'react-dropzone'
import { UploadCloud, Loader2 } from 'lucide-react'

interface UploadAreaProps {
  isExtracting: boolean
  onDrop: (files: File[]) => void
}

export function UploadArea({ isExtracting, onDrop }: UploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isExtracting
  })

  return (
    <div 
      {...getRootProps()} 
      className={`
        group border-2 border-dashed rounded-xl py-16 px-8 text-center cursor-pointer
        transition-all duration-200 relative overflow-hidden
        dark:bg-muted/5
        hover:border-primary/50 hover:bg-primary/5
        dark:hover:border-primary/50 dark:hover:bg-primary/10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${isDragActive ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-border'}
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
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
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
  )
} 