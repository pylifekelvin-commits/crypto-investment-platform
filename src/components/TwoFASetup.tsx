import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../components/NotificationSystem';
import {
  Shield,
  Smartphone,
  QrCode,
  Copy,
  CheckCircle,
  AlertCircle,
  Key,
  Download,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

type TwoFAStep = 'intro' | 'setup' | 'verify' | 'backup' | 'complete';

interface TwoFASetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFASetup: React.FC<TwoFASetupProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<TwoFAStep>('intro');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);
  const [backupDownloaded, setBackupDownloaded] = useState(false);

  const { enable2FA, verify2FA } = useAuth();
  const { showNotification } = useNotifications();

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
  };

  const handleSetupStart = async () => {
    setIsLoading(true);
    try {
      const qrUrl = await enable2FA();
      setQrCodeUrl(qrUrl);
      setSecretKey('JBSWY3DPEHPK3PXP'); // Mock secret key
      setBackupCodes(generateBackupCodes());
      setStep('setup');
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Setup Failed',
        message: 'Unable to generate 2FA setup. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      showNotification({
        type: 'error',
        title: 'Invalid Code',
        message: 'Please enter a 6-digit verification code.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await verify2FA(verificationCode);
      setStep('backup');
      showNotification({
        type: 'success',
        title: 'Verification Successful',
        message: '2FA has been enabled for your account.',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Verification Failed',
        message: 'Invalid verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    setSecretCopied(true);
    showNotification({
      type: 'success',
      title: 'Copied',
      message: 'Secret key copied to clipboard.',
    });
    setTimeout(() => setSecretCopied(false), 3000);
  };

  const downloadBackupCodes = () => {
    const content = `CryptoVest - Two-Factor Authentication Backup Codes\\n\\nGenerated: ${new Date().toLocaleString()}\\n\\n${backupCodes.join('\\n')}\\n\\nImportant: Store these codes in a safe place. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cryptovest-2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    setBackupDownloaded(true);
  };

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onClose();
      // Reset state
      setStep('intro');
      setVerificationCode('');
      setSecretCopied(false);
      setBackupDownloaded(false);
    }, 3000);
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Enable Two-Factor Authentication</h2>
            <p className="text-white/70 mb-6">
              Add an extra layer of security to your account by enabling 2FA. You'll need an authenticator app like Google Authenticator or Authy.
            </p>
            
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-crypto-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Install an authenticator app</p>
                  <p className="text-white/60 text-sm">Download Google Authenticator, Authy, or similar app</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-crypto-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Scan QR code</p>
                  <p className="text-white/60 text-sm">Use your app to scan the QR code we'll provide</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-crypto-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Verify setup</p>
                  <p className="text-white/60 text-sm">Enter the 6-digit code from your app</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSetupStart}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-crypto-500 to-crypto-600 text-white font-bold rounded-xl hover:from-crypto-600 hover:to-crypto-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="spinner" />
              ) : (
                <>
                  <span>Start Setup</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        );

      case 'setup':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Scan QR Code</h2>
              <p className="text-white/70">Use your authenticator app to scan this QR code</p>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block p-4 glass rounded-2xl">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Manual Entry Key</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={secretKey}
                  readOnly
                  className="flex-1 p-3 glass rounded-xl text-white bg-transparent border border-white/20 font-mono text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copySecretKey}
                  className={`px-4 py-3 rounded-xl transition-all ${
                    secretCopied 
                      ? 'bg-green-500 text-white' 
                      : 'glass-button text-white hover:text-crypto-400'
                  }`}
                >
                  {secretCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </motion.button>
              </div>
              <p className="text-white/50 text-xs mt-2">
                Can't scan? Manually enter this key in your authenticator app
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('intro')}
                className="flex-1 glass-button py-3 text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('verify')}
                className="flex-1 bg-crypto-500 py-3 rounded-xl text-white hover:bg-crypto-600 transition-colors"
              >
                Next Step
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 'verify':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Verify Setup</h2>
              <p className="text-white/70">Enter the 6-digit code from your authenticator app</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full p-4 glass rounded-xl text-white bg-transparent border border-white/20 text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                autoComplete="off"
              />
              <p className="text-white/50 text-sm text-center mt-2">
                Enter the current code from your authenticator app
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('setup')}
                className="flex-1 glass-button py-3 text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerification}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1 bg-crypto-500 py-3 rounded-xl text-white hover:bg-crypto-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <span>Verify & Enable</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        );

      case 'backup':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Save Backup Codes</h2>
              <p className="text-white/70">These codes can be used if you lose access to your authenticator app</p>
            </div>

            <div className="glass p-4 rounded-xl mb-6">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <div key={index} className="text-white font-mono text-sm text-center py-2 glass rounded">
                    {code}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-yellow-400 mb-4">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Important: Save these codes securely</span>
              </div>
              
              <ul className="text-white/70 text-xs space-y-1">
                <li>• Each code can only be used once</li>
                <li>• Keep them in a safe, offline location</li>
                <li>• Don't share them with anyone</li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadBackupCodes}
              className={`w-full py-3 rounded-xl transition-all mb-4 flex items-center justify-center gap-2 ${
                backupDownloaded
                  ? 'bg-green-500 text-white'
                  : 'glass-button text-white hover:text-crypto-400'
              }`}
            >
              {backupDownloaded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Backup Codes</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={!backupDownloaded}
              className="w-full py-4 bg-gradient-to-r from-crypto-500 to-crypto-600 text-white font-bold rounded-xl hover:from-crypto-600 hover:to-crypto-700 transition-all duration-300 disabled:opacity-50"
            >
              Complete Setup
            </motion.button>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">2FA Enabled Successfully!</h2>
            <p className="text-white/70 mb-8">
              Your account is now protected with two-factor authentication. You'll need your authenticator app for future sign-ins.
            </p>
            <div className="animate-pulse">
              <p className="text-crypto-400 font-medium">Closing automatically...</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-crypto-400" />
            <h1 className="text-lg font-bold text-white">Two-Factor Authentication</h1>
          </div>
          {step !== 'complete' && (
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {renderStep()}
      </motion.div>
    </motion.div>
  );
};

export default TwoFASetup;