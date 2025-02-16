import { ImageIcon, Download, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageGridProps {
  images: string[]
  onViewImage: (index: number) => void
}

export function ImageGrid({ images, onViewImage }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl">
        <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/20" />
        <p className="mt-4 text-muted-foreground">No images extracted yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((imageUrl, index) => (
        <div 
          key={imageUrl} 
          className="group relative rounded-xl overflow-hidden bg-muted/10 border hover:border-emerald-500/50 transition-all duration-300"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-muted/5">
            <ImageIcon className="w-8 h-8 text-muted-foreground/20" />
          </div>

          <div className="relative w-full">
            <div className="relative pb-[100%] bg-[#fafafa] dark:bg-black/20">
              <img
                src={imageUrl}
                alt={`Extracted image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-white font-medium">Image {index + 1}</p>
                  <p className="text-xs text-white/70">Original Aspect Ratio • Full Quality</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      const filename = imageUrl.split('/').pop() || `image-${index + 1}.png`
                      fetch(imageUrl)
                        .then(response => response.blob())
                        .then(blob => {
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = filename
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        })
                        .catch(error => {
                          console.error('Failed to download image:', error)
                          toast.error('Failed to download image')
                        })
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => onViewImage(index)}
                  >
                    <Maximize2 className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 