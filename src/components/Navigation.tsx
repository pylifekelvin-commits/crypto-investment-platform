import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store';
import { useNotifications, NotificationCenter } from './NotificationSystem';
import ThemeToggle from './ThemeToggle';
import { cn } from '../utils/cn';
import {
  Home,
  TrendingUp,
  Wallet,
  BookOpen,
  User,
  Settings,
  LogOut,
  Bitcoin,
  Bell,
  Lock,
  Zap,
  BarChart3,
  Clock,
  Coins,
  Shield,
  Gamepad2,
  Palette,
} from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  active?: boolean;
}

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { portfolio } = useAppStore();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Wallet, label: 'Portfolio', path: '/portfolio' },
    { icon: TrendingUp, label: 'Trade', path: '/trade' },
    { icon: Lock, label: 'Vesting', path: '/vesting' },
    { icon: Zap, label: 'Staking', path: '/staking' },
    { icon: Coins, label: 'Earn', path: '/earn' },
    { icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { icon: Palette, label: 'NFT Market', path: '/nft-marketplace' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: BookOpen, label: 'Learn', path: '/education' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass-navbar px-4 md:px-6 py-3 md:py-4"
      >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 md:gap-3"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-xl flex items-center justify-center">
            <Bitcoin className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold text-white">CryptoVest</h1>
            <p className="text-xs text-white/70">Investment Platform</p>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-300 text-sm",
                      isActive
                        ? "bg-white/20 text-white border border-white/30"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium hidden xl:inline">{item.label}</span>
                    {(item.path === '/vesting' || item.path === '/staking' || item.path === '/earn' || item.path === '/gaming' || item.path === '/nft-marketplace') && (
                      <span className="bg-crypto-500 text-white text-xs px-1 py-0.5 rounded-full hidden xl:inline">NEW</span>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button p-2 text-white hover:text-crypto-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Portfolio Value - Only on desktop */}
          {portfolio && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden xl:block"
            >
              <div className="text-right">
                <p className="text-xs text-white/70">Portfolio</p>
                <p className="text-sm font-bold text-white">
                  ${portfolio.totalValue.toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons - Responsive */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Theme Toggle - Hidden on small screens */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Notifications Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(true)}
              className="relative glass-button p-2 text-white hover:text-crypto-400"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Admin Panel Access */}
            {user?.email === 'admin@cryptovest.com' && (
              <Link to="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2 text-white hover:text-red-400 relative"
                  title="Admin Panel"
                >
                  <Shield className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                </motion.button>
              </Link>
            )}
          </div>

          {/* User Profile Section */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-white/70">{user.email}</p>
              </div>
              
              {/* User Avatar */}
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
              </Link>

              {/* Logout Button - Desktop only */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex glass-button px-3 py-2 text-white hover:text-red-400 items-center gap-2 border border-red-400/30 hover:border-red-400"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>

              {/* Mobile Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden glass-button p-2 text-white hover:text-red-400 border border-red-400/30 hover:border-red-400"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <Link to="/auth">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-3 py-2 md:px-4 text-white hover:text-crypto-400 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
      </motion.nav>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default Navigation;