import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Footer() {
  return (
    <footer className="bg-black/45 relative text-white py-16 px-4  md:px-8 lg:px-16">
      <div className="max-w-[1000px] mx-auto ">
        <div className="mb-6">
          <p>
            Questions? Call{' '}
            <a href="tel:1-844-505-2993" className="hover:underline">
              1-844-505-2993
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div className="space-y-3">
            <a href="/faq" className="block hover:underline">
              FAQ
            </a>
            <a href="/investor-relations" className="block hover:underline">
              Investor Relations
            </a>
            <a href="/buy-gift-cards" className="block hover:underline">
              Buy Gift Cards
            </a>
            <a href="/cookie-preferences" className="block hover:underline">
              Cookie Preferences
            </a>
            <a href="/legal-notices" className="block hover:underline">
              Legal Notices
            </a>
          </div>

          <div className="space-y-3">
            <a href="/help" className="block hover:underline">
              Help Center
            </a>
            <a href="/jobs" className="block hover:underline">
              Jobs
            </a>
            <a href="/ways-to-watch" className="block hover:underline">
              Ways to Watch
            </a>
            <a href="/corporate-information" className="block hover:underline">
              Corporate Information
            </a>
            <a href="/only-on-netflix" className="block hover:underline">
              Only on Netflix
            </a>
          </div>

          <div className="space-y-3">
            <a href="/account" className="block hover:underline">
              Account
            </a>
            <a href="/shop" className="block hover:underline">
              Netflix Shop
            </a>
            <a href="/terms" className="block hover:underline">
              Terms of Use
            </a>
            <a href="/contact" className="block hover:underline">
              Contact Us
            </a>
            <a href="/do-not-sell" className="block hover:underline">
              Do Not Sell or Share Personal Information
            </a>
          </div>

          <div className="space-y-3">
            <a href="/media-center" className="block hover:underline">
              Media Center
            </a>
            <a href="/redeem" className="block hover:underline">
              Redeem Gift Cards
            </a>
            <a href="/privacy" className="block hover:underline">
              Privacy
            </a>
            <a href="/speed-test" className="block hover:underline">
              Speed Test
            </a>
            <a href="/ad-choices" className="block hover:underline">
              Ad Choices
            </a>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-white/40 bg-transparent text-white hover:bg-black/20"
            >
              <Globe className="mr-2 h-4 w-4" />
              English
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Español</DropdownMenuItem>
            <DropdownMenuItem>Français</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </footer>
  );
}
