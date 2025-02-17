'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full px-8 lg:px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between mt-2">
        <a href="#" className="relative h-7 w-28">
          <img src="/images/netflix_logo.png" alt="Netflix" className="object-contain" />
        </a>
        <div className="flex items-center gap-4">
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
          <a href="/login" className="text-white hover:underline">
            <Button size="sm">Sign In</Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
