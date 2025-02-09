import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/40">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="text-lg bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
            PDF Extractor
          </span>
        </Link>
        
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" className="text-sm" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-sm" asChild>
            <Link to="/terms">Terms</Link>
          </Button>
          <Button size="sm" className="bg-chart-2 hover:bg-chart-2/90 text-white" asChild>
            <Link to="/">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full justify-between">
                  Get Started <span className="text-chart-2">→</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/terms">Terms</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
} 