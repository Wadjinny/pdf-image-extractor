import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PdfUploader } from '@/features/pdf/components/pdf-uploader'
import { About } from '@/pages/about'
import { Terms } from '@/pages/terms'
import { ThemeProvider } from '@/lib/theme-provider'
import { PdfProvider } from '@/features/pdf/pdf-context'

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pdf-extractor-theme">
      <PdfProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col antialiased">
            <Nav />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={
                  <div className="container max-w-5xl mx-auto px-4 py-12 md:py-24">
                    <PdfUploader />
                  </div>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            
            <Footer />
            <Toaster position="top-center" richColors closeButton />
          </div>
        </BrowserRouter>
      </PdfProvider>
    </ThemeProvider>
  )
}
