import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-700 hover:bg-slate-600'
          : 'bg-yellow-200 hover:bg-yellow-300'
      } ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Toggle Background */}
      <motion.div
        className="absolute inset-0 rounded-full\"
        animate={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Toggle Circle */}
      <motion.div
        className={`relative z-10 w-4 h-4 rounded-full shadow-lg flex items-center justify-center ${
          theme === 'dark' ? 'bg-slate-100' : 'bg-white'
        }`}
        animate={{
          x: theme === 'dark' ? 0 : 24
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 0 : 180,
            scale: theme === 'dark' ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-3 h-3 text-slate-700" />
          ) : (
            <Sun className="w-3 h-3 text-yellow-600" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <div className={`absolute inset-0 rounded-full opacity-20 ${
        theme === 'dark' ? 'bg-blue-400' : 'bg-orange-300'
      }`} />
    </motion.button>
  );
};

export default ThemeToggle;