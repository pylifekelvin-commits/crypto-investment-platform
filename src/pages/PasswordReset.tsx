import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../components/NotificationSystem';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Key,
  Lock,
  Eye,
  EyeOff,
  Send,
  Bitcoin,
} from 'lucide-react';

type ResetStep = 'email' | 'sent' | 'reset' | 'success';

const PasswordReset: React.FC = () => {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();
  const { showNotification } = useNotifications();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setStep('sent');
      showNotification({
        type: 'success',
        title: 'Reset Link Sent',
        message: 'Check your email for password reset instructions.',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Reset Failed',
        message: 'Unable to send reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showNotification({
        type: 'error',
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please try again.',
      });
      return;
    }

    if (newPassword.length < 8) {
      showNotification({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password reset API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
      showNotification({
        type: 'success',
        title: 'Password Reset',
        message: 'Your password has been successfully updated.',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Reset Failed',
        message: 'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
              <p className="text-white/70">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-crypto-500 to-crypto-600 text-white font-bold rounded-xl hover:from-crypto-600 hover:to-crypto-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        );

      case 'sent':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-white/70 mb-6">
              We've sent a password reset link to <span className="text-crypto-400 font-medium">{email}</span>
            </p>
            <p className="text-white/60 text-sm mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('reset')}
                className="w-full glass-button py-3 text-white hover:text-crypto-400"
              >
                I have the reset code
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isLoading}
                className="w-full glass-button py-3 text-white/70 hover:text-white"
              >
                {isLoading ? <div className="spinner w-4 h-4" /> : 'Resend Email'}
              </motion.button>
            </div>
          </motion.div>
        );

      case 'reset':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-white/70">
                Enter the reset code from your email and create a new password.
              </p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Enter reset code"
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  required
                  className="w-full pl-12 pr-12 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !resetToken || !newPassword || !confirmPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-crypto-500 to-crypto-600 text-white font-bold rounded-xl hover:from-crypto-600 hover:to-crypto-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Password Updated!</h2>
            <p className="text-white/70 mb-8">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-crypto-500 to-crypto-600 text-white font-bold rounded-xl hover:from-crypto-600 hover:to-crypto-700 transition-all duration-300"
              >
                Sign In Now
              </motion.button>
            </Link>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/auth" className="inline-flex items-center gap-2 text-crypto-400 hover:text-crypto-300 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          
          <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Main Content */}
        <GlassContainer animationDelay={0.2}>
          <div className="p-8">
            {renderStep()}
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default PasswordReset;