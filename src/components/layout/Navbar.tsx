import { Link, useLocation } from 'react-router-dom';
import { Leaf, Info, Sparkles, Menu, ScanSearch, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const navItems = [
  { name: 'Home', path: '/', icon: Leaf },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Advisor', path: '/advisor', icon: Sparkles },
  { name: 'Soil Analyzer', path: '/soil', icon: ScanSearch },
  { name: 'Irrigation', path: '/irrigation', icon: Droplets },
];

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4",
      isScrolled ? "py-3" : "py-6"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-2xl px-6 py-2.5",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-lg border border-white/40 ring-1 ring-black/5" 
          : "bg-transparent"
      )}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent group-hover:rotate-12 transition-all duration-500 shadow-md shadow-primary/20">
            <Leaf size={22} fill="currentColor" className="fill-accent/20" />
          </div>
          <span className="text-xl font-heading font-extrabold text-primary tracking-tight">Cropify</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-xl font-semibold transition-all duration-300 relative group text-sm",
                  isActive 
                    ? "text-primary" 
                    : "text-primary/60 hover:text-primary hover:bg-black/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon size={16} className={cn(isActive ? "text-accent" : "text-primary/40 group-hover:text-primary/60")} />
                  {item.name}
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-accent/10 rounded-xl -z-10 border border-accent/20" 
                  />
                )}
              </Link>
            );
          })}
          
          <div className="h-6 w-px bg-primary/10 mx-2" />
          
          <Link to="/advisor">
            <Button size="sm" variant="primary" className="shadow-sm">
              Launch Advisor
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm border border-white/50 flex items-center justify-center text-primary active:scale-95 transition-all shadow-sm">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}
