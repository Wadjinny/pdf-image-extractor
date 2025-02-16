export function Footer() {
  return (
    <footer className="border-t bg-muted/50 dark:bg-muted/5 dark:border-border/40">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:items-start">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              PDF Image Extractor
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional-grade PDF image extraction solution
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Contact</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              support@pdfextractor.com<br/>
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground dark:border-border/40">
          © {new Date().getFullYear()} PDF Extractor. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 