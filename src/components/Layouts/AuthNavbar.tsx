'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, Search, X } from 'lucide-react';
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
import { useProfileStore } from '@/store/profileStore';
import { useSearchStore } from '@/store/searchStore';

interface AuthNavbarProps {
  profileImage?: string;
}

const AuthNavbar = ({ profileImage }: AuthNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const profile = useProfileStore((state) => state.profile);

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
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 w-full z-50 transition-colors duration-300',
        isScrolled ? 'bg-background' : 'bg-transparent' // Update: Added bg-transparent
      )}
    >
      <div className="max-w-full mx-4 md:mx-24 flex justify-between items-center px-6 py-8">
        {' '}
        {/* Update: Adjusted div className */}
        {/* Left Section */}
        <div className="flex items-center space-x-2 md:space-x-9">
          <motion.img
            src="/images/netflix_logo.png"
            alt="Netflix Logo"
            className="h-8 w-auto hidden md:block object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          <AnimatePresence>
            {!showSearch && (
              <motion.img
                src="/images/small_netflix.png"
                alt="Netflix Logo"
                className="h-8 w-auto block md:hidden object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, staggerChildren: 0.1 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors"
                aria-label={link.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
        {/* Right Section */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative h-10 flex items-center">
            {showSearch ? (
              <div className="flex items-center bg-background/90 rounded-md overflow-hidden w-full md:w-auto">
                {' '}
                {/* Update: Added w-full md:w-auto */}
                <Input
                  placeholder="Titles, people, genres"
                  className="w-full h-10 bg-transparent border-none text-white placeholder:text-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="secondary"
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
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <motion.button
            type="button"
            className="text-white hidden md:block hover:text-white/80 transition-colors"
            aria-label="Notifications"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="h-5 w-5" />
          </motion.button>

          {/* Profile Section */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="items-center hidden md:flex space-x-1 focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.imageUrl || '/images/profile/user_profile.png'}
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
                <motion.button
                  type="button"
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="Open menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-sm"
              >
                <SheetHeader>
                  <div className="flex flex-row space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/profile/user_profile.png" alt="Profile" />
                      <AvatarFallback className="bg-muted">
                        <span className="sr-only">Profile</span>
                      </AvatarFallback>
                    </Avatar>
                    <SheetTitle className="text-left text-white mt-1">My Netflix</SheetTitle>
                  </div>
                </SheetHeader>
                <motion.div
                  className="flex flex-col space-y-4 mt-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, staggerChildren: 0.1 }}
                >
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      className="text-lg text-white/80 hover:text-white transition-colors"
                      aria-label={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </motion.div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default AuthNavbar;
