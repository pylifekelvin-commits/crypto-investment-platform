import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import GlassContainer from './GlassContainer';
import { Shield, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <GlassContainer className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Verifying Authentication
            </h2>
            <p className="text-white/70">Please wait while we check your credentials...</p>
          </div>
        </GlassContainer>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Loading component for route transitions
export const RouteLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <GlassContainer className="p-6">
        <div className="flex items-center gap-3">
          <div className="spinner"></div>
          <span className="text-white font-medium">Loading...</span>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

// Unauthorized access component
export const UnauthorizedAccess: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <GlassContainer className="p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">
            {isAuthenticated 
              ? "You don't have permission to access this resource."
              : "Please sign in to access this page."
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="glass-button px-6 py-3 text-white hover:text-crypto-400"
          >
            Go Back
          </motion.button>
        </GlassContainer>
      </motion.div>
    </div>
  );
};

export default ProtectedRoute;