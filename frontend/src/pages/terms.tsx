import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, FileText, Users, Lock, Cpu, AlertTriangle, RefreshCcw, Mail } from "lucide-react"

export function Terms() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to PDF Image Extractor. By using our service, you agree to these terms.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Section 1 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using PDF Image Extractor, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <FileText className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">2. Service Description</h2>
                <p className="text-muted-foreground">
                  PDF Image Extractor provides PDF image extraction services. We allow users to upload PDF files and extract images contained within them.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 3 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <Users className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">3. User Obligations</h2>
                <ul className="space-y-2 text-muted-foreground list-disc pl-4">
                  <li>You must provide accurate information when using our service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You must not use the service for any illegal or unauthorized purpose</li>
                  <li>You must not upload malicious files or content</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 4 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">4. Privacy and Data</h2>
                <p className="text-muted-foreground">
                  We handle your data in accordance with our Privacy Policy. We do not store uploaded PDF files longer than necessary to provide the service.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 5 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <Cpu className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">5. Service Limitations</h2>
                <ul className="space-y-2 text-muted-foreground list-disc pl-4">
                  <li>Maximum file size: 50MB per PDF</li>
                  <li>Supported format: PDF files only</li>
                  <li>Processing time may vary based on file size and complexity</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 6 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">6. Disclaimers</h2>
                <p className="text-muted-foreground">
                  The service is provided "as is" without warranties of any kind. We are not responsible for any damages that result from your use of the service.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 7 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <RefreshCcw className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">7. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-6">
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-chart-2 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="text-muted-foreground space-y-1">
                  <p>For any questions about these terms, please contact us at:</p>
                  <p>Email: support@pdfextractor.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
} 