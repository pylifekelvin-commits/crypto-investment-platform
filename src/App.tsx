import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './components/NotificationSystem';
import VideoBackground from './components/VideoBackground';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Vesting from './pages/Vesting';
import Staking from './pages/Staking';
import Earn from './pages/Earn';
import Gaming from './pages/Gaming';
import Lottery from './pages/Lottery';
import SportsBetting from './pages/SportsBetting';
import CasinoGames from './pages/CasinoGames';
import GamingWallet from './pages/GamingWallet';
import GameHistory from './pages/GameHistory';
import NFTMarketplace from './pages/NFTMarketplace';
import Analytics from './pages/Analytics';
import Education from './pages/Education';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import PasswordReset from './pages/PasswordReset';
import TransactionHistory from './pages/TransactionHistory';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Video Background */}
          <VideoBackground />
          
          <Routes>
            {/* Auth Route - No protection needed */}
            <Route 
              path="/auth" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Auth />
                </ProtectedRoute>
              } 
            />
            
            {/* Password Reset Route */}
            <Route 
              path="/reset-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <PasswordReset />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <AnimatePresence mode="wait">
                    <motion.main
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/trade" element={<Trade />} />
                        <Route path="/vesting" element={<Vesting />} />
                        <Route path="/staking" element={<Staking />} />
                        <Route path="/earn" element={<Earn />} />
                        <Route path="/gaming" element={<Gaming />} />
                        <Route path="/gaming/lottery" element={<Lottery />} />
                        <Route path="/gaming/sports" element={<SportsBetting />} />
                        <Route path="/gaming/casino" element={<CasinoGames />} />
                        <Route path="/gaming/wallet" element={<GamingWallet />} />
                        <Route path="/gaming/history" element={<GameHistory />} />
                        <Route path="/nft-marketplace" element={<NFTMarketplace />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/education" element={<Education />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/history" element={<TransactionHistory />} />
                        <Route path="/admin" element={<AdminPanel />} />
                      </Routes>
                    </motion.main>
                  </AnimatePresence>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
      </NotificationProvider>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;