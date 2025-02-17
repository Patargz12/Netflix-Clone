import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Search, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/searchStore';

interface AuthNavbarProps {
  profileImage?: string;
}

const AuthNavbar = ({ profileImage }: AuthNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();

  // Handle navbar background on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const navLinks = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'TV Shows' },
    { href: '#', label: 'Movies' },
    { href: '#', label: 'New & Popular' },
    { href: '#', label: 'My List' },
    { href: '#', label: 'Browse By Languages' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-colors duration-300',
        isScrolled ? 'bg-background' : 'bg-transparent'
      )}
    >
      <div className="max-w-full mx-4 md:mx-24 flex transition justify-between items-center px-6 py-8">
        {/* Left Section */}
        <div className="flex items-center space-x-2 md:space-x-9">
          <img
            src="/images/netflix_logo.png"
            alt="Netflix Logo"
            className="h-8 w-auto hidden md:block object-contain"
          />

          <img
            src="/images/small_netflix.png"
            alt="Netflix Logo"
            className="h-8 w-auto block md:hidden object-contain"
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center bg-background/90 rounded-md">
                <Input
                  type="search"
                  placeholder="Titles, people, genres"
                  className="w-[200px] bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="p-2 text-white hover:text-white/80"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="text-white hover:text-white/80 mt-2 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            type="button"
            className="text-white hidden md:block hover:text-white/80 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Profile Section */}
          <div className="flex items-center space-x-2">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profileImage || '/images/profile/user_profile.png'}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-muted">
                    <span className="sr-only">Profile</span>
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32 mt-2 bg-background/95 backdrop-blur-sm text-white border-white/20">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="focus:bg-white/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <a href="/accounts">
                    <span>Sign out</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <button
                  type="button"
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-sm"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg text-white/80 hover:text-white transition-colors"
                      aria-label={link.label}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
