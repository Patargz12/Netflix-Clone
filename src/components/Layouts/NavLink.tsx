import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ href, label, className, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === `/${href}`;

  return (
    <motion.span
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <a
        href={`/${href}`}
        onClick={onClick}
        className={cn(
          'text-sm transition-all duration-200 ease-in-out',
          isActive ? 'text-white font-bold' : 'text-white/80 hover:text-white',
          className
        )}
      >
        {label}
        {isActive && (
          <motion.div
            layoutId="activeNavItem"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </a>
    </motion.span>
  );
};

export default NavLink;
